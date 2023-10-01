'use client';

import { useState } from 'react';

type Tab = 'TODAY' | 'WIN_PCT' | 'CUR_STRK' | 'MAX_STRK';

export default function LeaderboardModal() {
  const [activeTab, setActiveTab] = useState<Tab>('TODAY');

  return (
    <dialog id="leaderboard_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box min-w-min">
        <h3 className="font-bold text-lg">Leaderboard</h3>
        <div className="tabs flex justify-center">
          <a onClick={() => setActiveTab('TODAY')} className={`tab tab-bordered ${activeTab === 'TODAY' && 'tab-active'}`}>
            Today
          </a>
          <a onClick={() => setActiveTab('WIN_PCT')} className={`tab tab-bordered ${activeTab === 'WIN_PCT' && 'tab-active'}`}>
            Win Percentage
          </a>
          <a onClick={() => setActiveTab('CUR_STRK')} className={`tab tab-bordered ${activeTab === 'CUR_STRK' && 'tab-active'}`}>
            Current Streaks
          </a>
          <a onClick={() => setActiveTab('MAX_STRK')} className={`tab tab-bordered ${activeTab === 'MAX_STRK' && 'tab-active'}`}>
            Max Streaks
          </a>
        </div>
        <p></p>
        <div className="modal-action ">
          <form method="dialog" className="flex gap-2">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
