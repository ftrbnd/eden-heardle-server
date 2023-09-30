'use client';

import { useSession } from 'next-auth/react';
import AudioPlayer from '../../components/AudioPlayer';
import { useQuery } from '@tanstack/react-query';
import { getDailySong, getSongs } from '@/lib/songsApi';
import { getSessionUser } from '@/lib/userApi';
import Navbar from '@/components/Navbar';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    <div>
      <Navbar>{children}</Navbar>
      <AudioPlayer songs={songs} />
    </div>
  );
}
