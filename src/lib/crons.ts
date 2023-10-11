import prisma from './database';
import ytdl from 'ytdl-core';
import { createWriteStream, readFileSync } from 'fs';
import supabase from './supabase';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath.path);

export async function download() {
  try {
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
      .pipe(createWriteStream('daily_song.m4a'))
      .on('finish', async () => {
        try {
          console.log(`${newDailySong.name} downloaded successfully!`);

          const fileBuffer = readFileSync('daily_song.m4a');
          const audioBlob = new Blob([fileBuffer], { type: 'audio/mp4' });
          console.log('.m4a blob created from file: ', audioBlob);

          // Convert .m4a to .mp3
          ffmpeg('daily_song.m4a')
            .format('mp3')
            .on('end', async () => {
              console.log('File conversion complete!');

              const fileBuffer = readFileSync('daily_song.mp3');
              const mp3Blob = new Blob([fileBuffer], { type: 'audio/mp3' });
              console.log('New .mp3 blob: ', mp3Blob);

              const mp3File = Object.assign(mp3Blob, {
                name: 'daily_song.mp3',
                lastModified: new Date().getTime(),
                webkitRelativePath: ''
              });

              console.log('Uploading to Supabase...');
              const { error: updateError } = await supabase.storage.from('daily_song').update('daily_song.mp3', mp3File);
              if (updateError) {
                console.log(updateError);
                throw new Error('Error uploading file to Supabase');
              }

              const { data, error: urlError } = await supabase.storage.from('daily_song').createSignedUrl('daily_song.mp3', 172800); // expires in 48 hours
              if (urlError) {
                console.log(urlError);
                throw new Error('Error getting signed url from Supabase');
              }

              // get current daily song and ensure it exists
              const previousDailySong = await prisma.dailySong.findUnique({
                where: {
                  id: '0'
                }
              });
              if (!previousDailySong || !previousDailySong.heardleDay) throw new Error("Couldn't find previous daily song or its day number");

              await prisma.dailySong.upsert({
                where: {
                  id: '1'
                },
                update: {
                  name: newDailySong.name,
                  album: newDailySong.name,
                  cover: newDailySong.cover,
                  link: data?.signedUrl,
                  startTime: randomStartTime,
                  heardleDay: previousDailySong.heardleDay + 1
                  // 'nextReset' field is not needed with a cron job
                },
                create: {
                  id: '1',
                  name: newDailySong.name,
                  album: newDailySong.name,
                  cover: newDailySong.cover,
                  link: data?.signedUrl ?? newDailySong.link,
                  startTime: randomStartTime,
                  heardleDay: previousDailySong.heardleDay + 1
                }
              });
              console.log('Sent audio url from Supabase Storage to Supabase Database');

              return { message: `Successfully uploaded new daily song! ${data?.signedUrl}` };
            })
            .on('error', (err) => {
              console.log('File conversion error: ', err);
              throw new Error('File conversion error!');
            })
            .save('daily_song.mp3');
        } catch (err) {
          console.log('Error uploading new daily song: ', err);
        }
      })
      .on('error', (err) => {
        console.log(`Error downloading ${newDailySong}: `, err);
      });
  } catch (error) {
    console.error('Error downloading/uploading song: ', error);
  }
}

export async function reset() {
  try {
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
    if (!nextDailySong) throw new Error('Error finding next daily song');

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

    return { message: 'Successfully reset users and set new daily song!' };
  } catch (error) {
    console.error('Error setting new daily song: ', error);
  }
}
