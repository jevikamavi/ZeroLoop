import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const AppContext = createContext(null);

const EMPTY_ACCOUNT = {
  name: '',
  email: '',
  phone: '',
  points: 0,
  planName: 'ZeroLoop Plus — Weekly',
  addresses: [],
  notificationPrefs: { emailReminders: true, smsAlerts: true, missedAlerts: true, productUpdates: false }
};

export function AppProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [account, setAccount] = useState(EMPTY_ACCOUNT);
  const [activeAddressId, setActiveAddressId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem('zeroloop-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('zeroloop-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      // signed out — clear the previous resident's data from state
      setAccount(EMPTY_ACCOUNT);
      setActiveAddressId(null);
      setNotifications([]);
      return;
    }

    // show the logged-in name right away, then fill in the rest once
    // the full account record loads
    setAccount((prev) => ({ ...prev, name: user?.name || prev.name, email: user?.email || prev.email }));

    api.getAccount().then((data) => {
      if (data) {
        const normalized = {
          ...data,
          addresses: (data.addresses || []).map((a) => ({ id: a._id || a.id, label: a.label, city: a.city }))
        };
        setAccount(normalized);
        setActiveAddressId(normalized.addresses[0]?.id ?? null);
      }
    });

    setNotifications([
      { id: 'n1', text: `Welcome back, ${user?.name?.split(' ')[0] || 'there'}! Here's what's new.`, time: 'Just now', read: false }
    ]);
  }, [isAuthenticated, user]);

  const showToast = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Adds a new saved address (backend first, falls back to local state).
  const addAddress = useCallback(async (label, city) => {
    const result = await api.addAddress({ label, city });
    setAccount((prev) => {
      const newAddr = result
        ? { id: result._id || result.id, label: result.label, city: result.city }
        : { id: 'local-' + Date.now(), label, city };
      return { ...prev, addresses: [...prev.addresses, newAddr] };
    });
  }, []);

 //primary address is the first on the list
  const setPrimaryAddress = useCallback(async (addressId) => {
    await api.setPrimaryAddress(addressId);
    setAccount((prev) => {
      const chosen = prev.addresses.find((a) => a.id === addressId);
      if (!chosen) return prev;
      const rest = prev.addresses.filter((a) => a.id !== addressId);
      return { ...prev, addresses: [chosen, ...rest] };
    });
    setActiveAddressId(addressId);
  }, []);

  const value = {
    account,
    setAccount,
    activeAddressId,
    setActiveAddressId,
    addAddress,
    setPrimaryAddress,
    toasts,
    showToast,
    notifications,
    markAllNotificationsRead,
    theme,
    toggleTheme
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an <AppProvider>');
  return ctx;
}
