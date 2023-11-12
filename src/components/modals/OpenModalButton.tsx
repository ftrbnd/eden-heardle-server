'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface IProps {
  modalId: string;
  modalTitle: string;
  children?: ReactNode;
}

export default function OpenModalButton({ modalId, modalTitle, children }: IProps) {
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
    >
      {modalTitle}
      {children}
    </motion.a>
  );
}
