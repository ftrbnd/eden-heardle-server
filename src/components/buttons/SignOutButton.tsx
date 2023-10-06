'use client';

import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button className="btn btn-secondary btn-outline" onClick={() => signOut()}>
      Sign Out
      <FontAwesomeIcon icon={faArrowRightFromBracket} />
    </button>
  );
}
