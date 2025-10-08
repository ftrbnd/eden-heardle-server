import { Request, Response } from 'express';
import { CustomHeardle } from '@packages/database';
import * as db from '@packages/database/queries';
import { downloadMp3 } from '../helpers/downloadMp3';
import { Heardle, logger } from '../utils/logger';
import supabase from '../lib/supabase';
import { deleteSchema, postSchema } from '../utils/schema';

const createCustomHeardle = async (req: Request, res: Response) => {
  try {
    const { song, startTime, userId } = postSchema.parse(req.body);

    logger(Heardle.Custom, `POST request from User #${userId}`);

    const customHeardle = (await downloadMp3(song, startTime, Heardle.Custom, userId)) as CustomHeardle;
    const link = `https://eden-heardle.io/play/${customHeardle.id}`;

    logger(Heardle.Custom, 'Successfully created Custom Heardle');
    res.json({ message: 'Successfully created Custom Heardle', link });
  } catch (error: any) {
    logger(Heardle.Custom, error);
    res.status(400).json({ message: 'Failed to create Custom Heardle', error: error.message });
  }
};

const deleteCustomHeardle = async (req: Request, res: Response) => {
  try {
    const { heardleId, userId } = deleteSchema.parse(req.body);

    logger(Heardle.Custom, `DELETE request from User #${userId}`);

    // Delete from Database
    await db.deleteCustomHeardle(heardleId, userId);

    // Delete from Storage
    const { error: deleteError } = await supabase.storage.from('custom_heardles').remove([`custom_song_${heardleId}.mp3`]);
    if (deleteError) {
      logger(Heardle.Custom, deleteError);
      res.status(500).json({ message: 'Failed to delete Custom Heardle from bucket' });
    }

    logger(Heardle.Custom, 'Successfully deleted Custom Heardle');
    res.json({ message: 'Successfully deleted Custom Heardle' });
  } catch (error: any) {
    logger(Heardle.Custom, error);
    res.status(400).json({ message: 'Failed to delete Custom Heardle', error: error.message });
  }
};

export { createCustomHeardle, deleteCustomHeardle };
