import CloseRulesButton from './CloseRulesButton';

export default function StatsModal() {
  return (
    <dialog id="rules_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box min-w-min">
        <h3 className="font-bold text-2xl">How To Play</h3>
        <div className="py-4">
          <p className="font-bold text-lg">Guess the song in 6 tries.</p>
          <ul className="list-disc px-6 py-4">
            <li>A random song is selected every day and will have a random starting point.</li>
            <li>Every incorrect guess extends the {"song's"} playback duration by one second.</li>
            <li>The color of the tiles will change if your guess belongs to the same album.</li>
          </ul>
          <h3 className="font-bold text-lg">Examples</h3>
          <p className="font-bold text-lg highlight bg-primary">TODO: Add song card examples</p>
          <p className="text-md">A new puzzle is released daily at midnight (Eastern Time). If you {"haven't"} already, you can join our Discord server for reminders.</p>
        </div>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <CloseRulesButton />
          </form>
        </div>
      </div>
    </dialog>
  );
}
