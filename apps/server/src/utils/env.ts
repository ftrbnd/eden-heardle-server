import dotenv from 'dotenv';

const path = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path });

import z from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),

  SUPABASE_KEY: z.string(),
  SUPABASE_URL: z.string().url(),

  DAILY_HEARDLE_CRON_UTC_HOUR: z.coerce.number().or(z.literal('*')),
  DAILY_HEARDLE_CRON_UTC_MINUTE: z.coerce.number().or(z.literal('*')),
  DAILY_HEARDLE_DEV_MINUTE_FREQUENCY: z.coerce.number().optional().default(5),

  UNLIMITED_HEARDLE_CRON_UTC_HOUR: z.coerce.number(),
  UNLIMITED_HEARDLE_CRON_UTC_MINUTE: z.coerce.number(),

  CLIENT_DOMAIN: z.string().optional(),
  WHITELISTED_DOMAINS: z.string(),
  WEBHOOK_URL: z.string().url(),
  DISCORD_TOKEN: z.string(),
  REDIS_URL: z.string().url(),

  VERCEL_WEBHOOK_SECRET: z.string(),
  VERCEL_PROJECT_ID: z.string(),
  VERCEL_API_TOKEN: z.string(),

  PORT: z.coerce.number(),
  PAPERTRAIL_API_TOKEN: z.string(),
  NODE_ENV: z.enum(['production', 'development', 'test'])
});

export const env = envSchema.parse(process.env);
