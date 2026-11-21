import { useRef, useState } from 'react';
import { fileToResizedDataUrl } from '../imageHelper';

export default function PostItemForm({ apiUrl, token, onCreated, onCancel, onAuthExpired }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('borrow');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  function resetForm() {
    setTitle('');
    setType('borrow');
    setContact('');
    setDescription('');
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (isProcessingImage || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, type, contact, description, imageUrl }),
      });

      if (res.status === 401) {
        onAuthExpired();
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || err.message || 'Could not save item.');
        return;
      }

      resetForm();
      onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-5 shadow-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white">Post an Item</h2>
        <span className="text-xs text-slate-400">Linked to your account</span>
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
          <option value="sell">Sell</option>
        </select>

        <input
          type="text"
          placeholder="Contact (phone or email)"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
          required
        />

        <input
          type="text"
          placeholder="Short description or return timeline"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
        />

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
          <p className="text-xs text-slate-400 sm:col-span-2">Preparing image...</p>
        )}

        {imageUrl && (
          <div className="sm:col-span-2">
            <div className="w-full max-w-xs h-32 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
        <button
          type="submit"
          disabled={isProcessingImage || submitting}
          className="bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-400 disabled:opacity-50 transition cursor-pointer"
        >
          {submitting ? 'Adding...' : 'Add Item'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-slate-700 text-slate-300 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-800 transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}