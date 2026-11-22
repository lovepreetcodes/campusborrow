import { useState } from 'react';

const inputClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

export default function AuthModal({ apiUrl, onSuccess, onClose }) {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = sign up
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Login sends email+password, sign up also sends the name
    const url = apiUrl + (isLogin ? '/api/auth/login' : '/api/auth/register');
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) return setError(data.message || 'Something went wrong.');

      onSuccess(data); // gives { token, user } to App
      onClose();
    } catch {
      setError('Could not connect to server.');
    }
  }

  return (
    <div className="fixed inset-0 z-30 bg-indigo-950/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl border-t-4 border-t-indigo-600">
        <h2 className="text-lg font-semibold mb-4">
          {isLogin ? 'Login to CampusBorrow' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <input
              className={inputClass}
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            className={inputClass}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className={inputClass}
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 cursor-pointer"
            >
              {isLogin ? 'Login' : 'Sign up'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>

        <button
          onClick={() => {
            setError('');
            setIsLogin(!isLogin);
          }}
          className="mt-4 text-sm text-indigo-600 hover:underline cursor-pointer"
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
