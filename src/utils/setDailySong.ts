import prisma from '../lib/prisma';
import ytdl from 'ytdl-core';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { downloadMp3 } from './downloadMp3';
import { Song } from '@prisma/client';
import { updateDatabase } from './updateDatabase';
import { Heardle, logger } from './logger';

ffmpeg.setFfmpegPath(ffmpegPath.path);

async function getRandomSong(): Promise<Song> {
  // get a new random song
  const songsCount = await prisma.song.count();
  const skip = Math.floor(Math.random() * songsCount);
  const randomSongs = await prisma.song.findMany({
    skip: skip,
    take: 1
  });
  const newDailySong = randomSongs[0];
  logger(Heardle.Daily, `Today's song: ${newDailySong.name}`);

  return newDailySong;
}

async function getRandomStartTime(song: Song): Promise<number> {
  // determine the random start time
  const dailySongInfo = await ytdl.getBasicInfo(song.link);
  const songLength = parseInt(dailySongInfo.videoDetails.lengthSeconds);

  let randomStartTime = Math.floor(Math.random() * songLength) - 7;
  randomStartTime = randomStartTime < 0 ? 0 : randomStartTime;
  randomStartTime = randomStartTime + 6 > songLength ? songLength - 6 : randomStartTime;
  logger(Heardle.Daily, 'Random start time: ', randomStartTime);

  return randomStartTime;
}

export async function setDailySong() {
  try {
    const newDailySong = await getRandomSong();
    const randomStartTime = await getRandomStartTime(newDailySong);

    await downloadMp3(newDailySong, randomStartTime);
    await updateDatabase();
  } catch (err: unknown) {
    logger(Heardle.Daily, err);
  }
}
