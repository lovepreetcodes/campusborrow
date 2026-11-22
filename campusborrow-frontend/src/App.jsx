import { useEffect, useState } from 'react';
import { clearAuth, getStoredToken, getStoredUser, saveAuth } from './auth';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import PostItemForm from './components/PostItemForm';
import ReportForm from './components/ReportForm';
import ItemCard from './components/ItemCard';

const ITEM_TYPES = ['all', 'borrow', 'giveaway', 'request', 'sell'];
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

export default function App() {
  // ---------- STATE (everything the app remembers) ----------
  const [items, setItems] = useState([]);            // items shown in the feed
  const [selectedType, setSelectedType] = useState('all');
  const [search, setSearch] = useState('');

  const [token, setToken] = useState(getStoredToken());  // '' means logged out
  const [user, setUser] = useState(getStoredUser());

  const [showAuth, setShowAuth] = useState(false);       // login/signup popup
  const [showPostForm, setShowPostForm] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // ---------- LOGIN / LOGOUT ----------
  function handleLogin(data) {
    saveAuth(data.token, data.user);   // remember in browser
    setToken(data.token);              // remember in React (this triggers a feed reload)
    setUser(data.user);
  }

  function handleLogout() {
    clearAuth();
    setToken('');
    setUser(null);
    setShowPostForm(false);
  }

  // Called when the server says our token is no longer valid (401)
  function handleSessionExpired() {
    handleLogout();
    setShowAuth(true);
  }

  // ---------- LOAD ITEMS FROM THE BACKEND ----------
  // The token is sent if we have one, so the server also returns contact details.
  async function loadItems() {
    try {
      const query = selectedType === 'all' ? '' : `?type=${selectedType}`;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_URL}/api/items${query}`, { headers });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
  }

  // Runs on page load, and again whenever the filter or the login changes
  useEffect(() => {
    loadItems();
  }, [selectedType, token]);

  // ---------- ACTIONS ----------
  async function handleDelete(itemId) {
    const res = await fetch(`${API_URL}/api/items/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) return handleSessionExpired();
    if (!res.ok) return alert('Could not delete item.');

    setItems(items.filter((item) => item._id !== itemId)); // remove from screen
  }

  function handlePostClick() {
    if (!token) return setShowAuth(true); // must log in first
    setShowPostForm(!showPostForm);
    setShowReport(false);
  }

  function handleReportClick() {
    setShowReport(!showReport);
    setShowPostForm(false);
  }

  function handleItemPosted() {
    setShowPostForm(false);
    loadItems(); // refresh the list so the new item appears
  }

  // ---------- SEARCH (done in the browser) ----------
  const text = search.trim().toLowerCase();
  const visibleItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(text) ||
      (item.description || '').toLowerCase().includes(text)
  );

  // ---------- SCREEN ----------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar
        user={user}
        showPostForm={showPostForm}
        showReport={showReport}
        onLogin={() => setShowAuth(true)}
        onLogout={handleLogout}
        onPostClick={handlePostClick}
        onReportClick={handleReportClick}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {showPostForm && (
          <PostItemForm
            apiUrl={API_URL}
            token={token}
            onPosted={handleItemPosted}
            onCancel={() => setShowPostForm(false)}
            onSessionExpired={handleSessionExpired}
          />
        )}

        {showReport && <ReportForm onClose={() => setShowReport(false)} />}

        {/* Intro */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-indigo-950">
            Borrow, give away or sell on campus
          </h1>
          <p className="text-slate-500 mt-1">
            See what students around you are sharing. Log in to get their contact details.
          </p>
        </div>

        {/* Type filter buttons + search box */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex flex-wrap gap-2">
            {ITEM_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize border cursor-pointer transition ${
                  selectedType === type
                    ? 'bg-indigo-950 text-white border-indigo-950'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400 hover:text-indigo-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-slate-300 rounded-full px-4 py-2 text-sm w-full sm:w-64 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Item grid */}
        {visibleItems.length === 0 ? (
          <p className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500">
            Nothing here yet. Try another filter, or post the first item.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {visibleItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                currentUserId={user?.id}
                isLoggedIn={Boolean(token)}
                onDelete={handleDelete}
                onLogin={() => setShowAuth(true)}
              />
            ))}
          </div>
        )}
      </main>

      {showAuth && (
        <AuthModal
          apiUrl={API_URL}
          onSuccess={handleLogin}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}
