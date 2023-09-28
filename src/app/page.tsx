'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import AudioPlayer from '../components/AudioPlayer';

export default function Home() {
  const { data: session } = useSession();
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
      <AudioPlayer songs={[]} />
    </div>
  );
}
