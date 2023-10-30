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

type Tab = 'TODAY' | 'WIN_PCT' | 'ACC' | 'CUR_STRK' | 'MAX_STRK';

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

function StatTable({ activeTab }: { activeTab: Tab }) {
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
    refetchInterval: 30000, // 30 seconds,
    refetchIntervalInBackground: true
  });

  const statusSquares = (guessStatuses: string[]): string => {
    function getStatusSquare(status: string) {
      switch (status) {
        case 'CORRECT':
          return '🟩';
        case 'ALBUM':
          return '🟧';
        case 'WRONG':
          return '🟥';
        default:
          return '⬜';
      }
    }

    let squares: string[] = [];
    guessStatuses?.forEach((status) => {
      squares.push(getStatusSquare(status));
    });

    return squares.join('');
  };

  const showSpecificStat = () => {
    switch (activeTab) {
      case 'TODAY':
        return (
          <tbody>
            {leaderboard?.today.length ? (
              leaderboard.today.map((guesses, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <ProfileColumn user={guesses.user} />
                  <td className="p-0 text-right">{statusSquares(guesses.data)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>{"No one has completed today's Heardle yet!"}</td>
              </tr>
            )}
          </tbody>
        );
      case 'WIN_PCT':
        return (
          <tbody>
            {leaderboard?.winPercentages.length ? (
              leaderboard.winPercentages.map((winPct, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <ProfileColumn user={winPct.user} />
                  <td className="text-right">{winPct.data}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>{'No one has won a game yet!'}</td>
              </tr>
            )}
          </tbody>
        );
      case 'ACC':
        return (
          <tbody>
            {leaderboard?.accuracies.length ? (
              leaderboard.accuracies.map((accuracy, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <ProfileColumn user={accuracy.user} />
                  <td className="text-right">{accuracy.data}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>{'No one has completed a game yet!'}</td>
              </tr>
            )}
          </tbody>
        );
      case 'CUR_STRK':
        return (
          <tbody>
            {leaderboard?.currentStreaks.length ? (
              leaderboard.currentStreaks.map((streak, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <ProfileColumn user={streak.user} />
                  <td className="text-right">{streak.data}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>{'There are no active streaks.'}</td>
              </tr>
            )}
          </tbody>
        );
      case 'MAX_STRK':
        return (
          <tbody>
            {leaderboard?.maxStreaks.length ? (
              leaderboard.maxStreaks.map((streak, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <ProfileColumn user={streak.user} />
                  <td className="text-right">{streak.data}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>{'No max streaks available yet.'}</td>
              </tr>
            )}
          </tbody>
        );
      default:
        return <tbody></tbody>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {leaderboardLoading ? (
          <tbody>
            <tr>
              <th>0</th>
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <Image src={'/default.png'} alt={`Default Avatar`} height={48} width={48} />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Getting users...</div>
                  </div>
                </div>
              </td>
              <td>0</td>
            </tr>
          </tbody>
        ) : (
          showSpecificStat()
        )}
      </table>
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
      <a onClick={() => setActiveTab('ACC')} className={`tab tab-xs sm:tab-md tab-bordered ${activeTab === 'ACC' && 'tab-active'}`}>
        Accuracy
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
      <div className="modal-box h-2/5 sm:h-3/5">
        <h3 className="font-bold text-lg">Leaderboard</h3>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <StatTable activeTab={activeTab} />
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
