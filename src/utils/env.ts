import dotenv from 'dotenv';
dotenv.config();

import z from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),
  SUPABASE_URL: z.string(),

  DAILY_HEARDLE_CRON_UTC_HOUR: z.coerce.number(),
  DAILY_HEARDLE_CRON_UTC_MINUTE: z.coerce.number(),

  UNLIMITED_HEARDLE_CRON_UTC_HOUR: z.coerce.number(),
  UNLIMITED_HEARDLE_CRON_UTC_MINUTE: z.coerce.number(),

  PAPERTRAIL_API_TOKEN: z.string(),

  WHITELISTED_DOMAINS: z.string(),
  PORT: z.coerce.number()
});

export const env = envSchema.parse(process.env);
