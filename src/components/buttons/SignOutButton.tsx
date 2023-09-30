'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button className="btn btn-secondary btn-outline" onClick={() => signOut()}>
      Sign Out
    </button>
  );
}
