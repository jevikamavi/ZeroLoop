import React, { useState } from 'react';
import { api } from '../api/client.js';
import { useApp } from '../context/AppContext.jsx';

const TOGGLES = [
  { key: 'emailReminders', title: 'Email pickup reminders', sub: 'Sent the night before' },
  { key: 'smsAlerts', title: 'SMS pickup alerts', sub: 'Morning-of text alert' },
  { key: 'missedAlerts', title: 'Missed pickup alerts', sub: 'If a stop is skipped' },
  { key: 'productUpdates', title: 'Product updates', sub: 'Occasional feature news' }
];

export default function Account() {
  const { account, setAccount, addAddress, setPrimaryAddress, showToast } = useApp();
  const [profile, setProfile] = useState({ name: account.name, email: account.email, phone: account.phone });
  const [prefs, setPrefs] = useState(account.notificationPrefs);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', city: '' });

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.label.trim() || !newAddress.city.trim()) {
      showToast('Add both a label and a city');
      return;
    }
    await addAddress(newAddress.label, newAddress.city);
    setNewAddress({ label: '', city: '' });
    setShowAddressForm(false);
    showToast('Address added');
  };

  const handleSetPrimary = async (addressId) => {
    await setPrimaryAddress(addressId);
    showToast('Primary address updated');
  };

  const saveProfile = async () => {
    const updated = await api.updateAccount(profile);
    setAccount((prev) => ({ ...prev, ...profile }));
    showToast('Profile saved');
  };

  const toggle = (key) => setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const saveNotifications = async () => {
    await api.updateNotifications(prefs);
    setAccount((prev) => ({ ...prev, notificationPrefs: prefs }));
    showToast('Notification preferences saved');
  };

  const manageBilling = async () => {
    await api.getAccount();
    showToast('Billing portal would open here');
  };

  return (
    <section className="view active">
      <div className="view-header">
        <span className="eyebrow">Settings</span>
        <h1>Account</h1>
        <p className="view-sub">Manage your profile, plan, and notification preferences.</p>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3>Profile</h3>
          <div className="field">
            <label htmlFor="accName">Full name</label>
            <input type="text" id="accName" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="accEmail">Email</label>
            <input type="email" id="accEmail" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="accPhone">Phone</label>
            <input type="tel" id="accPhone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <button className="btn btn-dark" onClick={saveProfile}>Save changes</button>
        </div>

        <div className="card">
          <h3>Service plan</h3>
          <div className="row-between">
            <div>
              <div className="row-title">{account.planName || 'ZeroLoop Plus — Weekly'}</div>
              <div className="row-sub">Trash, recycling &amp; compost</div>
            </div>
            <span className="badge badge-green">Active</span>
          </div>
          <div className="row-between">
            <div>
              <div className="row-title">Next bill</div>
              <div className="row-sub">Due 1 Aug 2026</div>
            </div>
            <div className="row-title">₹450</div>
          </div>
        </div>

        <div className="card">
          <h3>Notifications</h3>
          {TOGGLES.map((t) => (
            <div className="row-between" key={t.key}>
              <div>
                <div className="row-title">{t.title}</div>
                <div className="row-sub">{t.sub}</div>
              </div>
              <button className={'toggle' + (prefs[t.key] ? ' on' : '')} onClick={() => toggle(t.key)} aria-label={t.title}></button>
            </div>
          ))}
          <button className="btn btn-dark" style={{ marginTop: 12 }} onClick={saveNotifications}>Save preferences</button>
        </div>

        <div className="card">
          <h3>Saved addresses</h3>
          {account.addresses.map((a, i) => (
            <div className="row-between" key={a.id}>
              <div>
                <div className="row-title">{a.label}</div>
                <div className="row-sub">{a.city}</div>
              </div>
              {i === 0 ? (
                <span className="badge badge-green">Primary</span>
              ) : (
                <button className="btn btn-outline btn-sm" onClick={() => handleSetPrimary(a.id)}>Set as primary</button>
              )}
            </div>
          ))}

          {showAddressForm ? (
            <form onSubmit={handleAddAddress} style={{ marginTop: 14 }}>
              <div className="field">
                <label htmlFor="newAddrLabel">Address</label>
                <input
                  type="text"
                  id="newAddrLabel"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  placeholder="e.g. C-45, Vasant Kunj"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="newAddrCity">City</label>
                <input
                  type="text"
                  id="newAddrCity"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  placeholder="New Delhi"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-dark btn-sm">Save address</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddressForm(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={() => setShowAddressForm(true)}>
              + Add a new address
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
