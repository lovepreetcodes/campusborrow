import { useState } from 'react';

const inputClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

export default function ReportForm({ onClose }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);

  // Note: reports are not saved to a database yet, this only shows a thank-you message
  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setTimeout(onClose, 3000);
  }

  if (sent) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mb-6 text-sm">
        Thanks for reporting!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 border-t-4 border-t-indigo-600 rounded-2xl p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Report</h2>

      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className={inputClass}
          placeholder="Reason or item name"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        <input
          className={inputClass}
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-2 mt-5">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 cursor-pointer"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onClose}
          className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-100 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
