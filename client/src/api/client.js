import { getToken } from '../utils/authStorage.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      ...options
    });
    if (res.status === 401) {
      // session expired / not logged in — tell the app so it can send
      // the resident back to the login screen instead of a broken page
      window.dispatchEvent(new Event('zeroloop-auth-expired'));
      return null;
    }
    if (!res.ok) throw new Error(`API ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[ZeroLoop API]', path, err.message);
    return null;
  }
}

// Auth calls need the server's actual error message ("Incorrect email or
// password", "Account already exists" etc.) shown to the user, so they
// get their own small helper instead of request()'s silent-null pattern.
async function authRequest(path, body) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, message: data.message || 'Something went wrong. Please try again.' };
    }
    return { ok: true, token: data.token, user: data.user };
  } catch (err) {
    console.warn('[ZeroLoop API]', path, err.message);
    return { ok: false, message: "Can't reach the server right now. Please try again in a moment." };
  }
}

export const api = {
  // auth
  register: (payload) => authRequest('/auth/register', payload),
  login: (payload) => authRequest('/auth/login', payload),
  me: () => request('/auth/me'),

  // pick ups & schedule
  getUpcomingPickups: () => request('/pickups/upcoming'),
  requestExtraPickup: (payload) => request('/pickups/extra', { method: 'POST', body: JSON.stringify(payload) }),
  getRecurringSchedule: () => request('/pickups/recurring'),
  saveRecurringSchedule: (payload) => request('/pickups/recurring', { method: 'PUT', body: JSON.stringify(payload) }),

  // Recycling guide
  searchRecycling: (q, category) =>
    request(`/recycling?q=${encodeURIComponent(q || '')}&category=${encodeURIComponent(category || 'All')}`),

  // reports
  getReports: () => request('/reports'),
  createReport: (payload) => request('/reports', { method: 'POST', body: JSON.stringify(payload) }),

  //reward
  getRewards: () => request('/rewards'),
  redeemReward: (rewardId) => request('/rewards/redeem', { method: 'POST', body: JSON.stringify({ rewardId }) }),

  // Account
  getAccount: () => request('/account'),
  updateAccount: (payload) => request('/account', { method: 'PUT', body: JSON.stringify(payload) }),
  updateNotifications: (payload) => request('/account/notifications', { method: 'PUT', body: JSON.stringify(payload) }),
  addAddress: (payload) => request('/account/addresses', { method: 'POST', body: JSON.stringify(payload) }),
  setPrimaryAddress: (addressId) => request(`/account/addresses/${addressId}/primary`, { method: 'PUT' }),
  getRecentActivity: () => request('/account/activity'),

  // Eco marketplace
  getMarketplaceItems: (category) => request(`/marketplace?category=${encodeURIComponent(category || 'All')}`),
  createMarketplaceItem: (payload) => request('/marketplace', { method: 'POST', body: JSON.stringify(payload) }),

  //green services 
  getGreenServices: (category) => request(`/green-services?category=${encodeURIComponent(category || 'All')}`),

  //  assistant chatbot
  askAssistant: (message, history) => request('/chat', { method: 'POST', body: JSON.stringify({ message, history }) })
};
