'use client';

import { Song } from '@/models/Song';

interface IProps {
  songs: Song[];
}

export default function AudioPlayer({ songs }: IProps) {
  return (
    <select className="select select-primary w-full max-w-xs">
      <option disabled selected>
        Choose a Song
      </option>
      {songs?.map((song) => (
        <option key={song.id}>{song.name}</option>
      ))}
    </select>
  );
}
