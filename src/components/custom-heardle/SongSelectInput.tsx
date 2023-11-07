'use client';

import { getSongs } from '@/lib/songsApi';
import { GuessedSong, Song, CustomHeardle } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { createId } from '@paralleldrive/cuid2';

interface CustomHeardleInputProps {
  customSong?: CustomHeardle;
  guessedSongs: GuessedSong[];
  setGuessedSongs: Dispatch<SetStateAction<GuessedSong[]>>;
}

export default function SongSelectInput({ customSong, guessedSongs, setGuessedSongs }: CustomHeardleInputProps) {
  const { data: songs, isLoading: songsLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: getSongs
  });

  const handleSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    function getCorrectStatus(song: Song) {
      return song.name === customSong?.name ? 'CORRECT' : song?.album === customSong?.album ? 'ALBUM' : 'WRONG';
    }

    // find song object that was selected
    const selectedSong = songs?.find((song) => song.name === event.target.value);
    if (!selectedSong) return;

    const guessedSong: GuessedSong = {
      id: createId(),
      name: selectedSong.name,
      album: selectedSong.album,
      cover: selectedSong.cover,
      correctStatus: getCorrectStatus(selectedSong),
      guessListId: createId(),
      duration: selectedSong.duration
    };

    setGuessedSongs((prev) => [...prev, guessedSong]);
  };

  // disable the song if it has already been selected or the user has completed today's heardle
  const disableOption = (song: Song) => {
    return guessedSongs?.some((guess) => guess.name === song.name) || guessedSongs?.length === 6 || guessedSongs?.at(-1)?.correctStatus === 'CORRECT';
  };

  return (
    <select className="select select-primary w-full md:w-3/5 xl:w-2/5 place-self-center" defaultValue={'Choose a Song'} onChange={handleSelection} disabled={songsLoading}>
      <option disabled>Choose a song!</option>
      {songs?.map((song) => (
        <option key={song.id} value={song.name} disabled={disableOption(song)}>
          {song.name}
        </option>
      ))}
    </select>
  );
}
