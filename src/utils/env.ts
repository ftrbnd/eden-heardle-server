import dotenv from 'dotenv';
dotenv.config();

import z from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string(),
  SUPABASE_URL: z.string().url(),

  DAILY_HEARDLE_CRON_UTC_HOUR: z.coerce.number(),
  DAILY_HEARDLE_CRON_UTC_MINUTE: z.coerce.number(),

  UNLIMITED_HEARDLE_CRON_UTC_HOUR: z.coerce.number(),
  UNLIMITED_HEARDLE_CRON_UTC_MINUTE: z.coerce.number(),

  WHITELISTED_DOMAINS: z.string(),
  WEBHOOK_URL: z.string().url(),
  DISCORD_TOKEN: z.string(),
  REDIS_URL: z.string().url(),
  PROXY_URIS: z.string().transform((val) => val.split(',')),

  PORT: z.coerce.number(),
  PAPERTRAIL_API_TOKEN: z.string(),
  NODE_ENV: z.enum(['production', 'development']).optional()
});

export const env = envSchema.parse(process.env);
