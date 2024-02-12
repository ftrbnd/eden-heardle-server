import prisma from '../lib/prisma';
import ytdl from 'ytdl-core';
import { downloadMp3 } from './downloadMp3';
import { Song, UnlimitedHeardle } from '@prisma/client';
import { updateDatabase } from './updateDatabase';
import { Heardle, logger } from './logger';
import supabase from '../lib/supabase';

export async function getRandomSong(heardleType: Heardle): Promise<Song> {
  // get a new random song
  const songsCount = await prisma.song.count();
  const skip = Math.floor(Math.random() * songsCount);
  const randomSongs = await prisma.song.findMany({
    take: 1,
    skip
  });
  const randomSong = randomSongs[0];
  logger(heardleType, `Random song: ${randomSong.name}`);

  return randomSong;
}

export async function getRandomStartTime(song: Song, heardleType: Heardle): Promise<number> {
  // determine the random start time
  const dailySongInfo = await ytdl.getBasicInfo(song.link);
  const songLength = parseInt(dailySongInfo.videoDetails.lengthSeconds);

  let randomStartTime = Math.floor(Math.random() * songLength) - 7;
  randomStartTime = randomStartTime < 0 ? 0 : randomStartTime;
  randomStartTime = randomStartTime + 6 > songLength ? songLength - 6 : randomStartTime;
  logger(heardleType, 'Random start time: ', randomStartTime);

  return randomStartTime;
}

async function createNewUnlimitedHeardle(): Promise<UnlimitedHeardle> {
  try {
    const song = await getRandomSong(Heardle.Unlimited);
    const startTime = await getRandomStartTime(song, Heardle.Unlimited);

    const unlimitedHeardle = (await downloadMp3(song, startTime, Heardle.Unlimited)) as UnlimitedHeardle;

    return unlimitedHeardle;
  } catch (err: unknown) {
    logger(Heardle.Unlimited, err);
    throw new Error('Failed to create Unlimited Heardle');
  }
}

export async function repeatCreateUnlimitedHeardle(amount: number) {
  const unlimitedHeardles = await prisma.unlimitedHeardle.findMany({});

  console.log(`${Heardle.Unlimited} Deleting yesterday's collection...`);

  for (const heardle of unlimitedHeardles) {
    await supabase.storage.from('unlimited_heardles').remove([`unlimited_heardle_${heardle.id}.mp3`]);

    await prisma.unlimitedHeardle.delete({
      where: {
        id: heardle.id
      }
    });
  }

  console.log(`${Heardle.Unlimited} Deleted yesterday's collection`);

  for (let i = 1; i <= amount; i++) {
    const song = await createNewUnlimitedHeardle();
    console.log(`${Heardle.Unlimited} File #${i} created: ${song.name}`);
  }

  console.log(`${Heardle.Unlimited} Finished creating ${amount} files`);
}

export async function setDailySong() {
  try {
    const newDailySong = await getRandomSong(Heardle.Daily);
    const randomStartTime = await getRandomStartTime(newDailySong, Heardle.Daily);

    await downloadMp3(newDailySong, randomStartTime, Heardle.Daily);
    await updateDatabase();
  } catch (err: unknown) {
    logger(Heardle.Daily, err);
  }
}
