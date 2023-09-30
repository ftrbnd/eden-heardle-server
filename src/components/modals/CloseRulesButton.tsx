'use client';

import { useRouter } from 'next/navigation';

export default function CloseRulesButton() {
  const router = useRouter();

  return (
    <button className="btn" onClick={() => router.replace('/play')}>
      Close
    </button>
  );
}
