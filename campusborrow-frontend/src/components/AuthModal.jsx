import { useState } from 'react';

export default function AuthModal({ apiUrl, onClose, onSuccess }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body =
        mode === 'login' ? { email, password } : { name, email, password };

      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || 'Authentication failed.');
        return;
      }

      onSuccess(data);
      onClose();
    } catch {
      setError('Could not connect to server.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 w-full max-w-sm shadow-xl">
        <h2 className="text-base font-semibold text-white mb-3">
          {mode === 'login' ? 'Login to CampusBorrow' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            required
          />

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-400 disabled:opacity-50 transition cursor-pointer"
            >
              {submitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign up'}
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

        <button
          type="button"
          onClick={() => {
            setError('');
            setMode((m) => (m === 'login' ? 'register' : 'login'));
          }}
          className="mt-3 text-xs text-blue-400 hover:underline cursor-pointer"
        >
          {mode === 'login'
            ? 'Need an account? Sign up'
            : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}