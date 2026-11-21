import { useEffect, useState } from 'react';
import { clearAuth, getStoredUser, getToken, saveAuth } from './auth';
import AuthModal from './components/AuthModal';
import ItemCard from './components/ItemCard';
import Navbar from './components/Navbar';
import PostItemForm from './components/PostItemForm';
import ReportForm from './components/ReportForm';

const ITEM_TYPES = ['all', 'borrow', 'giveaway', 'request','sell'];
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(
  /\/+$/,
  ''
);

function App() {
  
  const [items, setItems] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getToken());
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [showPostForm, setShowPostForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  function handleAuthSuccess({ token: nextToken, user: nextUser }) {
    saveAuth(nextToken, nextUser);
    setToken(nextToken);
    setUser(nextUser);
  }

  function handleLogout() {
    clearAuth();
    setToken(null);
    setUser(null);
    setShowPostForm(false);
  }

  function handleAuthExpired() {
    handleLogout();
    setShowAuthModal(true);
  }

  function requireAuth(action) {
    if (!token) {
      setShowAuthModal(true);
      return false;
    }
    action();
    return true;
  }

  async function fetchItems(activeType = selectedType, authToken = token) {
    try {
      const query =
        activeType && activeType !== 'all'
          ? `?type=${encodeURIComponent(activeType)}`
          : '';

      const headers = authToken
        ? { Authorization: `Bearer ${authToken}` }
        : {};

      const response = await fetch(`${API_URL}/api/items${query}`, { headers });
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
  }

  useEffect(() => {
    fetchItems(selectedType, token);
  }, [selectedType, token]);

  async function handleToggleStatus(item) {
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    const nextStatus = item.status === 'claimed' ? 'available' : 'claimed';
    const response = await fetch(`${API_URL}/api/items/${item._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (response.status === 401) {
      handleAuthExpired();
      return;
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      alert(data.error || data.message || 'Could not update status.');
      return;
    }

    fetchItems(selectedType, token);
  }

  async function handleDeleteItem(itemId) {
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    const response = await fetch(`${API_URL}/api/items/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401) {
      handleAuthExpired();
      return;
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      alert(data.error || data.message || 'Could not delete item.');
      return;
    }

    setItems((prev) => prev.filter((item) => item._id !== itemId));
  }

  async function handleCopyContact(itemId, contactValue) {
    if (!contactValue) return;
    try {
      await navigator.clipboard.writeText(contactValue);
      setCopiedId(itemId);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      alert(`Contact: ${contactValue}`);
    }
  }

  const visibleItems = items.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (item.title || '').toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q)
    );
  });

  const currentUserId = user?.id || user?._id || null;

  return (
    <div id="top" className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar
        user={user}
        showPostForm={showPostForm}
        showReportForm={showReportForm}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onTogglePostForm={() =>
          requireAuth(() => {
            setShowPostForm((prev) => !prev);
            setShowReportForm(false);
          })
        }
        onToggleReportForm={() => {
          setShowReportForm((prev) => !prev);
          setShowPostForm(false);
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {showPostForm && token && (
          <PostItemForm
            apiUrl={API_URL}
            token={token}
            onCreated={() => {
              setShowPostForm(false);
              fetchItems(selectedType, token);
            }}
            onCancel={() => setShowPostForm(false)}
            onAuthExpired={handleAuthExpired}
          />
        )}

        {showReportForm && (
          <ReportForm onClose={() => setShowReportForm(false)} />
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-1.5">
            {ITEM_TYPES.map((itemType) => {
              const isActive = selectedType === itemType;
              return (
                <button
                  key={itemType}
                  type="button"
                  onClick={() => setSelectedType(itemType)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-xs'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {itemType}
                </button>
              );
            })}
          </div>

          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 w-full sm:w-56 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>

        {visibleItems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
            No matching items found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {visibleItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                currentUserId={currentUserId}
                isLoggedIn={Boolean(token)}
                copiedId={copiedId}
                onCopyContact={handleCopyContact}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteItem}
                onOpenAuth={() => setShowAuthModal(true)}
              />
            ))}
          </div>
        )}
      </main>

      {showAuthModal && (
        <AuthModal
          apiUrl={API_URL}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

export default App;