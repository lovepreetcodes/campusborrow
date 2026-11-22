import { useState } from 'react';
import { DEFAULT_ITEM_IMAGE } from '../imageHelper';

// Each item type gets its own colour so the feed is easy to scan
const TYPE_STYLES = {
  borrow: 'bg-indigo-100 text-indigo-700',
  giveaway: 'bg-emerald-100 text-emerald-700',
  request: 'bg-amber-100 text-amber-800',
  sell: 'bg-rose-100 text-rose-700',
};

export default function ItemCard({ item, currentUserId, isLoggedIn, onDelete, onLogin }) {
  const [copied, setCopied] = useState(false);

  const contact = item.contact || item.phone; // server hides this for guests
  const isOwner = currentUserId && item.owner === currentUserId;

  async function copyContact() {
    await navigator.clipboard.writeText(contact);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <img
        src={item.imageUrl || DEFAULT_ITEM_IMAGE}
        alt={item.title}
        className="w-full h-32 object-cover"
      />

      <div className="p-4 flex-1">
        <span
          className={`text-xs font-semibold capitalize px-2.5 py-0.5 rounded-full ${
            TYPE_STYLES[item.type] || TYPE_STYLES.borrow
          }`}
        >
          {item.type}
        </span>
        <h2 className="font-semibold text-slate-900 mt-3 break-words">{item.title}</h2>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2 break-words">{item.description}</p>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm">
        {/* Contact: guests see a login button, logged-in users see the contact */}
        {!isLoggedIn ? (
          <button
            onClick={onLogin}
            className="text-indigo-600 font-medium hover:underline cursor-pointer"
          >
            Login to view contact
          </button>
        ) : contact ? (
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-slate-700">{contact}</span>
            <button
              onClick={copyContact}
              className="text-xs font-medium border border-slate-300 bg-white rounded-md px-2 py-0.5 hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        ) : (
          <span className="text-slate-400">Contact unavailable</span>
        )}

        {/* Only the owner sees Delete (the server checks this too) */}
        {isOwner && (
          <button
            onClick={() => onDelete(item._id)}
            className="block ml-auto mt-2 text-xs font-medium text-rose-600 hover:underline cursor-pointer"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
