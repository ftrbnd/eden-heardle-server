import { Song } from '@prisma/client';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { createWriteStream, readFileSync } from 'fs';
import { Blob } from 'buffer';
import ytdl from 'ytdl-core';
import prisma from '../lib/prisma';
import supabase from '../lib/supabase';
import { logger, Heardle } from './logger';
import { createId } from '@paralleldrive/cuid2';

type Mp3File = Blob & {
  name: string;
  lastModified: number;
  webkitRelativePath: string;
};

ffmpeg.setFfmpegPath(ffmpegPath);

const CLIENT_LINK = 'https://eden-heardle.io';

export async function ytdlDownload(song: Song, startTime: number, fileName: string, heardleType: Heardle) {
  return new Promise((resolve, reject) => {
    ytdl(song.link, {
      begin: `${startTime}s`,
      filter: 'audioonly',
      quality: 'highestaudio'
    })
      .pipe(createWriteStream(`${fileName}.m4a`))
      .on('finish', async () => {
        logger(heardleType, `${song.name} downloaded successfully!`);
        resolve('ytdlDownload complete!');
      })
      .on('error', (err: unknown) => {
        logger(heardleType, `Error downloading ${song.name} with ytdl-core`);
        reject(err);
      });
  });
}

export async function m4aToMp3(m4aFilename: string, startTime: number, heardleType: Heardle): Promise<string> {
  return new Promise((resolve, reject) => {
    // Convert .m4a to .mp3
    ffmpeg(m4aFilename)
      .format('mp3')
      .setStartTime(startTime)
      .setDuration(6)
      .on('end', async () => {
        logger(heardleType, `File conversion complete!`);
        resolve(m4aFilename.replace('m4a', 'mp3'));
      })
      .on('error', (err: unknown) => {
        logger(heardleType, `Error converting ${m4aFilename} to .mp3`);
        reject(err);
      })
      .save(m4aFilename.replace('m4a', 'mp3'));
  });
}

export async function getMp3File(fileName: string, heardleType: Heardle): Promise<Mp3File> {
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

export async function uploadToDatabase(mp3File: Mp3File, song: Song, startTime: number, heardleType: Heardle, userId?: string): Promise<string> {
  if (userId) {
    const customId = createId();

    // upload custom heardle song to separate supabase storage folder
    const userAlreadyHasCustomHeardle = await prisma.customHeardle.findUnique({
      where: {
        userId
      }
    });
    if (userAlreadyHasCustomHeardle) throw new Error(`${heardleType} User already has a custom heardle`);

    logger(heardleType, `Uploading to Supabase...`);

    const { error: uploadError } = await supabase.storage.from('custom_heardles').upload(`custom_song_${customId}.mp3`, mp3File as any);
    if (uploadError) {
      logger(heardleType, uploadError);
      throw new Error(`${heardleType} Error uploading file to Supabase`);
    }

    logger(heardleType, 'Getting signed url...');

    const { data, error: urlError } = await supabase.storage.from('custom_heardles').createSignedUrl(`custom_song_${customId}.mp3`, 172800); // expires in 48 hours
    if (urlError) {
      logger(heardleType, urlError);
      throw new Error(`${heardleType} Error getting signed url from Supabase`);
    }

    logger(heardleType, 'Creating Custom Heardle object...');

    const customHeardle = await prisma.customHeardle.create({
      data: {
        id: customId,
        userId,
        name: song.name,
        album: song.album,
        cover: song.cover,
        link: data?.signedUrl ?? song.link,
        startTime: startTime,
        duration: song.duration
      }
    });

    logger(heardleType, `Saved audio url to Custom Heardle #${customId} in Supabase Database`);

    return `${CLIENT_LINK}/play/${customHeardle.id}`;
  } else {
    // get current daily song and ensure it exists
    const previousDailySong = await prisma.dailySong.findUnique({
      where: {
        id: '0'
      }
    });
    if (!previousDailySong || previousDailySong.heardleDay === null || previousDailySong.heardleDay === undefined)
      throw new Error(`${heardleType} Couldn't find previous daily song or its day number`);

    logger(heardleType, "Removing yesterday's song...");

    // delete previous daily song from storage
    const { error: deleteError } = await supabase.storage.from('daily_song').remove([`daily_song_${previousDailySong.heardleDay}.mp3`]);
    if (deleteError) {
      logger(heardleType, deleteError);
      // throw new Error("${heardleType} Failed to delete yesterday's song")
      // Don't throw Error because this isn't necessary; we can store multiple songs in the storage bucket
    }

    logger(heardleType, `Uploading to Supabase...`);

    const { error: uploadError } = await supabase.storage.from('daily_song').upload(`daily_song_${previousDailySong.heardleDay + 1}.mp3`, mp3File as any);
    if (uploadError) {
      logger(heardleType, uploadError);
      throw new Error(`${heardleType} Error uploading file to Supabase`);
    }

    logger(heardleType, 'Getting signed url...');

    const { data, error: urlError } = await supabase.storage.from('daily_song').createSignedUrl(`daily_song_${previousDailySong.heardleDay + 1}.mp3`, 172800); // expires in 48 hours
    if (urlError) {
      logger(heardleType, urlError);
      throw new Error(`${heardleType} Error getting signed url from Supabase`);
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
        link: data?.signedUrl,
        startTime: startTime,
        heardleDay: previousDailySong.heardleDay + 1
        // 'nextReset' field is not needed with a cron job
      },
      create: {
        id: '1',
        name: song.name,
        album: song.album,
        cover: song.cover,
        link: data?.signedUrl ?? song.link,
        startTime: startTime,
        heardleDay: previousDailySong.heardleDay + 1
      }
    });

    logger(heardleType, 'Saved audio url to Custom Heardle object in Supabase Database');

    return CLIENT_LINK;
  }
}

export async function downloadMp3(song: Song, startTime: number, userId?: string) {
  const fileName = userId ? 'custom_song' : 'daily_song';
  const heardleType = userId ? Heardle.Custom : Heardle.Daily;

  try {
    await ytdlDownload(song, startTime, fileName, heardleType);

    const mp3Filename = await m4aToMp3(`${fileName}.m4a`, startTime, heardleType);
    const mp3File = await getMp3File(mp3Filename, heardleType);

    const shareableLink = await uploadToDatabase(mp3File, song, startTime, heardleType, userId);

    return shareableLink;
  } catch (err: unknown) {
    logger(heardleType, err);
    throw new Error(`${heardleType} Failed to download "${song.name}.mp3"`);
  }
}
