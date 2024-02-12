import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import SignInButton from '../buttons/SignInButton';
import SignOutButton from '../buttons/SignOutButton';

export default async function SettingsModal() {
  const session = await getServerSession(options);

  return (
    <dialog id="settings_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box min-w-min max-h-80 sm:max-h-max">
        <h3 className="font-bold text-lg">Settings</h3>
        <div className="flex flex-col py-4 gap-1">
          <div className="flex justify-between">
            <p>Feedback</p>
            <a className="link link-accent" href="mailto:giosalas25@gmail.com?subject=EDEN Heardle Feedback" target="_blank">
              Email
            </a>
          </div>
          <div className="divider m-0"></div>
          <div className="flex justify-between">
            <p>Community</p>
            <a className="link link-accent" href="https://discord.gg/futurebound" target="_blank">
              Discord
            </a>
          </div>
          <div className="divider m-0"></div>
        </div>
        <p className="font-bold text-xs">© 2024 giosalad</p>
        <div className="flex flex-col items-end">{session ? <SignOutButton styled /> : <SignInButton />}</div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
}
