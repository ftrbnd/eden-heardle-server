'use client';

import { signIn } from 'next-auth/react';

export default function SignInButton() {
  return (
    <button className="btn btn-secondary btn-outline" onClick={() => signIn('discord')}>
      Sign In
    </button>
  );
}
