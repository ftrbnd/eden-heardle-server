import { Song } from '@prisma/client';
import GuessCard from '../GuessCard';
import CloseRulesButton from './CloseRulesButton';
import Link from 'next/link';

async function getTwoRandomSongs() {
  const res = await fetch('http://localhost:3000/api/songs?limit=2');

  if (!res.ok) throw new Error('Failed to fetch 2 random songs');

  const data = await res.json();
  return data;
}

export default async function RulesModal() {
  const { songs }: { songs: Song[] } = await getTwoRandomSongs();

  const exampleDailySong = {
    name: 'End Credits',
    album: 'End Credits'
  };

  const getCorrectStatus = (song: Song) => {
    if (song.name === exampleDailySong.name) {
      return 'CORRECT';
    } else if (song.album === exampleDailySong.album) {
      return 'ALBUM';
    } else {
      return 'WRONG';
    }
  };

  return (
    <dialog id="rules_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box min-w-min">
        <h3 className="font-bold text-2xl">How To Play</h3>
        <div className="py-4">
          <p className="font-bold text-lg">Guess the song in 6 tries.</p>
          <ul className="list-disc px-6 py-4">
            <li>A random song is selected every day and will have a random starting point.</li>
            <li>Every incorrect guess extends the {"song's"} playback duration by one second.</li>
            <li>The {"tiles'"} icon will change if your guess belongs to the same album.</li>
          </ul>
          <h3 className="font-bold text-lg">Examples</h3>
          <div className="grid grid-rows-2 gap-2 py-2">
            {songs && songs?.map((song) => <GuessCard key={song.id} name={song.name} album={song.album || ''} cover={song.cover} correctStatus={getCorrectStatus(song)} />)}
          </div>
          <p className="text-md pt-2">
            A new puzzle is released daily at midnight (Eastern Time). If you {"haven't"} already, you can join our{' '}
            <Link className="link" href={'https://discord.gg/futurebound'} target="_blank">
              Discord server
            </Link>{' '}
            for reminders.
          </p>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
}
