import { GuessCard } from '@/components/GuessCard';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export default function LoadingPlayPage() {
  return (
    <div className="flex flex-col items-center h-full justify-between">
      {/* Navbar */}
      <div className="navbar bg-base-200">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
          </div>
          <Link href={'/'} className="btn btn-ghost normal-case text-xl">
            EDEN Heardle
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex"></div>

        {/* children are modal server components, stats modal is client component */}

        <div className="navbar-end menu menu-horizontal px-1">
          <li>
            <label className="swap swap-rotate">
              <input type="checkbox" />
              <FontAwesomeIcon icon={faMoon} className="w-6 h-6 swap-on" />
              <FontAwesomeIcon icon={faSun} className="w-6 h-6 swap-off" />
            </label>
          </li>
        </div>
      </div>

      <div className="grid grid-rows-2-auto place-items-center gap-1 px-4 w-full h-full pt-4">
        {/* 6 GuessCards */}
        <div className="grid grid-rows-6 w-4/5 md:w-3/5 xl:w-2/5 gap-2 place-self-center">
          <GuessCard name="Getting data..." album="" cover="/default_song.png" showAnimation={false} />
          <GuessCard name="" album="" cover="/default_song.png" showAnimation={false} />
          <GuessCard name="" album="" cover="/default_song.png" showAnimation={false} />
          <GuessCard name="" album="" cover="/default_song.png" showAnimation={false} />
          <GuessCard name="" album="" cover="/default_song.png" showAnimation={false} />
          <GuessCard name="" album="" cover="/default_song.png" showAnimation={false} />
        </div>
        <div></div>
      </div>
      <div className="grid grid-rows-2-auto flex-col gap-2 items-center w-full card shadow-2xl px-4 pb-4">
        {/* SongSelectInput is omitted from loading page */}
        {/* Audio Player */}
        <div className="flex flex-col items-center gap-2 w-full">
          <progress className="progress progress-primary w-full md:w-3/5 xl:w-2/5"></progress>

          <div className="flex justify-between pt-2 w-full md:w-3/5 xl:w-2/5">
            <kbd className="kbd">00:00</kbd>
            <button className="btn btn-ghost btn-disabled">
              <span className="loading loading-ring loading-md"></span>
            </button>
            <kbd className="kbd">00:06</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
