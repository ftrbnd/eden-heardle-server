'use client';

import Link from 'next/link';

export default function RulesButton() {
  return (
    <Link
      href={{
        pathname: '/play',
        query: {
          rules: 'true'
        }
      }}
    >
      <button className="btn btn-secondary btn-outline">How To Play</button>
    </Link>
  );
}
