'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import AudioPlayer from '../components/AudioPlayer';
import { useQuery } from '@tanstack/react-query';
import { getDailySong, getSongs } from '@/lib/songsApi';

export default function Home() {
  const { data: session } = useSession();
  const { data: songs } = useQuery({
    queryKey: ['songs'],
    queryFn: getSongs
  });
  const { data: dailySong } = useQuery({
    queryKey: ['daily'],
    queryFn: getDailySong
  });
  console.log('SONGS: ', songs);
  console.log('DAILY: ', dailySong);

  return (
    <div>
      <h1>EDEN Heardle</h1>
      {session ? (
        <>
          <h2>Hello {session.user?.name}!</h2>
          <button className="btn btn-secondary" onClick={() => signOut()}>
            Sign Out
          </button>
        </>
      ) : (
        <button className="btn btn-primary" onClick={() => signIn('discord')}>
          Sign In
        </button>
      )}
      <AudioPlayer songs={songs} />
    </div>
  );
}
