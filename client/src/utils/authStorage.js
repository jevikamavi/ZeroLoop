// Small helper so the login token is stored/read the same way everywhere.
const TOKEN_KEY = 'zeroloop-token';

export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // e.g. private browsing with storage disabled — safe to ignore
  }
}

export function clearToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}
