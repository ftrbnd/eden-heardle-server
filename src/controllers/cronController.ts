import { File } from 'buffer';
import { Request, Response } from 'express';
import prisma from '../lib/database';
import ytdl from 'ytdl-core';
import { createWriteStream, readFileSync } from 'fs';
import { utapi } from '../lib/uploadthing';

export const dailySong_download = async (req: Request, res: Response) => {
  try {
    // // verify cron job from upstash
    // const authHeader = req.headers.authorization;
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   return res.status(401).json({ error: 'Missing authorization' });
    // }

    // const token = authHeader.split(' ')[1];
    // if (token !== process.env.QSTASH_TOKEN) {
    //   return res.status(401).json({ error: 'Authentication failed' });
    // }

    // get a new random song
    const songsCount = await prisma.song.count();
    const skip = Math.floor(Math.random() * songsCount);
    const randomSongs = await prisma.song.findMany({
      skip: skip,
      take: 1
    });
    const newDailySong = randomSongs[0];
    console.log('New daily song: ', newDailySong.name);

    // determine the random start time
    const dailySongInfo = await ytdl.getBasicInfo(newDailySong.link);
    const songLength = parseInt(dailySongInfo.videoDetails.lengthSeconds);
    let randomStartTime = Math.floor(Math.random() * songLength) - 7;
    randomStartTime = randomStartTime < 0 ? 0 : randomStartTime;
    randomStartTime = randomStartTime + 6 > songLength ? songLength - 6 : randomStartTime;
    console.log('Random start time: ', randomStartTime);

    ytdl(newDailySong.link, {
      begin: `${randomStartTime}s`,
      filter: 'audioonly',
      quality: 'highestaudio'
    })
      .pipe(createWriteStream('./public/daily_song.m4a'))
      .on('finish', async () => {
        try {
          console.log(`${newDailySong.name} downloaded successfully!`);

          const fileBuffer = readFileSync('./public/daily_song.m4a');
          const audioBlob = new Blob([fileBuffer], { type: 'audio/mp4' });
          console.log('Blob created from file: ', audioBlob);

          const audioFile: File = Object.assign(audioBlob, {
            name: 'daily_song.m4a',
            lastModified: new Date().getTime(),
            webkitRelativePath: ''
          });

          // delete existing daily song
          const fileUrls = await utapi.listFiles();
          console.log('File urls: ', fileUrls);

          for (const fileUrl of fileUrls) {
            console.log(`Deleting file key ${fileUrl.key}...`);
            await utapi.deleteFiles(fileUrl.key);
          }

          console.log('Uploading to uploadthing...');
          const response = await utapi.uploadFiles(audioFile);
          console.log('utapi response: ', response);

          // get current daily song and ensure it exists
          const previousDailySong = await prisma.dailySong.findUnique({
            where: {
              id: '0'
            }
          });
          if (!previousDailySong || !previousDailySong.heardleDay) return res.status(500).json({ error: "Couldn't find previous daily song or its day number" });

          await prisma.dailySong.upsert({
            where: {
              id: '1'
            },
            update: {
              name: newDailySong.name,
              album: newDailySong.name,
              cover: newDailySong.cover,
              link: response.data?.url,
              startTime: randomStartTime,
              heardleDay: previousDailySong.heardleDay + 1
              // 'nextReset' field is not needed with a cron job
            },
            create: {
              id: '1',
              name: newDailySong.name,
              album: newDailySong.name,
              cover: newDailySong.cover,
              link: response.data?.url ?? newDailySong.link,
              startTime: randomStartTime,
              heardleDay: previousDailySong.heardleDay + 1
            }
          });
          console.log('Sent uploadthing url to Supabase');

          return res.json({ message: `Successfully uploaded new daily song! ${response.data?.url}` });
        } catch (err) {
          console.log('Error uploading new daily song: ', err);
          return res.status(500).json({ error: `Error downloading ${newDailySong}` });
        }
      })
      .on('error', (err) => {
        console.log(`Error downloading ${newDailySong}: `, err);
        return res.json({ error: `Error downloading ${newDailySong}` });
      });
  } catch (error) {
    console.error('Error downloading/uploading song: ', error);
    return res.status(500).json({ error: 'Error setting new daily song' });
  }
};

export const dailySong_reset = async (req: Request, res: Response) => {
  try {
    // // verify cron job from upstash
    // const authHeader = req.headers.authorization;
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   return res.status(401).json({ error: 'Missing authorization' });
    // }

    // const token = authHeader.split(' ')[1];
    // if (token !== process.env.QSTASH_TOKEN) {
    //   return res.status(401).json({ error: 'Authentication failed' });
    // }

    // check users' current streaks
    const users = await prisma.user.findMany();
    for (const user of users) {
      const dailyGuesses = await prisma.guesses.findUnique({
        where: {
          userId: user.id
        },
        select: {
          songs: true
        }
      });
      const completedDaily = dailyGuesses?.songs.at(-1)?.correctStatus === 'CORRECT';

      const prevStats = await prisma.statistics.findUnique({
        where: {
          userId: user.id
        }
      });

      if (!completedDaily) {
        await prisma.statistics.update({
          where: {
            userId: user.id
          },
          data: {
            gamesPlayed: prevStats?.gamesPlayed,
            gamesWon: prevStats?.gamesWon,
            currentStreak: 0,
            maxStreak: prevStats?.maxStreak
          }
        });
      }
    }

    // reset all users' guesses
    await prisma.guessedSong.deleteMany({});

    // set saved next daily song to current daily song
    const nextDailySong = await prisma.dailySong.findUnique({
      where: {
        id: '1'
      }
    });
    if (!nextDailySong) return res.status(404).json({ error: 'Error finding next daily song' });

    await prisma.dailySong.upsert({
      where: {
        id: '0'
      },
      update: {
        name: nextDailySong.name,
        album: nextDailySong.name,
        cover: nextDailySong.cover,
        link: nextDailySong.link,
        startTime: nextDailySong.startTime,
        heardleDay: nextDailySong.heardleDay
      },
      create: {
        name: nextDailySong.name,
        album: nextDailySong.name,
        cover: nextDailySong.cover,
        link: nextDailySong.link,
        startTime: nextDailySong.startTime,
        heardleDay: nextDailySong.heardleDay
      }
    });

    return res.json({ message: 'Successfully reset users and set new daily song!' });
  } catch (error) {
    console.error('Error setting new daily song: ', error);
    return res.status(500).json({ error: 'Error setting new daily song' });
  }
};
