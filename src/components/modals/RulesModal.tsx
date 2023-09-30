export default function StatsModal() {
  return (
    <dialog id="rules_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box min-w-min">
        <h3 className="font-bold text-lg">Rules</h3>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
