import prisma from '../lib/prisma';
import ytdl from '@distube/ytdl-core';
import { downloadMp3 } from './downloadMp3';
import { DailySong, Song, UnlimitedHeardle } from '@prisma/client';
import { updateDatabase } from './updateDatabase';
import { Heardle, logger } from '../utils/logger';
import supabase from '../lib/supabase';
import { createEmbed, discordWebhook } from '../lib/webhook';
import { ytdlProxyAgent } from '../lib/ytdl';

export async function getRandomSong(heardleType: Heardle): Promise<Song> {
  try {
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
  } catch (err: any) {
    logger(heardleType, err);
    throw new Error('Failed to get random song');
  }
}

export async function getRandomStartTime(song: Song, heardleType: Heardle): Promise<number> {
  try {
    // determine the random start time
    const dailySongInfo = await ytdl.getBasicInfo(song.link, { agent: ytdlProxyAgent });
    const songLength = parseInt(dailySongInfo.videoDetails.lengthSeconds);

    let randomStartTime = Math.floor(Math.random() * songLength) - 7;
    randomStartTime = randomStartTime < 0 ? 0 : randomStartTime;
    randomStartTime = randomStartTime + 6 > songLength ? songLength - 6 : randomStartTime;
    logger(heardleType, 'Random start time: ', randomStartTime);

    return randomStartTime;
  } catch (err: any) {
    logger(heardleType, err);
    throw new Error('Failed to get random start time');
  }
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
  try {
    const unlimitedHeardles = await prisma.unlimitedHeardle.findMany({});

    logger(Heardle.Unlimited, `Deleting yesterday's collection...`);

    for (const heardle of unlimitedHeardles) {
      await supabase.storage.from('unlimited_heardles').remove([`unlimited_heardle_${heardle.id}.mp3`]);

      await prisma.unlimitedHeardle.delete({
        where: {
          id: heardle.id
        }
      });
    }

    logger(Heardle.Unlimited, `Deleted yesterday's collection`);

    for (let i = 1; i <= amount; i++) {
      const song = await createNewUnlimitedHeardle();
      logger(Heardle.Unlimited, `File #${i} created: ${song.name}`);
    }

    logger(Heardle.Unlimited, `Finished creating ${amount} files`);

    const embed = createEmbed(Heardle.Unlimited, `Finished creating ${amount} files`, 0x32ff25);
    await discordWebhook.send({ embeds: [embed] });
  } catch (err: any) {
    logger(Heardle.Unlimited, err);

    const embed = createEmbed(Heardle.Unlimited, `Error: ${err.message}`, 0xdf0000);
    await discordWebhook.send({ embeds: [embed] });
  }
}

export async function setDailySong() {
  try {
    const newDailySong = await getRandomSong(Heardle.Daily);
    const randomStartTime = await getRandomStartTime(newDailySong, Heardle.Daily);

    const previousHeardle = (await downloadMp3(newDailySong, randomStartTime, Heardle.Daily)) as DailySong;
    await updateDatabase();

    const embed = createEmbed(Heardle.Daily, `Successfully updated`, 0x32ff25).addFields([
      { name: 'Previous Song', value: previousHeardle.name, inline: true },
      { name: 'Next Day Number', value: `${(previousHeardle.heardleDay ?? 0) + 1}`, inline: true }
    ]);
    await discordWebhook.send({ embeds: [embed] });
  } catch (err: any) {
    logger(Heardle.Daily, err);

    const embed = createEmbed(Heardle.Daily, `Error: ${err.message}`, 0xdf0000);
    await discordWebhook.send({ embeds: [embed] });
  }
}
