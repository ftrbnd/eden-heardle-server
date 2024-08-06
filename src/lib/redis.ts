import { Redis } from 'ioredis';
import { z } from 'zod';
import { env } from '../utils/env';

export const redis = new Redis(env.REDIS_URL).on('connect', () => {
  console.log('[Redis] Connected to eden-heardle-announcements');
});

export const announcementSchema = z.object({
  showBanner: z.boolean(),
  text: z.string(),
  link: z.string().optional().nullable(),
  status: z.enum(['success', 'info', 'error'])
});
