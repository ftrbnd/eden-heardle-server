'use client';

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
  reset: () => void;
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

  useEffect(() => {
    const localUser = localStorage.getItem('eden_heardle_user');

    if (localUser) {
      setUser(JSON.parse(localUser));
    } else {
      localStorage.setItem('eden_heardle_user', JSON.stringify(initialUser));
      setUser(initialUser);
    }
  }, []);

  useEffect(() => {
    if (user !== initialUser) {
      localStorage.setItem('eden_heardle_user', JSON.stringify(user));
    }
  }, [user]);

  const updateGuesses = (guess: LocalGuessedSong) => {
    function updateStatistics(guessedSong: boolean) {
      const oldStats = { ...user.statistics };

      const newStats: LocalStatistics = {
        gamesPlayed: oldStats.gamesPlayed + 1,
        gamesWon: guessedSong ? oldStats.gamesWon + 1 : oldStats.gamesWon,
        currentStreak: guessedSong ? oldStats.currentStreak + 1 : 0,
        maxStreak: Math.max(oldStats.maxStreak, guessedSong ? oldStats.currentStreak + 1 : 0)
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
      updateStatistics(true);
    } else if (newGuesses.length === 6 && newGuesses.at(-1)?.correctStatus !== 'CORRECT') {
      updateStatistics(false);
    }
  };

  const reset = () => {
    localStorage.setItem('eden_heardle_user', JSON.stringify(initialUser));
    setUser(initialUser);
  };

  return <LocalUserContext.Provider value={{ user, updateGuesses, reset }}>{props.children}</LocalUserContext.Provider>;
};

export default useLocalUser;
