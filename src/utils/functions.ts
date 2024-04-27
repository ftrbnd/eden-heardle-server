import { GuessedSong } from '@prisma/client';
import { LocalGuessedSong } from './types';

function getStatusSquare(status: string) {
  switch (status) {
    case 'CORRECT':
      return '🟩';
    case 'ALBUM':
      return '🟧';
    case 'WRONG':
      return '🟥';
    default:
      return '⬜';
  }
}

const statusSquares = (guessStatuses: string[]): string => {
  let squares: string[] = [];

  guessStatuses?.forEach((status) => {
    squares.push(getStatusSquare(status));
  });

  return squares.join(' ');
};

const finishedHeardle = (guesses?: GuessedSong[] | LocalGuessedSong[] | null) => guesses?.length === 6 || guesses?.at(-1)?.correctStatus === 'CORRECT';

const correctlyGuessedHeardle = (guesses?: GuessedSong[] | LocalGuessedSong[] | null) => guesses?.at(-1)?.correctStatus === 'CORRECT' || guesses?.some((guess) => guess.correctStatus === 'CORRECT');

const onnCustomHeardlePage = (pathname: string): boolean => {
  return pathname.startsWith('/play/') && !pathname.endsWith('unlimited');
};

export { statusSquares, finishedHeardle, correctlyGuessedHeardle, onnCustomHeardlePage };
