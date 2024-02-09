'use client';

import { MouseEventHandler, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface RedirectButtonProps {
  title: string;
  className?: string;
  onClick?: MouseEventHandler;
  children?: ReactNode;
}

function RedirectButton({ title, className, onClick, children }: RedirectButtonProps) {
  return (
    <li>
      <motion.a
        whileHover={{
          scale: 1.1,
          transition: {
            duration: 0.2
          }
        }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={className}
      >
        {title}
        {children}
      </motion.a>
    </li>
  );
}

interface ModalButtonProps extends RedirectButtonProps {
  modalId: string;
}

export function ModalButton({ title, modalId, className, children }: ModalButtonProps) {
  const openModal = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (!modal.open) modal.showModal();
  };

  return (
    <RedirectButton title={title} className={className} onClick={openModal}>
      {children}
    </RedirectButton>
  );
}

interface LinkButtonProps extends RedirectButtonProps {
  href: string;
}

export function LinkButton({ title, href, className, children }: LinkButtonProps) {
  return (
    <RedirectButton title={title} className={className}>
      <Link href={href}>{children}</Link>
    </RedirectButton>
  );
}
