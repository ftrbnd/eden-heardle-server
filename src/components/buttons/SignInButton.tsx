'use client';

import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function SignInButton() {
  return (
    <motion.button
      className="btn btn-secondary btn-outline"
      onClick={() => signIn('discord')}
      whileHover={{
        scale: 1.1,
        transition: {
          duration: 0.2
        }
      }}
      whileTap={{ scale: 0.9 }}
    >
      Sign In
      <FontAwesomeIcon icon={faDiscord} className="h-6 w-6" />
    </motion.button>
  );
}
