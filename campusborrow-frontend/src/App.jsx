import { useEffect, useRef, useState } from 'react';
import { DEFAULT_ITEM_IMAGE, fileToResizedDataUrl } from './imageHelper';

const ITEM_TYPES = ['all', 'borrow', 'giveaway', 'request'];

function App() {
  const [items, setItems] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  // Filter & search state
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState('borrow');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [deleteKey, setDeleteKey] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Inline card action state: { itemId, mode: 'delete' | 'status' } | null
  const [activeAction, setActiveAction] = useState(null);
  const [keyInput, setKeyInput] = useState('');
  const [actionError, setActionError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const fileInputRef = useRef(null);


  function handleReportSubmit(e) {
    e.preventDefault();
    setReportReason('');
    setReportDetails('');
    setShowReportForm(false);
  }
  function resetForm() {
    setTitle('');
    setType('borrow');
    setContact('');
    setDescription('');
    setDeleteKey('');
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setImageUrl('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      e.target.value = '';
      return;
    }

    setIsProcessingImage(true);
    try {
      const resized = await fileToResizedDataUrl(file);
      setImageUrl(resized);
    } catch {
      alert('Could not process that image. Try another photo.');
      setImageUrl('');
    } finally {
      setIsProcessingImage(false);
    }
  }

  async function fetchItems(activeType = selectedType) {
    const query =
      activeType && activeType !== 'all'
        ? `?type=${encodeURIComponent(activeType)}`
        : '';

    const response = await fetch(`${API_URL}/api/items${query}`);
    const data = await response.json();
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    fetchItems(selectedType);
  }, [selectedType]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (isProcessingImage) return;

    const response = await fetch(`${API_URL}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        type,
        contact,
        description,
        imageUrl,
        deleteKey,
      }),
    });

    if (!response.ok) {
      alert('Could not save item.');
      return;
    }

    resetForm();
    setShowPostForm(false);
    fetchItems(selectedType);
  }

  function openCardAction(itemId, mode) {
    setActiveAction({ itemId, mode });
    setKeyInput('');
    setActionError('');
  }

  function closeCardAction() {
    setActiveAction(null);
    setKeyInput('');
    setActionError('');
  }

  async function confirmCardAction(e, item) {
    e.preventDefault();
    setActionError('');

    if (!keyInput.trim()) {
      setActionError('Enter your secret key.');
      return;
    }

    if (activeAction.mode === 'delete') {
      const response = await fetch(`${API_URL}/api/items/${item._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteKey: keyInput }),
      });

      const data = await response.json();
      if (!response.ok) {
        setActionError(data.error || 'Could not delete item.');
        return;
      }

      closeCardAction();
      fetchItems(selectedType);
    }

    if (activeAction.mode === 'status') {
      const response = await fetch(
        `${API_URL}/api/items/${item._id}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deleteKey: keyInput }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setActionError(data.error || 'Could not update status.');
        return;
      }

      closeCardAction();
      fetchItems(selectedType);
    }
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

    const inTitle = (item.title || '').toLowerCase().includes(q);
    const inDesc = (item.description || '').toLowerCase().includes(q);
    return inTitle || inDesc;
  });
return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navbar */}
    {/* Top Navbar */}
      <nav className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
            <img
              src="/hero.png"
              alt="UniShare logo"
              className="h-12 w-12 object-contain shrink-0 transition group-hover:scale-105"
            />
            <div className="leading-tight">
              <span className="text-lg font-bold tracking-tight text-white block">
                CampusBurrow
              </span>
              <span className="text-[11px] font-medium text-slate-400 hidden sm:block">
                Share &amp; borrow on campus
              </span>
            </div>
          </a>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setShowReportForm((prev) => !prev);
                setShowPostForm(false);
              }}
              className="border border-slate-700 bg-slate-800 text-slate-200 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-700 active:scale-[0.99] transition cursor-pointer"
            >
              {showReportForm ? 'Close Report' : 'Report'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowPostForm((prev) => !prev);
                setShowReportForm(false);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium shadow-2xs hover:bg-blue-400 active:scale-[0.99] transition cursor-pointer"
            >
              {showPostForm ? 'Close Form' : '+ Post Item'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {/* Toggleable Post Item Form */}
        {showPostForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-5 shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">
                Post an Item
              </h2>
              <span className="text-xs text-slate-400">
                Key required to manage later
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Title (e.g., Scientific Calculator)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                required
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
              >
                <option value="borrow">Borrow</option>
                <option value="giveaway">Giveaway</option>
                <option value="request">Request</option>
              </select>

              <input
                type="text"
                placeholder="Contact (phone or email)"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                required
              />

              <input
                type="password"
                placeholder="Secret Delete Key (to manage/remove later)"
                value={deleteKey}
                onChange={(e) => setDeleteKey(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                required
              />

              <input
                type="text"
                placeholder="Short description or return timeline"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
              />

              {/* Optional Photo Upload */}
              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-3 pt-0.5">
                <label className="text-xs sm:text-sm text-slate-300 font-medium">
                  Photo (optional):
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-xs sm:text-sm text-slate-400 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border file:border-slate-700 file:text-xs file:font-medium file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                />
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-xs text-rose-400 hover:underline self-start sm:self-center cursor-pointer"
                  >
                    Remove photo
                  </button>
                )}
              </div>

              {isProcessingImage && (
                <p className="text-xs text-slate-400 sm:col-span-2">
                  Preparing image...
                </p>
              )}

              {imageUrl && (
                <div className="sm:col-span-2">
                  <div className="w-full max-w-xs h-32 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                type="submit"
                disabled={isProcessingImage}
                className="bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-400 disabled:opacity-50 transition cursor-pointer"
              >
                Add Item
              </button>
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="border border-slate-700 text-slate-300 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Toggleable Report Form */}
        {showReportForm && (
          <form
            onSubmit={handleReportSubmit}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-5 shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">Report</h2>
              <span className="text-xs text-slate-400">
                Fill details and submit
              </span>
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
                onClick={() => setShowReportForm(false)}
                className="border border-slate-700 text-slate-300 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Filter Buttons & Search Bar */}
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

        {/* Compact 5-Column Items Grid (10+ cards fit easily on desktop) */}
        {visibleItems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
            No matching items found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {visibleItems.map((item) => {
              const isClaimed = item.status === 'claimed';
              const contactValue = item.contact || item.phone || '';
              const isActionOpen = activeAction?.itemId === item._id;

              return (
                <div
                  key={item._id}
                  className={`bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm hover:border-slate-700 transition flex flex-col justify-between ${
                    isClaimed ? 'opacity-80' : ''
                  }`}
                >
                  <div>
                    <div className="w-full h-28 bg-slate-950 overflow-hidden border-b border-slate-800">
                      <img
                        src={item.imageUrl || DEFAULT_ITEM_IMAGE}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_ITEM_IMAGE;
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-2.5">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/20">
                          {item.type}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${
                            isClaimed
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                          }`}
                        >
                          {item.status || 'available'}
                        </span>
                      </div>

                      <h2 className="text-xs sm:text-sm font-bold text-white leading-snug break-words">
                        {item.title}
                      </h2>

                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 break-words">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-2.5 pb-2.5 pt-2 border-t border-slate-800 text-[11px] text-slate-300 bg-slate-950/50">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="truncate text-slate-300" title={contactValue}>
                        {contactValue}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyContact(item._id, contactValue)}
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 shrink-0 transition cursor-pointer"
                      >
                        {copiedId === item._id ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-medium">
                      <button
                        type="button"
                        onClick={() => openCardAction(item._id, 'status')}
                        className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                      >
                        {isClaimed ? 'Available' : 'Claim'}
                      </button>

                      <button
                        type="button"
                        onClick={() => openCardAction(item._id, 'delete')}
                        className="text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>

                    {isActionOpen && (
                      <form
                        onSubmit={(e) => confirmCardAction(e, item)}
                        className="mt-2 pt-2 border-t border-slate-800 space-y-1.5"
                      >
                        <input
                          type="password"
                          placeholder="Item key"
                          value={keyInput}
                          onChange={(e) => setKeyInput(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                          autoFocus
                        />

                        {actionError && (
                          <p className="text-[10px] text-rose-400">{actionError}</p>
                        )}

                        <div className="flex items-center gap-1.5">
                          <button
                            type="submit"
                            className={`px-2 py-1 rounded text-[10px] font-medium text-white transition cursor-pointer ${
                              activeAction.mode === 'delete'
                                ? 'bg-rose-600 hover:bg-rose-500'
                                : 'bg-blue-500 hover:bg-blue-400'
                            }`}
                          >
                            {activeAction.mode === 'delete' ? 'Delete' : 'Save'}
                          </button>

                          <button
                            type="button"
                            onClick={closeCardAction}
                            className="px-2 py-1 rounded text-[10px] text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
export default App;