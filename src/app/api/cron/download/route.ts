import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';
import fs from 'fs';
import { UTApi } from 'uploadthing/server';

export const utapi = new UTApi();

// download new daily song audio from youtube using ytdl-core
// upload .m4a file to upload thing
export async function GET(request: NextRequest) {
  try {
    // verify upstash
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing authorization' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (token !== process.env.QSTASH_TOKEN) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

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
      .pipe(fs.createWriteStream('./public/daily_song.m4a'))
      .on('finish', async () => {
        try {
          console.log(`${newDailySong.name} downloaded successfully!`);

          const fileBuffer = fs.readFileSync('./public/daily_song.m4a');
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
          if (!previousDailySong || !previousDailySong.heardleDay) return NextResponse.json({ error: "Couldn't find previous daily song or its day number" }, { status: 500 });

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
              name: newDailySong.name,
              album: newDailySong.name,
              cover: newDailySong.cover,
              link: response.data?.url ?? newDailySong.link,
              startTime: randomStartTime,
              heardleDay: previousDailySong.heardleDay + 1
            }
          });

          return NextResponse.json({ message: `Successfully uploaded new daily song! ${response.data?.url}` }, { status: 200 });
        } catch (err) {
          console.log('Error uploading new daily song: ', err);
          return NextResponse.json({ error: `Error downloading ${newDailySong}` }, { status: 500 });
        }
      })
      .on('error', (err) => {
        console.log(`Error downloading ${newDailySong}: `, err);
        return NextResponse.json({ error: `Error downloading ${newDailySong}` }, { status: 500 });
      });

    return NextResponse.json({ message: `Successfully uploaded new daily song! (${newDailySong.name} at ${randomStartTime} seconds)` }, { status: 200 });
  } catch (error) {
    console.error('Error downloading/uploading song: ', error);
    return NextResponse.json({ error: 'Error setting new daily song' }, { status: 500 });
  }
}
