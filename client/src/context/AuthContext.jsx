import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { getToken, setToken, clearToken } from '../utils/authStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => getToken());
  const [checking, setChecking] = useState(true);

  // On first load, if a token was saved from a previous visit, confirm
  // it's still valid before letting the resident straight into the app.
  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setChecking(false);
      return;
    }
    api.me().then((data) => {
      if (cancelled) return;
      if (data?.user) {
        setUser(data.user);
      } else {
        clearToken();
        setTokenState(null);
      }
      setChecking(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If any API call comes back 401 (expired/invalid session), sign out
  // automatically so the resident sees the login screen right away.
  useEffect(() => {
    const onExpired = () => {
      clearToken();
      setTokenState(null);
      setUser(null);
    };
    window.addEventListener('zeroloop-auth-expired', onExpired);
    return () => window.removeEventListener('zeroloop-auth-expired', onExpired);
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await api.login({ email, password });
    if (result.ok) {
      setToken(result.token);
      setTokenState(result.token);
      setUser(result.user);
    }
    return result;
  }, []);

  const register = useCallback(async (name, email, password, address) => {
    const result = await api.register({ name, email, password, address });
    if (result.ok) {
      setToken(result.token);
      setTokenState(result.token);
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!token && !!user,
    checking,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>');
  return ctx;
}
