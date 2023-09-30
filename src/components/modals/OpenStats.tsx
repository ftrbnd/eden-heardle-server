'use client';

export default function OpenStats() {
  const openModal = () => {
    const modal = document.getElementById('stats_modal') as HTMLDialogElement;
    modal.showModal();
  };

  return <a onClick={openModal}>Statistics</a>;
}
