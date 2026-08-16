import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { IconDashboard, IconSchedule, IconRecycle, IconStar, IconShop, IconLeaf, IconFlag, IconUser } from './icons.jsx';

const navGroups = [
  {
    label: 'Service',
    items: [
      { to: '/', label: 'Dashboard', icon: IconDashboard, end: true },
      { to: '/schedule', label: 'Schedule', icon: IconSchedule },
      { to: '/track', label: 'Green spots near you', icon: IconLeaf }
    ]
  },
  {
    label: 'Learn & earn',
    items: [
      { to: '/guide', label: 'Recycling guide', icon: IconRecycle },
      { to: '/rewards', label: 'Rewards', icon: IconStar }
    ]
  },
  {
    label: 'Community',
    items: [
      { to: '/marketplace', label: 'Eco Marketplace', icon: IconShop },
      { to: '/green-services', label: 'Green Services', icon: IconLeaf }
    ]
  },
  {
    label: 'Support',
    items: [
      { to: '/report', label: 'Report an issue', icon: IconFlag },
      { to: '/account', label: 'Account', icon: IconUser }
    ]
  }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/about" className="brand">
        <img src="/logo.png" alt="ZeroLoop logo" className="brand-mark" />
        <div className="brand-text">
          <strong>ZeroLoop</strong>
          <span>Completing the loop with sustainability</span>
        </div>
      </Link>

      {navGroups.map((group) => (
        <div key={group.label}>
          <div className="nav-group-label">{group.label}</div>
          {group.items.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
              <Icon className="ic" />
              {label}
              {badge && <span className="nav-badge">{badge}</span>}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sidebar-foot">
        ROUTE 12 — HAUZ KHAS ZONE
        <br />
        SERVICE ID ZL-48213
      </div>
    </aside>
  );
}
