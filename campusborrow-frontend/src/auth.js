// Small helpers to remember the logged-in user in the browser (localStorage).

const TOKEN_KEY = 'cb_token';
const USER_KEY = 'cb_user';

// Reads the expiry time stored inside the JWT (no verification, the server does that)
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Returns the saved token, or '' if there is none / it has expired
export function getStoredToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || isTokenExpired(token)) {
    clearAuth();
    return '';
  }
  return token;
}

export function getStoredUser() {
  if (!getStoredToken()) return null;
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}
