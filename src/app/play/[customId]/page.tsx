'use client';

import { ProfileDropdown } from '@/components/Navbar';
import ThemeButton from '@/components/buttons/ThemeButton';
import OpenModalButton from '@/components/modals/OpenModalButton';
import { getCustomHeardle } from '@/lib/customHeardleApi';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

function CustomHeardlePageNavbar() {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-200">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <OpenModalButton modalId="rules_modal" modalTitle="Rules" />
            </li>
          </ul>
        </div>
        <Link href={'/'} className="btn btn-ghost normal-case text-xl">
          EDEN Heardle
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <OpenModalButton modalId="rules_modal" modalTitle="Rules" />
          </li>
        </ul>
      </div>

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

export default function CustomHeardlePage({ params }: { params: { customId: string } }) {
  const { data: song } = useQuery({
    queryKey: ['customHeardle', params.customId],
    queryFn: () => getCustomHeardle(params.customId)
  });

  return (
    <div className="flex flex-col items-center h-full">
      <CustomHeardlePageNavbar />
      <p>Custom heardle: {song?.name ?? 'NOT FOUND'}</p>
    </div>
  );
}
