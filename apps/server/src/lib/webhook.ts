import { ColorResolvable, EmbedBuilder, WebhookClient } from 'discord.js';
import { env } from '../utils/env';

export const discordWebhook = new WebhookClient({ url: env.WEBHOOK_URL });

export const createEmbed = (title: string, description: string, color: ColorResolvable) => {
  const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(color);
  return embed;
};
