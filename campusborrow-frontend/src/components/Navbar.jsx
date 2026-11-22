import logo from '../assets/hero.png';

const outlineButton =
  'border border-indigo-700 text-indigo-100 px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-900 cursor-pointer';

export default function Navbar({
  user,
  showPostForm,
  showReport,
  onLogin,
  onLogout,
  onPostClick,
  onReportClick,
}) {
  return (
    <nav className="bg-indigo-950 sticky top-0 z-10 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo + name */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="CampusBorrow logo"
            className="h-10 w-10 object-contain bg-white rounded-xl p-1"
          />
          <span className="text-lg font-bold tracking-tight text-white">CampusBorrow</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPostClick}
            className="bg-white text-indigo-950 font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-100 cursor-pointer"
          >
            {showPostForm ? 'Close form' : 'Post item'}
          </button>

          <button onClick={onReportClick} className={outlineButton}>
            {showReport ? 'Close report' : 'Report'}
          </button>

          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-indigo-200 px-1">{user.name}</span>
              <button onClick={onLogout} className={outlineButton}>Logout</button>
            </>
          ) : (
            <button onClick={onLogin} className={outlineButton}>Login</button>
          )}
        </div>
      </div>
    </nav>
  );
}
