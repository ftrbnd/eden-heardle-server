'use client';

import useGuesses from '@/hooks/useGuesses';
import useSongs from '@/hooks/useSongs';
import { finishedHeardle } from '@/utils/userGuesses';
import { Song, DailySong } from '@prisma/client';
import { useEffect, ChangeEvent } from 'react';

export default function SongSelectInput({ dailySong }: { dailySong?: DailySong }) {
  const { guesses, submitGuess } = useGuesses();

  const { songs, songsLoading } = useSongs();

  useEffect(() => {
    if (finishedHeardle(guesses)) {
      const modal = document.getElementById('stats_modal') as HTMLDialogElement;
      if (!modal.open) modal.showModal();
    }
  }, [guesses]);

  const handleSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    function getCorrectStatus(song: Song) {
      return song.name === dailySong?.name ? 'CORRECT' : song?.album === dailySong?.album ? 'ALBUM' : 'WRONG';
    }

    if (event.target.className === 'default_selection') return;

    // find song object that was selected
    const selectedSong = songs?.find((song) => song.name === event.target.value);
    if (!selectedSong) return;

    submitGuess(selectedSong, getCorrectStatus(selectedSong));
  };

  // disable the song if it has already been selected or the user has completed today's heardle
  const disableOption = (song: Song) => {
    return guesses?.some((guess) => guess.name === song.name) || finishedHeardle(guesses);
  };

  return (
    <select className="select select-primary w-full md:w-3/5 xl:w-2/5 place-self-center" defaultValue={'Choose a Song'} onChange={handleSelection} disabled={songsLoading}>
      <option className="default_selection">Choose a song!</option>
      {songs?.map((song) => (
        <option key={song.id} value={song.name} disabled={disableOption(song)}>
          {song.name}
        </option>
      ))}
    </select>
  );
}
