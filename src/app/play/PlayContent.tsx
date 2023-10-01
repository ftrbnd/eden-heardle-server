'use client';

import { useSession } from 'next-auth/react';
import AudioPlayer from '../../components/AudioPlayer';
import { useQuery } from '@tanstack/react-query';
import { getDailySong, getSongs } from '@/lib/songsApi';
import { getSessionUser } from '@/lib/userApi';
import Navbar from '@/components/Navbar';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GuessCard from '@/components/GuessCard';

export default function PlayContent({ children }: { children: ReactNode }) {
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

  const router = useRouter();

  useEffect(() => {
    router.replace('/play');
  }, [router]);

  return (
    <div className="flex flex-col items-center h-full justify-between">
      <Navbar>{children}</Navbar>
      <div className="grid grid-rows-6 items-center max-w-fit gap-2">
        {songs?.map((song) => (
          <GuessCard key={song.id} name={song.name} album={song.album || ''} cover={song.cover} correctStatus={'ALBUM'} />
        ))}
      </div>
      <AudioPlayer songs={songs} />
    </div>
  );
}
