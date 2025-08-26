import '../utils/env';

import { Song } from '@prisma/client';
import prisma from '../lib/prisma';
import ytdl from '@distube/ytdl-core';
import supabase from '../lib/supabase';
import { createWriteStream, readFileSync, unlinkSync } from 'fs';

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

async function checkFileExists(fileName: string) {
  const { data } = await supabase.storage.from('song').list();
  if (!data || data.length === 0) return false;

  return data.some((song) => song.name === fileName);
}

async function upload(fileName: string) {
  const fileBuffer = readFileSync(fileName);

  const { data, error } = await supabase.storage.from('song').upload(fileName, fileBuffer, { contentType: 'audio/mp3', upsert: false });
  if (error && error.message === 'The resource already exists') {
    console.log(`${fileName} was already uploaded to Supabase.`);
  } else if (data) console.log(`Successfully uploaded ${fileName} to Supabase!`);
}

async function main() {
  const songs = await prisma.song.findMany();

  const missing: string[] = [];
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    console.log(`#${i + 1}/${songs.length}: ${song.name}`);

    try {
      const cleanFileName = `${song.name.replace(/\W/g, '').toLowerCase()}.mp3`;
      const alreadyExists = await checkFileExists(cleanFileName);
      if (alreadyExists) {
        console.log(`${song.name} already exists`);
        continue;
      }

      await download(song, cleanFileName);
      await upload(cleanFileName);

      unlinkSync(cleanFileName);
    } catch (error) {
      console.log(`${song.name} failed to download`, error);
      missing.push(song.name);
      continue;
    }
  }

  console.log(`DONE, missing songs: ${missing.length === 0 ? 'none' : missing.join(', ')}`);
}

main();
