import '../utils/env';

import { Song } from '@prisma/client';
import prisma from '../lib/prisma';
import ytdl from '@distube/ytdl-core';
import supabase from '../lib/supabase';
import { createWriteStream, readFileSync } from 'fs';

async function download(song: Song, fileName: string) {
  return new Promise((resolve, reject) => {
    ytdl(song.link, {
      filter: 'audioonly',
      quality: 'highestaudio'
    })
      // @ts-ignore: Argument of type WriteStream is not assignable to parameter of type WritableStream
      .pipe(createWriteStream(fileName))
      .on('finish', async () => {
        console.log(`Successfully downloaded ${fileName} from YouTube!`);
        resolve(fileName);
      })
      .on('error', (err: unknown) => {
        reject(err);
      });
  });
}

async function upload(filename: string) {
  const fileBuffer = readFileSync(filename);

  const { error } = await supabase.storage.from('song').upload(filename, fileBuffer, { contentType: 'audio/mp3', upsert: false });
  if (error) {
    if (error.message === 'The resource already exists') {
      return console.log(`${filename} was already uploaded to Supabase.`);
    }
    throw error;
  }

  console.log(`Successfully uploaded ${filename} to Supabase!`);
}

async function main() {
  const songs = await prisma.song.findMany();

  const missing: string[] = [];
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    console.log(`#${i + 1}/${songs.length}: ${song.name}`);

    try {
      const cleanFilename = `${song.name.replace(/\W/g, '').toLowerCase()}.mp3`;

      await download(song, cleanFilename);
      await upload(cleanFilename);
    } catch (error) {
      console.log(`${song.name} failed to download`, error);
      missing.push(song.name);
      continue;
    }
  }

  console.log(`DONE, missing songs: ${missing.length === 0 ? 'none' : missing.join(', ')}`);
}

main();
