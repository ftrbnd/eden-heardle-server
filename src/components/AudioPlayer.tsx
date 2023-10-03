'use client';

import { getGuessedSongs, getSongs, updateGuessedSongs } from '@/lib/songsApi';
import { updateStats } from '@/lib/statsApi';
import { IconDefinition, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createId } from '@paralleldrive/cuid2';
import { DailySong, GuessedSong, Song, Statistics } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

interface IProps {
  dailySong?: DailySong;
}

export default function AudioPlayer({ dailySong }: IProps) {
  const [selected, setSelected] = useState('');

  const [icon, setIcon] = useState<IconDefinition>(faPlay);
  const [color, setColor] = useState<'#ffffff' | '#000000'>('#ffffff');
  const audioRef = useRef<HTMLAudioElement>(null);

  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: songs } = useQuery({
    queryKey: ['songs'],
    queryFn: getSongs
  });

  const { data: guesses, isLoading: guessesLoading } = useQuery({
    queryKey: ['guesses'],
    queryFn: getGuessedSongs
  });

  const statsMutation = useMutation({
    mutationFn: (guessedSong: boolean) => updateStats(guessedSong),
    onMutate: async (guessedSong: boolean) => {
      await queryClient.cancelQueries({ queryKey: ['stats'] });

      const prevStats = queryClient.getQueryData<Statistics>(['stats']);
      if (prevStats) {
        queryClient.setQueryData<Statistics>(['stats'], {
          ...prevStats,
          gamesPlayed: prevStats.gamesPlayed + 1,
          gamesWon: guessedSong ? prevStats.gamesWon + 1 : prevStats.gamesWon,
          currentStreak: guessedSong ? prevStats.currentStreak + 1 : 0,
          maxStreak: Math.max(prevStats.maxStreak, guessedSong ? prevStats.currentStreak + 1 : 0)
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
    audioRef.current?.addEventListener('playing', () => {
      // console.log('PLAYING');
    });

    audioRef.current?.addEventListener('timeupdate', () => {
      // console.log(audioRef.current?.currentTime);
    });
  }, []);

  useEffect(() => {
    if (guesses?.length === 6 || guesses?.at(-1)?.correctStatus === 'CORRECT') {
      const modal = document.getElementById('stats_modal') as HTMLDialogElement;
      modal.showModal();
    }
  }, [guesses]);

  useEffect(() => {
    if (theme === 'lofi') {
      setColor('#ffffff');
    } else {
      setColor('#000000');
    }
  }, [theme]);

  const handleSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    function getCorrectStatus(song: Song) {
      return song.name === dailySong?.name ? 'CORRECT' : song?.album === dailySong?.album ? 'ALBUM' : 'WRONG';
    }

    setSelected(event.target.value);

    // find song object that was selected
    const selectedSong = songs?.find((song) => song.name === event.target.value);
    if (!selectedSong) return;

    if (!session) return;
    guessMutation.mutate({
      id: createId(),
      name: selectedSong.name,
      album: selectedSong.album,
      cover: selectedSong.cover,
      correctStatus: getCorrectStatus(selectedSong),
      guessListId: createId()
    });
  };

  const togglePlayer = () => {
    if (!audioRef.current) return;

    if (icon === faPlay) {
      audioRef.current?.play();
      setIcon(faPause);
    } else {
      audioRef.current?.pause();
      setIcon(faPlay);
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center w-96 md:w-3/5 card shadow-2xl">
      <progress className="progress progress-primary w-56" value={1} max="6"></progress>

      <button className="btn btn-ghost" onClick={togglePlayer}>
        <FontAwesomeIcon icon={icon} className={`w-6 h-6 ${color} `} />
      </button>
      <audio ref={audioRef} className="hidden" src="/daily_song.mp3" />

      <select className="select select-primary w-full max-w-xs" defaultValue={'Choose a Song'} onChange={handleSelection}>
        <option disabled>Choose a Song</option>
        {songs?.map((song) => (
          <option key={song.id} value={song.name} disabled={guesses?.some((guess) => guess.name === song.name) || guesses?.length === 6 || guesses?.at(-1)?.correctStatus === 'CORRECT'}>
            {song.name}
          </option>
        ))}
      </select>
    </div>
  );
}
