import * as db from '@packages/database/queries';
import { DailySong, Song, UnlimitedHeardle } from '@packages/database';
import { downloadMp3 } from './downloadMp3';
import { updateDatabase } from './updateDatabase';
import { Heardle, logger } from '../utils/logger';
import supabase from '../lib/supabase';
import { createEmbed, discordWebhook } from '../lib/webhook';

export async function getRandomSong(heardleType: Heardle): Promise<Song> {
  try {
    // get a new random song
    const [randomSong] = await db.getRandomSong('song');
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
    if (!song.duration) throw new Error(`"${song.name}" has no duration listed`);

    let randomStartTime = Math.floor(Math.random() * song.duration) - 7;
    randomStartTime = randomStartTime < 0 ? 0 : randomStartTime;
    randomStartTime = randomStartTime + 6 > song.duration ? song.duration - 6 : randomStartTime;
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
    const unlimitedHeardles = await db.getAllUnlimitedHeardles();

    logger(Heardle.Unlimited, `Deleting yesterday's collection...`);

    for (const heardle of unlimitedHeardles) {
      await supabase.storage.from('unlimited_heardles').remove([`unlimited_heardle_${heardle.id}.mp3`]);

      await db.deleteUnlimitedHeardle(heardle.id);
    }

    logger(Heardle.Unlimited, `Deleted yesterday's collection`);

    let successCount = 0;
    for (let i = 1; i <= amount; i++) {
      try {
        const song = await createNewUnlimitedHeardle();
        successCount++;
        logger(Heardle.Unlimited, `File #${successCount} created: ${song.name}`);
      } catch (err) {
        logger(Heardle.Unlimited, err);
        continue;
      }
    }

    const message = `Finished creating ${successCount}/${amount} files`;
    logger(Heardle.Unlimited, message);
    const embed = createEmbed(Heardle.Unlimited, message, 0x32ff25);
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
