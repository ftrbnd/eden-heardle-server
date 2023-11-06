'use client';

import { ReactNode } from 'react';

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
    <a onClick={openModal}>
      {modalTitle}
      {children}
    </a>
  );
}
