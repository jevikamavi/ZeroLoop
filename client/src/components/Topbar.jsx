import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { IconMapPin, IconBell, IconSun, IconMoon } from './icons.jsx';

export default function Topbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    account,
    activeAddressId,
    setActiveAddressId,
    notifications,
    markAllNotificationsRead,
    theme,
    toggleTheme,
    showToast
  } = useApp();

  const [openMenu, setOpenMenu] = useState(null);

  const initials = account.name
    ? account.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleMenu = (menu) => setOpenMenu((prev) => (prev === menu ? null : menu));
  const closeMenus = () => setOpenMenu(null);

  const openNotifications = () => {
    toggleMenu('notifications');
  };

  const goToAccount = () => {
    closeMenus();
    navigate('/account');
  };

  const signOut = () => {
    closeMenus();
    showToast('Signed out — see you next time!');
    logout();
  };

  return (
    <div className="topbar">
      <div className="address-select">
        <IconMapPin className="ic-sm" />
        <select
          aria-label="Select service address"
          value={activeAddressId}
          onChange={(e) => setActiveAddressId(e.target.value)}
        >
          {account.addresses.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label} — {a.city}
            </option>
          ))}
        </select>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" aria-label="Toggle dark mode" onClick={toggleTheme}>
          {theme === 'dark' ? <IconSun className="ic-sm" /> : <IconMoon className="ic-sm" />}
        </button>

        <div style={{ position: 'relative' }}>
          <button className="icon-btn" aria-label="Notifications" onClick={openNotifications}>
            <IconBell className="ic-sm" />
            {unreadCount > 0 && <span className="dot-flag"></span>}
          </button>
          {openMenu === 'notifications' && (
            <>
              <div className="dropdown-backdrop" onClick={closeMenus}></div>
              <div className="dropdown-panel">
                <div className="dropdown-header">
                  <span>Notifications</span>
                  <button className="dropdown-link" onClick={markAllNotificationsRead}>Mark all as read</button>
                </div>
                {notifications.map((n) => (
                  <div className="dropdown-item" key={n.id}>
                    <span className="activity-dot" style={{ background: n.read ? 'var(--concrete)' : 'var(--bin-green)' }}></span>
                    <div>
                      <div className="activity-text">{n.text}</div>
                      <div className="activity-time">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button className="avatar" style={{ border: 'none' }} onClick={() => toggleMenu('user')} aria-label="Account menu">
            {initials}
          </button>
          {openMenu === 'user' && (
            <>
              <div className="dropdown-backdrop" onClick={closeMenus}></div>
              <div className="dropdown-panel" style={{ right: 0, left: 'auto', minWidth: 220 }}>
                <div className="dropdown-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                  <span className="row-title">{account.name}</span>
                  <span className="row-sub">{account.email}</span>
                </div>
                <button className="dropdown-item dropdown-item-button" onClick={goToAccount}>Account settings</button>
                <button className="dropdown-item dropdown-item-button" onClick={signOut}>Sign out</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
