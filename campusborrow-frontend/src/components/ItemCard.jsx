import { DEFAULT_ITEM_IMAGE } from '../imageHelper';

export default function ItemCard({
  item,
  currentUserId,
  isLoggedIn,
  copiedId,
  onCopyContact,
  onDelete,
  onOpenAuth,
}) {
  const isClaimed = item.status === 'claimed';
  const contactValue = item.contact || item.phone || '';
  const ownerId = (item.owner?._id || item.owner || '').toString();
  const isOwner = Boolean(currentUserId && ownerId && ownerId === currentUserId.toString());

  return (
    <div
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
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${
                item.type === 'sell'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
                  : 'bg-blue-500/15 text-blue-300 border-blue-500/20'
              }`}
            >
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
        {isLoggedIn ? (
          <div className="flex items-center justify-between gap-1.5">
            <span className="truncate text-slate-300" title={contactValue}>
              {contactValue}
            </span>
            <button
              type="button"
              onClick={() => onCopyContact(item._id, contactValue)}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 shrink-0 transition cursor-pointer"
            >
              {copiedId === item._id ? 'Copied' : 'Copy'}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full text-center text-[10px] font-medium py-1 rounded bg-slate-900 border border-slate-800 text-blue-400 hover:bg-slate-800 hover:text-blue-300 transition cursor-pointer"
          >
            Login to view contact
          </button>
        )}

        {isOwner && (
          <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex justify-end text-[10px] font-medium">
            <button
              type="button"
              onClick={() => onDelete(item._id)}
              className="text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}