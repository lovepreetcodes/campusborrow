import { useState } from 'react';
import { fileToResizedDataUrl } from '../imageHelper';

const inputClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

export default function PostItemForm({ apiUrl, token, onPosted, onCancel, onSessionExpired }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('borrow');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [busy, setBusy] = useState(false); // true while resizing image or saving

  // Resize the chosen photo and keep it as a text (base64) string
  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return setImageUrl('');

    setBusy(true);
    try {
      setImageUrl(await fileToResizedDataUrl(file));
    } catch {
      alert('Could not process that image.');
      setImageUrl('');
    }
    setBusy(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);

    const res = await fetch(`${apiUrl}/api/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // proves who is posting
      },
      body: JSON.stringify({ title, type, contact, description, imageUrl }),
    });

    setBusy(false);

    if (res.status === 401) return onSessionExpired();
    if (!res.ok) return alert('Could not save item.');

    onPosted(); // tell App to refresh the list
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 border-t-4 border-t-indigo-600 rounded-2xl p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Post an Item</h2>

      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className={inputClass}
          placeholder="Title (e.g., Scientific Calculator)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="borrow">Borrow</option>
          <option value="giveaway">Giveaway</option>
          <option value="request">Request</option>
          <option value="sell">Sell</option>
        </select>

        <input
          className={`${inputClass} sm:col-span-2`}
          placeholder="Contact (phone or email)"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />

        <input
          className={`${inputClass} sm:col-span-2`}
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="sm:col-span-2">
          <label className="text-sm text-slate-600 block mb-1">Photo (optional)</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
          {imageUrl && (
            <img src={imageUrl} alt="Preview" className="mt-3 h-28 rounded-lg border border-slate-200" />
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button
          type="submit"
          disabled={busy}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
        >
          {busy ? 'Please wait...' : 'Add Item'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-100 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
