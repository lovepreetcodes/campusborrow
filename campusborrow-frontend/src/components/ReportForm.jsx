import { useState } from 'react';

export default function ReportForm({ onClose, onSubmitted }) {
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setReportReason('');
    setReportDetails('');
    onClose();
    if (onSubmitted) onSubmitted();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-5 shadow-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white">Report</h2>
        <span className="text-xs text-slate-400">Fill details and submit</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Reason or item name"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          required
        />

        <input
          type="text"
          placeholder="Details"
          value={reportDetails}
          onChange={(e) => setReportDetails(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          required
        />
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-400 transition cursor-pointer"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onClose}
          className="border border-slate-700 text-slate-300 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-800 transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}