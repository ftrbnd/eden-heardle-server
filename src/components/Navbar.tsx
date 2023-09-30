'use client';

import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { ReactNode } from 'react';
import OpenModalButton from './modals/OpenModalButton';

function ProfileDropdown({ session }: { session: Session | null }) {
  return (
    <div className="navbar-end">
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <Image src={session?.user.image || '/default.png'} height={100} width={100} alt={`Avatar of ${session?.user.name}`} />
          </div>
        </label>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <a className="justify-between">Profile</a>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li onClick={() => signOut()}>
            <a>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function Navbar({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <OpenModalButton modalId="stats_modal" modalTitle="Statistics" />
            </li>
            <li>
              <a>Leaderboard</a>
            </li>
            <li>
              <OpenModalButton modalId="rules_modal" modalTitle="Rules" />
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost normal-case text-xl">EDEN Heardle</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <OpenModalButton modalId="stats_modal" modalTitle="Statistics" />
          </li>
          <li>
            <a>Leaderboard</a>
          </li>
          <li>
            <OpenModalButton modalId="rules_modal" modalTitle="Rules" />
          </li>
        </ul>
      </div>

      {children}
      {session ? <ProfileDropdown session={session} /> : <div className="navbar-end"></div>}
    </div>
  );
}
