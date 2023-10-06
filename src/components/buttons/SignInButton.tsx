'use client';

import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn } from 'next-auth/react';

export default function SignInButton() {
  return (
    <button className="btn btn-secondary btn-outline" onClick={() => signIn('discord')}>
      Sign In
      <FontAwesomeIcon icon={faDiscord} className="h-6 w-6" />
    </button>
  );
}
