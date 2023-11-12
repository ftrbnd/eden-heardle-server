'use client';

import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function SignOutButton() {
  return (
    <motion.button
      className="btn btn-secondary btn-outline"
      onClick={() => signOut()}
      whileHover={{
        scale: 1.1,
        transition: {
          duration: 0.2
        }
      }}
      whileTap={{ scale: 0.9 }}
    >
      Sign Out
      <FontAwesomeIcon icon={faArrowRightFromBracket} />
    </motion.button>
  );
}
