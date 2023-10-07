'use client';

import useLocalUser from '@/context/LocalUserProvider';
import { getSongs, getGuessedSongs, updateGuessedSongs } from '@/lib/songsApi';
import { updateStats } from '@/lib/statsApi';
import { createId } from '@paralleldrive/cuid2';
import { Statistics, GuessedSong, Song, DailySong } from '@prisma/client';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect, ChangeEvent } from 'react';

export default function SongSelectInput({ dailySong }: { dailySong?: DailySong }) {
  const { data: session } = useSession();
  const localUser = useLocalUser();
  const queryClient = useQueryClient();

  const { data: songs, isLoading: songsLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: getSongs
  });

  const { data: guesses, isFetched: guessesFetched } = useQuery({
    queryKey: ['guesses'],
    queryFn: getGuessedSongs,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  const statsMutation = useMutation({
    mutationFn: (guessedSong: boolean) => updateStats(guessedSong),
    onMutate: async (guessedSong: boolean) => {
      await queryClient.cancelQueries({ queryKey: ['stats'] });

      const prevStats = queryClient.getQueryData<Statistics>(['stats']);
      if (prevStats) {
        let gameAccuracy = 0;
        // find index of first green square
        const greenSquareIndex = guesses?.findIndex((guess) => guess.correctStatus === 'CORRECT');
        // calculate accuracy for this game [0,6]
        gameAccuracy = greenSquareIndex === -1 ? 0 : 6 - (greenSquareIndex ?? 6);

        queryClient.setQueryData<Statistics>(['stats'], {
          ...prevStats,
          gamesPlayed: prevStats.gamesPlayed + 1,
          gamesWon: guessedSong ? prevStats.gamesWon + 1 : prevStats.gamesWon,
          currentStreak: guessedSong ? prevStats.currentStreak + 1 : 0,
          maxStreak: Math.max(prevStats.maxStreak, guessedSong ? prevStats.currentStreak + 1 : 0),
          accuracy: prevStats.accuracy + gameAccuracy
        });
      }

      return { prevStats };
    },
    onSettled: (_newStats, err, _variables, context) => {
      if (err) {
        console.log('STATS MUTATION ERROR: ', err);
        queryClient.setQueryData(['guesses'], context?.prevStats);
      }

      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    }
  });

  const guessMutation = useMutation({
    mutationFn: (newGuess: GuessedSong) => updateGuessedSongs(newGuess),
    onMutate: async (newGuess: GuessedSong) => {
      await queryClient.cancelQueries({ queryKey: ['guesses'] });

      const prevGuesses = queryClient.getQueryData<GuessedSong[]>(['guesses']);
      if (prevGuesses) {
        queryClient.setQueryData<GuessedSong[]>(['guesses'], [...prevGuesses, newGuess]);
      }

      return { prevGuesses };
    },
    onSettled: (newGuesses, err, _variables, context) => {
      if (err) {
        console.log('GUESS MUTATION ERROR: ', err);
        queryClient.setQueryData(['guesses'], context?.prevGuesses);
      } else {
        if (newGuesses?.at(-1)?.correctStatus === 'CORRECT') {
          statsMutation.mutate(true);
        } else if (newGuesses?.length === 6 && newGuesses.at(-1)?.correctStatus !== 'CORRECT') {
          statsMutation.mutate(false);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['guesses'] });
    }
  });

  useEffect(() => {
    if (guessesFetched) {
      if (guesses) {
        if (guesses?.length === 6 || guesses?.at(-1)?.correctStatus === 'CORRECT') {
          const modal = document.getElementById('stats_modal') as HTMLDialogElement;
          modal.showModal();
        }
      } else {
        if (localUser.user?.guesses?.length === 6 || localUser.user?.guesses?.at(-1)?.correctStatus === 'CORRECT') {
          const modal = document.getElementById('stats_modal') as HTMLDialogElement;
          modal.showModal();
        }
      }
    }
  }, [guessesFetched, guesses, localUser.user?.guesses]);

  const handleSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    function getCorrectStatus(song: Song) {
      console.log('Guessed song: ', song);
      console.log('Daily song: ', dailySong);

      return song.name === dailySong?.name ? 'CORRECT' : song?.album === dailySong?.album ? 'ALBUM' : 'WRONG';
    }

    // find song object that was selected
    const selectedSong = songs?.find((song) => song.name === event.target.value);
    if (!selectedSong) return;

    if (session) {
      guessMutation.mutate({
        id: createId(),
        name: selectedSong.name,
        album: selectedSong.album,
        cover: selectedSong.cover,
        correctStatus: getCorrectStatus(selectedSong),
        guessListId: createId()
      });
    } else {
      localUser.updateGuesses({
        name: selectedSong.name,
        album: selectedSong.album || '',
        cover: selectedSong.cover,
        correctStatus: getCorrectStatus(selectedSong)
      });
    }
  };

  const disableOption = (song: Song) => {
    if (session) {
      return guesses?.some((guess) => guess.name === song.name) || guesses?.length === 6 || guesses?.at(-1)?.correctStatus === 'CORRECT';
    } else {
      return localUser.user?.guesses?.some((guess) => guess.name === song.name) || localUser.user?.guesses?.length === 6 || localUser.user?.guesses?.at(-1)?.correctStatus === 'CORRECT';
    }
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
