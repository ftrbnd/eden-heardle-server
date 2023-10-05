'use client';

import { getLeaderboard } from '@/lib/statsApi';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import SignInButton from '../buttons/SignInButton';

type Tab = 'TODAY' | 'WIN_PCT' | 'CUR_STRK' | 'MAX_STRK';

function StatTable({ activeTab }: { activeTab: Tab }) {
  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard
  });

  const showSpecificStat = () => {
    switch (activeTab) {
      case 'TODAY':
        return (
          <tbody>
            {leaderboard?.today.map((userDaily, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <Image src={userDaily.user.image || '/default.png'} alt={`${userDaily.user.name}'s Avatar`} height={48} width={48} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{userDaily.user.name}</div>
                    </div>
                  </div>
                </td>
                <td>{userDaily.data}</td>
              </tr>
            ))}
          </tbody>
        );
      case 'WIN_PCT':
        return (
          <tbody>
            {leaderboard?.winPercentages.map((winPct, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <Image src={winPct.user.image || '/default.png'} alt={`${winPct.user.name}'s Avatar`} height={48} width={48} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{winPct.user.name}</div>
                    </div>
                  </div>
                </td>
                <td>{winPct.data}</td>
              </tr>
            ))}
          </tbody>
        );
      case 'CUR_STRK':
        return (
          <tbody>
            {leaderboard?.currentStreaks.map((streak, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <Image src={streak.user.image || '/default.png'} alt={`${streak.user.name}'s Avatar`} height={48} width={48} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{streak.user.name}</div>
                    </div>
                  </div>
                </td>
                <td>{streak.data}</td>
              </tr>
            ))}
          </tbody>
        );
      case 'MAX_STRK':
        return (
          <tbody>
            {leaderboard?.maxStreaks.map((streak, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <Image src={streak.user.image || '/default.png'} alt={`${streak.user.name}'s Avatar`} height={48} width={48} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{streak.user.name}</div>
                    </div>
                  </div>
                </td>
                <td>{streak.data}</td>
              </tr>
            ))}
          </tbody>
        );
      default:
        return <tbody></tbody>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">{showSpecificStat()}</table>
    </div>
  );
}

function Tabs({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (tab: Tab) => void }) {
  return (
    <div className="tabs flex justify-center">
      <a onClick={() => setActiveTab('TODAY')} className={`tab tab-xs sm:tab-md tab-bordered ${activeTab === 'TODAY' && 'tab-active'}`}>
        Today
      </a>
      <a onClick={() => setActiveTab('WIN_PCT')} className={`tab tab-xs sm:tab-md tab-bordered ${activeTab === 'WIN_PCT' && 'tab-active'}`}>
        Win Percentage
      </a>
      <a onClick={() => setActiveTab('CUR_STRK')} className={`tab tab-xs sm:tab-md tab-bordered ${activeTab === 'CUR_STRK' && 'tab-active'}`}>
        Current Streaks
      </a>
      <a onClick={() => setActiveTab('MAX_STRK')} className={`tab tab-xs sm:tab-md tab-bordered ${activeTab === 'MAX_STRK' && 'tab-active'}`}>
        Max Streaks
      </a>
    </div>
  );
}

export default function LeaderboardModal() {
  const [activeTab, setActiveTab] = useState<Tab>('TODAY');
  const { data: session } = useSession();

  return (
    <dialog id="leaderboard_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box min-w-min">
        <h3 className="font-bold text-lg">Leaderboard</h3>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <StatTable activeTab={activeTab} />
        {!session && (
          <>
            <div className="divider mb-0"></div>
            <div className="flex flex-col items-center">
              <p>Stats are not stored in the database without an account!</p>
            </div>
            <div className="divider mt-0"></div>
          </>
        )}
        {!session && (
          <div className="flex flex-col items-end">
            <SignInButton />
          </div>
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
}
