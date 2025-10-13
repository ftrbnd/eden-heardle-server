'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

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
      <motion.button
        className="btn btn-secondary btn-outline"
        whileHover={{
          scale: 1.1,
          transition: {
            duration: 0.2
          }
        }}
        whileTap={{ scale: 0.9 }}
      >
        How To Play
      </motion.button>
    </Link>
  );
}
