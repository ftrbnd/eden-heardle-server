'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function PlayButton() {
  return (
    <Link href="/play">
      <motion.button
        className="btn btn-primary"
        whileHover={{
          scale: 1.1,
          transition: {
            duration: 0.2
          }
        }}
        whileTap={{ scale: 0.9 }}
      >
        Play
      </motion.button>
    </Link>
  );
}
