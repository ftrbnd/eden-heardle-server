import { GuessedSong } from '@prisma/client';
import { LocalGuessedSong } from './types';

const finishedHeardle = (guesses?: GuessedSong[] | LocalGuessedSong[] | null) => guesses?.length === 6 || guesses?.at(-1)?.correctStatus === 'CORRECT';

const correctlyGuessedHeardle = (guesses?: GuessedSong[] | LocalGuessedSong[] | null) => guesses?.at(-1)?.correctStatus === 'CORRECT';

export { finishedHeardle, correctlyGuessedHeardle };
