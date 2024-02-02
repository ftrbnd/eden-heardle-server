'use client';

import { getLeaderboard, getUserStats } from '@/lib/statsApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import SignInButton from '../buttons/SignInButton';
import { User } from '@prisma/client';
import ProfileModal from './ProfileModal';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LeaderboardStat } from '@/utils/types';
import statusSquares from '@/utils/statusSquares';

function ProfileColumn({ user }: { user: User }) {
  const [showProfile, setShowProfile] = useState(false);

  const queryClient = useQueryClient();

  const prefetchUserStats = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['stats', user.id],
      queryFn: () => getUserStats(user.id)
    });
  };

  return (
    <td>
      <div onMouseOver={prefetchUserStats} onClick={() => setShowProfile(true)} className="flex items-center space-x-3 rounded hover:cursor-pointer hover:bg-base-200">
        <div className="avatar p-2">
          <div className="mask mask-squircle w-8 h-8">
            <Image src={user.image || '/default.png'} alt={`${user.name}'s Avatar`} height={48} width={48} />
          </div>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <div className="font-bold">{user.name}</div>
          {user.earlySupporter && (
            <div className="tooltip" data-tip="Early Supporter">
              <FontAwesomeIcon className="w-3 h-3 text-accent" icon={faGem} />
            </div>
          )}
        </div>
      </div>
      {showProfile && <ProfileModal user={user} showProfile={showProfile} setShowProfile={setShowProfile} />}
    </td>
  );
}

const StatTable = ({ type, stat, isLoading }: { type: LeaderboardStat['type']; stat?: LeaderboardStat[]; isLoading: boolean }) => {
  const getEmptyTableNotice = () => {
    switch (type) {
      case 'Today':
        return "No one has completed today's Heardle yet!";
      case 'WinPct':
        return 'No one has won a game yet!';
      case 'Accuracy':
        return 'No one has completed a game yet!';
      case 'CurStrk':
        return 'There are no active streaks.';
      case 'MaxStrk':
        return 'No max streaks available yet.';
    }
  };

  if (isLoading)
    return (
      <table>
        <tbody>
          <tr>
            <th>0</th>
            <td className="p-0 text-center h-14">Loading...</td>
          </tr>
        </tbody>
      </table>
    );

  if (!stat)
    return (
      <table>
        <tbody>
          <tr>
            <th>0</th>
            <td className="p-0 text-center h-14">Statistics unavailable.</td>
          </tr>
        </tbody>
      </table>
    );

  return (
    <table className="w-full">
      <tbody className="w-full flex flex-col gap-2">
        {stat.length > 0 ? (
          stat.map((stat, index) => (
            <tr key={`${stat.type}-${index}`} className="grid grid-flow-col items-center w-full">
              <th>{index + 1}</th>
              <ProfileColumn user={stat.user} />
              <td className="text-right"> {stat.type === 'Today' ? statusSquares(stat.data) : stat.data}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="p-0 text-center h-14">{getEmptyTableNotice()}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

function Tabs() {
  const [activeTab, setActiveTab] = useState<LeaderboardStat['type']>('Today');

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  const getActiveStat = () => {
    switch (activeTab) {
      case 'Today':
        return leaderboard?.today;
      case 'WinPct':
        return leaderboard?.winPercentages;
      case 'Accuracy':
        return leaderboard?.accuracies;
      case 'CurStrk':
        return leaderboard?.currentStreaks;
      case 'MaxStrk':
        return leaderboard?.maxStreaks;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="max-sm:carousel rounded-box w-full">
        <div role="tablist" className="tabs tabs-boxed max-sm:carousel-item">
          <p role="tab" className={`tab h-12 text-xs ${activeTab === 'Today' && 'tab-active'}`} onClick={() => setActiveTab('Today')}>
            Today
          </p>
          <p role="tab" className={`tab h-12 text-xs ${activeTab === 'WinPct' && 'tab-active'}`} onClick={() => setActiveTab('WinPct')}>
            Win Percentage
          </p>
          <p role="tab" className={`tab h-12 text-xs ${activeTab === 'Accuracy' && 'tab-active'}`} onClick={() => setActiveTab('Accuracy')}>
            Accuracy
          </p>
          <p role="tab" className={`tab h-12 text-xs ${activeTab === 'CurStrk' && 'tab-active'}`} onClick={() => setActiveTab('CurStrk')}>
            Current Streaks
          </p>
          <p role="tab" className={`tab h-12 text-xs ${activeTab === 'MaxStrk' && 'tab-active'}`} onClick={() => setActiveTab('MaxStrk')}>
            Max Streaks
          </p>
        </div>
      </div>
      <StatTable stat={getActiveStat()} isLoading={leaderboardLoading} type={activeTab} />
    </div>
  );
}

export default function LeaderboardModal() {
  const { data: session } = useSession();

  return (
    <dialog id="leaderboard_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box h-2/5 sm:h-3/5">
        <h3 className="font-bold text-lg">Leaderboard</h3>
        <Tabs />
        {!session && (
          <>
            <div className="divider mb-0"></div>
            <div className="flex flex-col items-center">
              <p>Your stats are not stored in the cloud without an account!</p>
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
