import { GuessedSong, Song, Statistics } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { createId } from '@paralleldrive/cuid2';
import { GuessType } from '@/utils/types';
import { correctlyGuessedHeardle } from '@/utils/userGuesses';
import useLocalUser from './useLocalUser';
import { getGuessedSongs, updateGuessedSongs, updateStats } from '@/services/users';

const useGuesses = () => {
  const { data: session } = useSession();
  const localUser = useLocalUser();
  const queryClient = useQueryClient();

  const { data: sessionGuesses, isInitialLoading: initialLoadingSessionGuesses } = useQuery({
    queryKey: ['guesses'],
    queryFn: () => getGuessedSongs(session?.user.id!),
    enabled: session?.user.id !== null,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  const statsMutation = useMutation({
    mutationFn: (guessedSong: boolean) => updateStats(guessedSong, session?.user.id!),
    onMutate: async (guessedSong: boolean) => {
      await queryClient.cancelQueries({ queryKey: ['stats'] });

      const prevStats = queryClient.getQueryData<Statistics>(['stats']);
      if (prevStats) {
        let gameAccuracy = 0;
        // find index of first green square
        const greenSquareIndex = sessionGuesses?.findIndex((guess) => guess.correctStatus === 'CORRECT');
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
        console.error('STATS MUTATION ERROR: ', err);
        queryClient.setQueryData(['guesses'], context?.prevStats);
      }

      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    }
  });

  const guessMutation = useMutation({
    mutationFn: (newGuess: GuessedSong) => updateGuessedSongs(newGuess, session?.user.id!),
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
        if (correctlyGuessedHeardle(sessionGuesses)) {
          statsMutation.mutate(true);
        } else if (newGuesses?.length === 6 && newGuesses.at(-1)?.correctStatus !== 'CORRECT') {
          statsMutation.mutate(false);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['guesses'] });
    }
  });

  const submitGuess = (guessedSong: Song, correctStatus: 'CORRECT' | 'WRONG' | 'ALBUM') => {
    if (session) {
      guessMutation.mutate({ ...guessedSong, id: createId(), guessListId: createId(), correctStatus });
    } else {
      localUser.updateGuesses({
        name: guessedSong.name,
        album: guessedSong.album ?? '',
        cover: guessedSong.cover,
        correctStatus
      });
    }
  };

  const getGuessType = (): GuessType => (session ? 'session' : 'local');

  return { guesses: session?.user ? sessionGuesses : localUser?.guesses, loadingGuesses: initialLoadingSessionGuesses, guessType: getGuessType(), submitGuess };
};

export default useGuesses;
