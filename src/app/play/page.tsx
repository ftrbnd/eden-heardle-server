'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import AudioPlayer from '../../components/AudioPlayer';
import { useQuery } from '@tanstack/react-query';
import { getDailySong, getSongs } from '@/lib/songsApi';
import { getSessionUser } from '@/lib/userApi';
import Link from 'next/link';

export default function Play() {
  const { data: session } = useSession();
  const { data: songs } = useQuery({
    queryKey: ['songs'],
    queryFn: getSongs
  });
  const { data: dailySong } = useQuery({
    queryKey: ['daily'],
    queryFn: getDailySong
  });
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getSessionUser
  });
  console.log('SONGS: ', songs);
  console.log('DAILY: ', dailySong);
  console.log('USER: ', user);

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
      <Link href="/">
        <button className="btn btn-secondary">Home</button>
      </Link>
      <AudioPlayer songs={songs} />
    </div>
  );
}
