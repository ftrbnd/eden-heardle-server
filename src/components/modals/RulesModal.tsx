import { Song } from '@prisma/client';
import { GuessCard } from '../GuessCard';
import Link from 'next/link';
import prisma from '@/lib/db';

async function getTwoRandomSongs() {
  try {
    const songsCount = await prisma.song.count();
    const skip = Math.floor(Math.random() * songsCount);

    let songs: Song[] = [];
    while (songs.length !== 3) {
      songs = await prisma.song.findMany({
        skip: skip,
        take: 3
      });
    }

    return songs;
  } catch (err) {
    console.log('Failed to get two random songs for example: ', err);
    return [];
  }
}

export default async function RulesModal() {
  const songs = await getTwoRandomSongs();

  const getCorrectStatus = (song: Song) => {
    if (song?.name === songs[0]?.name) {
      return 'CORRECT';
    } else if (song.album === songs[0].album) {
      return 'ALBUM';
    } else {
      return 'WRONG';
    }
  };

  return (
    <dialog id="rules_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box min-w-min max-h-80 sm:max-h-max">
        <h3 className="font-bold text-2xl">How To Play</h3>
        <div className="py-4">
          <p className="font-bold text-lg">Guess the song in 6 tries.</p>
          <ul className="list-disc px-6 py-4">
            <li>A random song is selected every day and will have a random starting point.</li>
            <li>Every incorrect guess extends the {"song's"} playback duration by one second.</li>
            <li>The {"tiles'"} icon will change if your guess belongs to the same album.</li>
          </ul>
          <div className="tooltip" data-tip={'Refresh for a new example!'}>
            <h3 className="text-lg">
              Example:{' '}
              <span className="font-bold">
                {songs[0]?.name} ({songs[0]?.album})
              </span>
            </h3>
          </div>
          <div className="grid grid-rows-2 gap-2 py-2">
            <GuessCard key={songs[1]?.id} name={songs[1]?.name} album={songs[1]?.album || ''} cover={songs[1]?.cover} correctStatus={getCorrectStatus(songs[1])} showAnimation={false} />
            <GuessCard key={songs[2]?.id} name={songs[2]?.name} album={songs[2]?.album || ''} cover={songs[2]?.cover} correctStatus={getCorrectStatus(songs[2])} showAnimation={false} />
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
