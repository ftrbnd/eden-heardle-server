import prisma from './prisma';
import ytdl from 'ytdl-core';
import { createWriteStream, readFileSync } from 'fs';
import supabase from './supabase';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { Song } from '@prisma/client';

ffmpeg.setFfmpegPath(ffmpegPath.path);

export async function setDailySong() {
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

  await download(newDailySong, randomStartTime, null, null);
}

export async function download(newDailySong: Song, randomStartTime: number, userId: string | null, customId: string | null) {
  const m4a_filename = customId ? 'custom_song.m4a' : 'daily_song.m4a';
  const mp3_filename = customId ? 'custom_song.mp3' : 'daily_song.mp3';
  const log_type = customId ? 'Custom Heardle:' : 'Daily Heardle:';

  try {
    ytdl(newDailySong.link, {
      begin: `${randomStartTime}s`,
      filter: 'audioonly',
      quality: 'highestaudio'
    })
      .pipe(createWriteStream(m4a_filename))
      .on('finish', async () => {
        console.log(`${log_type} ${newDailySong.name} downloaded successfully!`);

        const fileBuffer = readFileSync(m4a_filename);
        const audioBlob = new Blob([fileBuffer], { type: 'audio/mp4' });
        console.log(`${log_type} .m4a blob created from file: `, audioBlob);

        // Convert .m4a to .mp3
        ffmpeg(m4a_filename)
          .format('mp3')
          .setStartTime(randomStartTime)
          .setDuration(6)
          .on('end', async () => {
            console.log(`${log_type} File conversion complete!`);

            try {
              const fileBuffer = readFileSync(mp3_filename);
              const mp3Blob = new Blob([fileBuffer], { type: 'audio/mp3' });
              console.log(`${log_type} New .mp3 blob: `, mp3Blob);

              const mp3File = Object.assign(mp3Blob, {
                name: mp3_filename,
                lastModified: new Date().getTime(),
                webkitRelativePath: ''
              });

              if (customId && userId) {
                // upload custom heardle song to separate supabase storage folder
                const userAlreadyHasCustomHeardle = await prisma.customHeardle.findUnique({
                  where: {
                    userId
                  }
                });
                if (userAlreadyHasCustomHeardle) throw new Error('User already has a custom heardle');

                console.log(`${log_type} Uploading to Supabase...`);
                const { error: uploadError } = await supabase.storage.from('custom_heardles').upload(`custom_song_${customId}.mp3`, mp3File);
                if (uploadError) {
                  console.log(uploadError);
                  throw new Error(`${log_type} Error uploading file to Supabase`);
                }

                const { data, error: urlError } = await supabase.storage.from('custom_heardles').createSignedUrl(`custom_song_${customId}.mp3`, 172800); // expires in 48 hours
                if (urlError) {
                  console.log(urlError);
                  throw new Error(`${log_type} Error getting signed url from Supabase`);
                }

                await prisma.customHeardle.create({
                  data: {
                    id: customId,
                    userId,
                    name: newDailySong.name,
                    album: newDailySong.album,
                    cover: newDailySong.cover,
                    link: data?.signedUrl ?? newDailySong.link,
                    startTime: randomStartTime,
                    duration: newDailySong.duration
                  }
                });
                console.log(`${log_type} Sent audio url from Supabase Storage to Supabase Database`);
              } else {
                // set new daily song in official EDEN Heardle

                // get current daily song and ensure it exists
                const previousDailySong = await prisma.dailySong.findUnique({
                  where: {
                    id: '0'
                  }
                });
                if (!previousDailySong || previousDailySong.heardleDay === null || previousDailySong.heardleDay === undefined) throw new Error("Couldn't find previous daily song or its day number");

                // delete previous daily song from storage
                const { error: deleteError } = await supabase.storage.from('daily_song').remove([`daily_song_${previousDailySong.heardleDay}.mp3`]);
                if (deleteError) {
                  console.log(deleteError);
                }

                console.log(`${log_type} Uploading to Supabase...`);
                const { error: uploadError } = await supabase.storage.from('daily_song').upload(`daily_song_${previousDailySong.heardleDay + 1}.mp3`, mp3File);
                if (uploadError) {
                  console.log(uploadError);
                  throw new Error('Error uploading file to Supabase');
                }

                const { data, error: urlError } = await supabase.storage.from('daily_song').createSignedUrl(`daily_song_${previousDailySong.heardleDay + 1}.mp3`, 172800); // expires in 48 hours
                if (urlError) {
                  console.log(urlError);
                  throw new Error('Error getting signed url from Supabase');
                }

                await prisma.dailySong.upsert({
                  where: {
                    id: '1'
                  },
                  update: {
                    name: newDailySong.name,
                    album: newDailySong.album,
                    cover: newDailySong.cover,
                    link: data?.signedUrl,
                    startTime: randomStartTime,
                    heardleDay: previousDailySong.heardleDay + 1
                    // 'nextReset' field is not needed with a cron job
                  },
                  create: {
                    id: '1',
                    name: newDailySong.name,
                    album: newDailySong.album,
                    cover: newDailySong.cover,
                    link: data?.signedUrl ?? newDailySong.link,
                    startTime: randomStartTime,
                    heardleDay: previousDailySong.heardleDay + 1
                  }
                });
                console.log(`${log_type} Sent audio url from Supabase Storage to Supabase Database`);

                await reset();
              }
            } catch (err: any) {
              console.log(`${log_type} Error uploading song: `, err.message);
            }
          })
          .on('error', (err) => {
            console.log('File conversion error: ', err);
            throw new Error('File conversion error');
          })
          .save(mp3_filename);
      })
      .on('error', (err) => {
        console.log(`Error downloading ${newDailySong}: `, err);
        throw new Error(`Error downloading ${newDailySong}`);
      });
  } catch (err: any) {
    console.log('Error downloading/uploading song: ', err.message);
    return err;
  }
}

export async function reset() {
  try {
    console.log('Resetting stats and updating daily song...');
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
        album: nextDailySong.album,
        cover: nextDailySong.cover,
        link: nextDailySong.link,
        startTime: nextDailySong.startTime,
        heardleDay: nextDailySong.heardleDay
      },
      create: {
        name: nextDailySong.name,
        album: nextDailySong.album,
        cover: nextDailySong.cover,
        link: nextDailySong.link,
        startTime: nextDailySong.startTime,
        heardleDay: nextDailySong.heardleDay
      }
    });

    console.log('DONE');

    return { message: 'Successfully reset users and set new daily song!' };
  } catch (error) {
    console.log('Error setting new daily song: ', error);
  }
}
