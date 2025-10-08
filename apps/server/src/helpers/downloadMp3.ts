import { CustomHeardle, DailySong, Song, UnlimitedHeardle } from '@prisma/client';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { readFileSync, promises, unlinkSync } from 'fs';
import { Blob } from 'buffer';
import prisma from '../lib/prisma';
import supabase from '../lib/supabase';
import { logger, Heardle } from '../utils/logger';
import { createId } from '@paralleldrive/cuid2';

type Mp3File = Blob & {
  name: string;
  lastModified: number;
  webkitRelativePath: string;
};

ffmpeg.setFfmpegPath(ffmpegPath);

export async function downloadSong(heardleType: Heardle, song: Song) {
  const songFilename = `${song.name.replace(/\W/g, '').toLowerCase()}.mp3`;

  const { data, error } = await supabase.storage.from('song').download(songFilename);
  if (error) throw error;

  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await promises.writeFile(songFilename, buffer);

  logger(heardleType, `${songFilename} downloaded successfully!`);
  return songFilename;
}

export async function trimSong(heardleType: Heardle, songFilename: string, startTime: number): Promise<string> {
  const newFilename = heardleType === Heardle.Daily ? 'daily_song.mp3' : heardleType === Heardle.Custom ? 'custom_song.mp3' : 'unlimited_song.mp3';

  return new Promise((resolve, reject) => {
    // Trim song to 6 seconds
    ffmpeg(songFilename)
      .setStartTime(startTime)
      .setDuration(6)
      // @ts-ignore: Property 'on' does not exist on type 'FfmpegCommand'
      .on('end', async () => {
        logger(heardleType, `File trimming complete!`);
        resolve(newFilename);
      })
      .on('error', (err: unknown) => {
        logger(heardleType, `Error trimming ${songFilename}`);
        reject(err);
      })
      .save(newFilename);
  });
}

export async function getMp3File(heardleType: Heardle, fileName: string): Promise<Mp3File> {
  return new Promise((resolve, reject) => {
    try {
      const fileBuffer = readFileSync(fileName);

      const mp3Blob = new Blob([fileBuffer], { type: 'audio/mp3' });
      logger(heardleType, 'New .mp3 blob: ', mp3Blob);

      const mp3File = Object.assign(mp3Blob, {
        name: fileName,
        lastModified: new Date().getTime(),
        webkitRelativePath: ''
      });

      resolve(mp3File);
    } catch (err: unknown) {
      logger(heardleType, 'Failed to get .mp3 file');
      reject(err);
    }
  });
}

