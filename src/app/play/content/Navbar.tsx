'use client';

import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { ReactNode, useEffect } from 'react';
import OpenModalButton from '../../../components/buttons/OpenModalButton';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ThemeButton from '../../../components/buttons/ThemeButton';
import StatsModal from '../../../components/modals/StatsModal';
import { motion } from 'framer-motion';

export function ProfileDropdown({ session }: { session: Session | null }) {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <Image src={session?.user.image || '/default.png'} height={100} width={100} alt={`Avatar of ${session?.user.name}`} />
        </div>
      </label>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <OpenModalButton modalId="settings_modal" modalTitle="Settings" />
        </li>
        <li onClick={() => signOut()}>
          <motion.a
            whileHover={{
              scale: 1.1,
              transition: {
                duration: 0.2
              }
            }}
            whileTap={{ scale: 0.9 }}
          >
            Sign Out
          </motion.a>
        </li>
      </ul>
    </div>
  );
}

export default function Navbar({ children, onCustomHeardlePage }: { children: ReactNode; onCustomHeardlePage?: boolean }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const openRules = searchParams.get('rules');

  useEffect(() => {
    if (openRules === 'true') {
      const modal = document.getElementById('rules_modal') as HTMLDialogElement;
      if (!modal.open) modal.showModal();
    }
  }, [openRules]);

  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
            {/* <div className="badge badge-primary badge-xs badge-success"></div> */}
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <OpenModalButton modalId="rules_modal" modalTitle="Rules" />
            </li>
            {!onCustomHeardlePage && (
              <>
                <li>
                  <OpenModalButton modalId="stats_modal" modalTitle="Statistics" />
                </li>
                <li>
                  <OpenModalButton modalId="leaderboard_modal" modalTitle="Leaderboard" />
                </li>
              </>
            )}
            <li>
              <OpenModalButton modalId="custom_heardle_modal" modalTitle="Custom Heardle" />
            </li>
          </ul>
        </div>
        <Link href={'/'} className="btn btn-ghost normal-case text-xl px-2 lg:px-4">
          EDEN Heardle
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <OpenModalButton modalId="rules_modal" modalTitle="Rules" />
          </li>
          {!onCustomHeardlePage && (
            <>
              <li>
                <OpenModalButton modalId="stats_modal" modalTitle="Statistics" />
              </li>
              <li>
                <OpenModalButton modalId="leaderboard_modal" modalTitle="Leaderboard" />
              </li>
            </>
          )}
          <li>
            <OpenModalButton modalId="custom_heardle_modal" modalTitle="Custom Heardle" />
          </li>
        </ul>
      </div>

      {/* children are modal server components, stats modal is client component */}
      {children}
      <StatsModal />

      <div className="navbar-end menu menu-horizontal px-1">
        <li>
          <ThemeButton />
        </li>
        {session ? (
          <ProfileDropdown session={session} />
        ) : (
          <li>
            <OpenModalButton modalId="settings_modal" modalTitle="Settings" />
          </li>
        )}
      </div>
    </div>
  );
}
