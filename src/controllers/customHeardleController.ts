import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { downloadMp3 } from '../utils/downloadMp3';
import { Heardle, logger } from '../utils/logger';
import { parseDeleteRequest, parseGetRequest } from '../utils/parseRequestBody';

const createCustomHeardle = async (req: Request, res: Response) => {
  try {
    const { song, startTime, customId, userId } = parseGetRequest(req.body);

    logger(Heardle.Custom, `POST request from User #${userId}`);

    await downloadMp3(song, startTime, customId, userId);

    logger(Heardle.Custom, 'Successfully created Custom Heardle');
    res.json({ message: 'Successfully created Custom Heardle' });
  } catch (error: unknown) {
    logger(Heardle.Custom, error);
    res.status(400).json({ message: 'Failed to create Custom Heardle' });
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
  } catch (error) {
    logger(Heardle.Custom, error);
    res.status(400).json({ message: 'Failed to delete Custom Heardle' });
  }
};

export { createCustomHeardle, deleteCustomHeardle };
