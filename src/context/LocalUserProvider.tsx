'use client';

import { getDailySong } from '@/lib/songsApi';
import { useQuery } from '@tanstack/react-query';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

interface LocalGuessedSong {
  name: string;
  album?: string;
  cover: string;
  correctStatus: 'CORRECT' | 'ALBUM' | 'WRONG';
}

interface LocalStatistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  accuracy: number;
}

interface LocalUser {
  guesses: LocalGuessedSong[];
  statistics: LocalStatistics;
  name?: 'anon';
}

interface LoggedInDate {
  month: number;
  date: number;
  year: number;
}

const initialUser: LocalUser = {
  statistics: {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    accuracy: 0
  },
  guesses: [],
  name: 'anon'
};

type LocalUserState = {
  user: LocalUser | null;
  updateGuesses: (guess: LocalGuessedSong) => void;
};

const LocalUserContext = createContext<LocalUserState | null>(null);

const useLocalUser = (): LocalUserState => {
  const context = useContext(LocalUserContext);

  if (!context) {
    throw new Error('Please use LocalUserProvider in parent component');
  }

  return context;
};

export const LocalUserProvider = (props: PropsWithChildren) => {
  const [user, setUser] = useState<LocalUser>(initialUser);

  const { data: dailySong } = useQuery({
    queryKey: ['daily'],
    queryFn: getDailySong,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  useEffect(() => {
    reset();
    // TODO: reset all users and uncomment below code on next deployment

    // const localUser = localStorage.getItem('eden_heardle_user');

    // if (localUser) {
    //   setUser(JSON.parse(localUser));
    // } else {
    //   localStorage.setItem('eden_heardle_user', JSON.stringify(initialUser));
    //   setUser(initialUser);
    // }
  }, []);

  useEffect(() => {
    if (user !== initialUser) {
      localStorage.setItem('eden_heardle_user', JSON.stringify(user));
    }

    console.log('Local user: ', user);
  }, [user]);

  useEffect(() => {
    if (dailySong) {
      const lastLoggedIn = localStorage.getItem('eden_heardle_last_logged_in');
      const today = dailySong.heardleDay!;

      if (lastLoggedIn !== null && lastLoggedIn !== undefined) {
        // check streaks and reset guesses
        const lastDay = parseInt(lastLoggedIn);
        if (lastDay < today) {
          if (localStorage.getItem('eden_heardle_user')) {
            const oldUser: LocalUser = JSON.parse(localStorage.getItem('eden_heardle_user')!);

            const completedLastHeardle = oldUser.guesses.at(-1)?.correctStatus === 'CORRECT';

            const oldStats = { ...oldUser.statistics };
            const newStats: LocalStatistics = {
              gamesPlayed: oldStats.gamesPlayed,
              gamesWon: oldStats.gamesWon,
              currentStreak: completedLastHeardle ? oldStats.currentStreak : 0,
              maxStreak: oldStats.maxStreak,
              accuracy: oldStats.accuracy
            };

            setUser((prevUser) => ({
              name: prevUser.name,
              guesses: [],
              statistics: newStats
            }));

            localStorage.setItem(
              'eden_heardle_user',
              JSON.stringify({
                name: oldUser.name,
                guesses: [],
                statistics: newStats
              })
            );
          }

          localStorage.setItem('eden_heardle_last_logged_in', JSON.stringify(today));
        }
      } else {
        localStorage.setItem('eden_heardle_last_logged_in', JSON.stringify(today));
      }
    }
  }, [dailySong]);

  const updateGuesses = (guess: LocalGuessedSong) => {
    /**
     * Only runs when a user completes the game
     * @param guessedSong whether the user guessed the song within 6 attempts
     */
    function updateStatistics(guessedSong: boolean, finalGuesses: LocalGuessedSong[]) {
      const oldStats = { ...user.statistics };

      // find index of first green square
      const greenSquareIndex = finalGuesses.findIndex((guess) => guess.correctStatus === 'CORRECT');

      // calculate accuracy for this game [0,6]
      const gameAccuracy = greenSquareIndex === -1 ? 0 : 6 - greenSquareIndex;

      const newStats: LocalStatistics = {
        gamesPlayed: oldStats.gamesPlayed + 1,
        gamesWon: guessedSong ? oldStats.gamesWon + 1 : oldStats.gamesWon,
        currentStreak: guessedSong ? oldStats.currentStreak + 1 : 0,
        maxStreak: Math.max(oldStats.maxStreak, guessedSong ? oldStats.currentStreak + 1 : 0),
        accuracy: oldStats.accuracy + gameAccuracy
      };

      setUser((prevUser) => ({
        name: prevUser.name,
        guesses: prevUser.guesses,
        statistics: newStats
      }));

      localStorage.setItem(
        'eden_heardle_user',
        JSON.stringify({
          name: user.name,
          guesses: user.guesses,
          statistics: newStats
        })
      );
    }

    const newGuesses = [...user.guesses];
    newGuesses.push(guess);

    setUser((prevUser) => ({
      name: prevUser.name,
      statistics: prevUser.statistics,
      guesses: newGuesses
    }));
    localStorage.setItem(
      'eden_heardle_user',
      JSON.stringify({
        name: user.name,
        statistics: user.statistics,
        guesses: newGuesses
      })
    );

    if (newGuesses.at(-1)?.correctStatus === 'CORRECT') {
      updateStatistics(true, newGuesses);
    } else if (newGuesses.length === 6 && newGuesses.at(-1)?.correctStatus !== 'CORRECT') {
      updateStatistics(false, newGuesses);
    }
  };

  // FOR DEV ONLY:
  const reset = () => {
    localStorage.setItem('eden_heardle_last_logged_in', '0');
    localStorage.setItem('eden_heardle_user', JSON.stringify(initialUser));
    setUser(initialUser);
  };

  // const resetGuesses = () => {
  //   setUser((prevUser) => ({
  //     name: prevUser.name,
  //     guesses: [],
  //     statistics: prevUser.statistics
  //   }));

  //   localStorage.setItem(
  //     'eden_heardle_user',
  //     JSON.stringify({
  //       name: user.name,
  //       guesses: [],
  //       statistics: user.statistics
  //     })
  //   );
  // };

  return <LocalUserContext.Provider value={{ user, updateGuesses }}>{props.children}</LocalUserContext.Provider>;
};

export default useLocalUser;
