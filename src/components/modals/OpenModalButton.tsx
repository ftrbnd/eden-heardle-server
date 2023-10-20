'use client';

interface IProps {
  modalId: string;
  modalTitle: string;
}

export default function OpenModalButton({ modalId, modalTitle }: IProps) {
  const openModal = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (!modal.open) modal.showModal();
  };

  return <a onClick={openModal}>{modalTitle}</a>;
}
