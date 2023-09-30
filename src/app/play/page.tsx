'use client';

import { useSession } from 'next-auth/react';
import AudioPlayer from '../../components/AudioPlayer';
import { useQuery } from '@tanstack/react-query';
import { getDailySong, getSongs } from '@/lib/songsApi';
import { getSessionUser } from '@/lib/userApi';
import Link from 'next/link';
import SignInButton from '@/components/SignInButton';
import SignOutButton from '@/components/SignOutButton';

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

  return (
    <div>
      <h1>EDEN Heardle</h1>
      {session ? (
        <>
          <h2>Hello {session.user?.name}!</h2>
          <SignOutButton />
        </>
      ) : (
        <SignInButton />
      )}
      <Link href="/">
        <button className="btn btn-secondary">Home</button>
      </Link>
      <AudioPlayer songs={songs} />
    </div>
  );
}
