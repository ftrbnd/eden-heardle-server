'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  modalId: string;
  modalTitle: string;
  className?: string;
  children?: ReactNode;
}

export default function OpenModalButton({ modalId, modalTitle, className, children }: ButtonProps) {
  const openModal = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (!modal.open) modal.showModal();
  };

  return (
    <motion.a
      onClick={openModal}
      whileHover={{
        scale: 1.1,
        transition: {
          duration: 0.2
        }
      }}
      whileTap={{ scale: 0.9 }}
      className={className}
    >
      {modalTitle}
      {children}
    </motion.a>
  );
}
