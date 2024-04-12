import { z } from 'zod';
import { Song } from '@prisma/client';

export const postSchema = z.object({
  song: z.custom<Song>(),
  startTime: z.coerce.number(),
  userId: z.string()
});

export const deleteSchema = z.object({
  heardleId: z.string(),
  userId: z.string()
});
