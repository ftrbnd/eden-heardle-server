import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { downloadMp3 } from '../utils/downloadMp3';
import { Heardle, logger } from '../utils/logger';
import { parseDeleteRequest, parsePostRequest } from '../utils/parseRequestBody';
import { CustomHeardle } from '@prisma/client';
import supabase from '../lib/supabase';

const createCustomHeardle = async (req: Request, res: Response) => {
  try {
    const { song, startTime, userId } = parsePostRequest(req.body);

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
    const { heardleId, userId } = parseDeleteRequest(req.body);

    logger(Heardle.Custom, `DELETE request from User #${userId}`);

    // Delete from Database
    await prisma.customHeardle.delete({
      where: { id: heardleId, userId }
    });

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
