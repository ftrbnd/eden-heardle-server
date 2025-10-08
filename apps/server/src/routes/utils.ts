import { RequestHandler, Router } from 'express';
import { env } from '../utils/env';
import crypto from 'crypto';
import { z } from 'zod';
import { redis } from '../lib/redis';
import { createEmbed, discordWebhook } from '../lib/webhook';
import { ColorResolvable } from 'discord.js';

const utilRouter = Router();

const payloadSchema = z.object({
  budgetAmount: z.coerce.number(),
  currentSpend: z.coerce.number(),
  teamId: z.string(),
  type: z.enum(['endOfBillingCycle']).optional() // end of billing cycle
});
type Payload = z.infer<typeof payloadSchema>;

const verifySignature: RequestHandler = (req, res, next) => {
  const payload = req.body.toString();
  const signature = crypto.createHmac('sha1', env.VERCEL_WEBHOOK_SECRET).update(payload).digest('hex');

  const valid = signature === req.headers['x-vercel-signature'];
  if (!valid) {
    return res.status(403).json({ error: 'Invalid signature' });
  }

  next();
};

const unpauseProject = async (teamId: string) => {
  const res = await fetch(`https://api.vercel.com/v1/projects/${env.VERCEL_PROJECT_ID}/unpause?teamId=${teamId}`, {
    headers: {
      Authorization: `Bearer ${env.VERCEL_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error('Failed to send unpause project request to Vercel API');
  }
};

const updateBanner = async (showBanner: boolean) => {
  await redis.set('show_banner', showBanner ? 'true' : 'false');
  if (!showBanner) return;

  await redis.set('text', 'EDEN Heardle is currently disabled');
  await redis.set('link', 'https://discord.gg/futurebound');
  await redis.set('status', 'error');
};

const sendDiscordWebhook = async (payload: Payload) => {
  const description =
    payload.type === 'endOfBillingCycle'
      ? 'Current billing cycle ended - unpausing EDEN Heardle...'
      : `100% of spend amount ($${payload.currentSpend}/$${payload.budgetAmount}) has been reached - EDEN Heardle has been paused.`;
  const color: ColorResolvable = payload.type === 'endOfBillingCycle' ? 0x32ff25 : 0xdf0000;
  const embed = createEmbed('Received Vercel webhook', description, color);

  await discordWebhook.send({ embeds: [embed] });
};

utilRouter.post('/pause', verifySignature, async (req, res) => {
  try {
    const payload = payloadSchema.parse(req.body);
    await sendDiscordWebhook(payload);

    const endOfBillingCycle = payload.type === 'endOfBillingCycle';
    if (endOfBillingCycle) {
      unpauseProject(payload.teamId);
    }

    await updateBanner(!endOfBillingCycle);

    res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      const errorEmbed = createEmbed(err.name, err.message, 0xdf0000);
      await discordWebhook.send({ embeds: [errorEmbed] });
    }
    res.status(500).json({ error: 'internal' });
  }
});

export { utilRouter };