export async function uploadToDatabase(heardleType: Heardle, mp3File: Mp3File, song: Song, startTime: number, userId?: string): Promise<DailySong | CustomHeardle | UnlimitedHeardle> {
  switch (heardleType) {
    case Heardle.Daily:
      // get current daily song and ensure it exists
      const previousDailySong = await prisma.dailySong.findUnique({
        where: {
          id: '0'
        }
      });
      if (!previousDailySong || previousDailySong.heardleDay === null || previousDailySong.heardleDay === undefined) throw new Error(`Couldn't find previous daily song or its day number`);

      logger(heardleType, "Removing yesterday's song...");

      // delete previous daily song from storage
      const { error: deleteError } = await supabase.storage.from('daily_song').remove([`daily_song_${previousDailySong.heardleDay}.mp3`]);
      if (deleteError) {
        logger(heardleType, deleteError);
        // throw new Error("${heardleType} Failed to delete yesterday's song")
        // Don't throw Error because this isn't necessary; we can store multiple songs in the storage bucket
      }

      logger(heardleType, `Uploading to Supabase...`);

      const { error: dailyUploadError } = await supabase.storage.from('daily_song').upload(`daily_song_${previousDailySong.heardleDay + 1}.mp3`, mp3File as any);
      if (dailyUploadError) {
        throw new Error(dailyUploadError.message);
      }

      logger(heardleType, 'Getting signed url...');

      const { data: dailyData, error: dailyUrlError } = await supabase.storage.from('daily_song').createSignedUrl(`daily_song_${previousDailySong.heardleDay + 1}.mp3`, 172800); // expires in 48 hours
      if (dailyUrlError) {
        throw new Error(dailyUrlError.message);
      }

      logger(heardleType, 'Upserting Daily Heardle object...');

      await prisma.dailySong.upsert({
        where: {
          id: '1'
        },
        update: {
          name: song.name,
          album: song.album,
          cover: song.cover,
          link: dailyData?.signedUrl,
          startTime: startTime,
          heardleDay: previousDailySong.heardleDay + 1
          // 'nextReset' field is not needed with a cron job
        },
        create: {
          id: '1',
          name: song.name,
          album: song.album,
          cover: song.cover,
          link: dailyData?.signedUrl ?? song.link,
          startTime: startTime,
          heardleDay: previousDailySong.heardleDay + 1
        }
      });

      logger(heardleType, 'Saved audio url to Custom Heardle object in Supabase Database');

      return previousDailySong;
    case Heardle.Custom:
      if (!userId) throw new Error('User Id is required');
      const customId = createId();

      // upload custom heardle song to separate supabase storage folder
      const userAlreadyHasCustomHeardle = await prisma.customHeardle.findUnique({
        where: {
          userId
        }
      });
      if (userAlreadyHasCustomHeardle) throw new Error(`User already has a Custom Heardle`);

      logger(heardleType, `Uploading to Supabase...`);

      const { error: customUploadError } = await supabase.storage.from('custom_heardles').upload(`custom_song_${customId}.mp3`, mp3File as any);
      if (customUploadError) {
        throw new Error(customUploadError.message);
      }

      logger(heardleType, 'Getting signed url...');

      const { data: customData, error: customUrlError } = await supabase.storage.from('custom_heardles').createSignedUrl(`custom_song_${customId}.mp3`, 172800); // expires in 48 hours
      if (customUrlError) {
        throw new Error(customUrlError.message);
      }

      logger(heardleType, 'Creating Custom Heardle object...');

      const customHeardle = await prisma.customHeardle.create({
        data: {
          id: customId,
          userId,
          name: song.name,
          album: song.album,
          cover: song.cover,
          link: customData?.signedUrl ?? song.link,
          startTime: startTime,
          duration: song.duration
        }
      });

      logger(heardleType, `Saved audio url to Custom Heardle #${customId} in Supabase Database`);

      return customHeardle;
    case Heardle.Unlimited:
      logger(heardleType, `Uploading to Supabase...`);
      const heardleId = createId();

      const { error: unlimitedUploadError } = await supabase.storage.from('unlimited_heardles').upload(`unlimited_heardle_${heardleId}.mp3`, mp3File as any);
      if (unlimitedUploadError) {
        throw new Error(unlimitedUploadError.message);
      }

      logger(heardleType, 'Getting signed url...');

      const { data: unlimitedData, error: unlimitedUrlError } = await supabase.storage.from('unlimited_heardles').createSignedUrl(`unlimited_heardle_${heardleId}.mp3`, 172800); // expires in 48 hours
      if (unlimitedUrlError) {
        throw new Error(unlimitedUrlError.message);
      }

      logger(heardleType, 'Creating Unlimited Heardle object...');

      const unlimitedHeardle = await prisma.unlimitedHeardle.create({
        data: {
          id: heardleId,
          name: song.name,
          album: song.album,
          cover: song.cover,
          link: unlimitedData?.signedUrl ?? song.link,
          startTime: startTime,
          duration: song.duration
        }
      });

      logger(heardleType, `Saved audio url to Unlimited Heardle #${heardleId} in Supabase Database`);

      return unlimitedHeardle;
  }
}

export async function downloadMp3(song: Song, startTime: number, heardleType: Heardle, userId?: string) {
  try {
    const songFilename = await downloadSong(heardleType, song);
    const newFilename = await trimSong(heardleType, songFilename, startTime);
    const mp3File = await getMp3File(heardleType, newFilename);

    const heardleSong = await uploadToDatabase(heardleType, mp3File, song, startTime, userId);

    unlinkSync(songFilename);
    unlinkSync('daily_song.mp3');

    return heardleSong;
  } catch (err: unknown) {
    logger(heardleType, err);
    throw new Error(`Failed to download "${song.name}.mp3"`);
  }
}
