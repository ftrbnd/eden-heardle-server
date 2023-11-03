'use client';

import { getSongs } from '@/lib/songsApi';
import { Song } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

interface SelectProps {
  onSongSelect: (song: Song) => void;
}

function SelectSong({ onSongSelect }: SelectProps) {
  const { data: songs, isLoading: songsLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: getSongs
  });

  const handleSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    const song = songs?.find((song) => song.name === event.target.value);
    if (!song) return;

    onSongSelect(song);
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Choose a song</span>
      </label>
      <select className="select select-primary w-full place-self-center" defaultValue={'Choose a Song'} disabled={songsLoading} onChange={handleSelection}>
        <option disabled>Choose a song</option>
        {songs?.map((song) => (
          <option key={song.id} value={song.name}>
            {song.name}
          </option>
        ))}
      </select>
    </div>
  );
}

interface CardProps {
  selectedSong: Song | null;
}

function SelectedSongCard({ selectedSong }: CardProps) {
  return (
    <div className="card card-side bg-base-100 shadow-xl w-full">
      <figure>
        <Image src={selectedSong?.cover ?? '/default_song.png'} alt="Cover of selected song" height={50} width={50} />
      </figure>
      <div className="flex items-center w-full justify-between px-4">
        <h2 className="card-title text-left">{selectedSong?.name ?? '...'}</h2>
      </div>
    </div>
  );
}

export default function CustomHeardleModal() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const handleSelection = (song: Song) => {
    setSelectedSong(song);
  };

  return (
    <dialog id="custom_heardle_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box h-2/5 sm:h-3/5">
        <h3 className="font-bold text-lg">Create a Custom Heardle!</h3>
        <div className="flex flex-col gap-2">
          <SelectSong onSongSelect={handleSelection} />
          <SelectedSongCard selectedSong={selectedSong} />
          {selectedSong && (
            <>
              <input type="range" min={0} max="100" value="25" className="range" step="25" />
              <div className="w-full flex justify-between text-xs px-2">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
            </>
          )}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
}
