'use client';

import { Song } from '@prisma/client';
import { ChangeEvent, useEffect, useState } from 'react';

interface IProps {
  songs?: Song[];
}

export default function AudioPlayer({ songs }: IProps) {
  const [selected, setSelected] = useState('');

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelected(event.target.value);
  };

  useEffect(() => {
    if (selected) console.log(selected);
  }, [selected]);

  return (
    <select className="select select-primary w-full max-w-xs" defaultValue={'Choose a Song'} onChange={handleChange}>
      <option disabled>Choose a Song</option>
      {songs?.map((song) => (
        <option key={song.id} value={song.name}>
          {song.name}
        </option>
      ))}
    </select>
  );
}
