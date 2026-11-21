export default function Navbar({
  user,
  showPostForm,
  showReportForm,
  onOpenAuth,
  onLogout,
  onTogglePostForm,
  onToggleReportForm,
}) {
  return (
    <nav className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3 group shrink-0">
          <img
            src="/hero.png"
            alt="UniShare logo"
            className="h-11 w-11 object-contain shrink-0 transition group-hover:scale-105"
          />
          <div className="leading-tight">
            <span className="text-lg font-bold tracking-tight text-white block">
              CampusBorrow
            </span>
            <span className="text-[11px] font-medium text-slate-400 hidden sm:block">
              Share &amp; borrow on campus
            </span>
          </div>
        </a>

        <div className="flex items-center gap-3">
          {/* Primary actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onTogglePostForm}
              className="bg-blue-500 text-white px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-400 transition cursor-pointer shrink-0"
            >
              {showPostForm ? 'Close Form' : '+ Post Item'}
            </button>

            <button
              type="button"
              onClick={onToggleReportForm}
              className="border border-slate-700 bg-slate-800/80 text-slate-200 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-700 transition cursor-pointer shrink-0"
            >
              {showReportForm ? 'Close Report' : 'Report'}
            </button>
          </div>

          {/* Divider + Account controls */}
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {user ? (
            <div className="flex items-center gap-2">
              <span
                title={user.name}
                className="max-w-[110px] truncate px-2.5 py-1 rounded-md bg-slate-800/70 border border-slate-700/80 text-xs font-medium text-slate-300 hidden sm:inline-block"
              >
                {user.name}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="border border-slate-700 bg-slate-800 text-slate-300 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-700 hover:text-white transition cursor-pointer shrink-0"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="border border-blue-500/40 bg-blue-500/15 text-blue-300 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-500/25 transition cursor-pointer shrink-0"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}