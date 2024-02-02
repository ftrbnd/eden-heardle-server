import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { downloadMp3 } from '../utils/downloadMp3';
import { Heardle, logger } from '../utils/logger';
import { parseDeleteRequest, parsePostRequest } from '../utils/parseRequestBody';

const createCustomHeardle = async (req: Request, res: Response) => {
  try {
    const { song, startTime, userId } = parsePostRequest(req.body);

    logger(Heardle.Custom, `POST request from User #${userId}`);

    const link = await downloadMp3(song, startTime, userId);

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

    await prisma.customHeardle.delete({
      where: { id: heardleId, userId }
    });

    logger(Heardle.Custom, 'Successfully deleted Custom Heardle');
    res.json({ message: 'Successfully deleted Custom Heardle' });
  } catch (error: any) {
    logger(Heardle.Custom, error);
    res.status(400).json({ message: 'Failed to delete Custom Heardle', error: error.message });
  }
};

export { createCustomHeardle, deleteCustomHeardle };
