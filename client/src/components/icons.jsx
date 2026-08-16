// Small line-icon set built from plain SVG primitives (no external icon
// library) so the whole app has zero icon-font/asset dependencies.
import React from 'react';

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function IconDashboard({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M4 11 L12 4 L20 11" /><path d="M6 10 V20 H18 V10" /><path d="M10 20v-6h4v6" />
    </svg>
  );
}
export function IconSchedule({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <rect x="4" y="6" width="16" height="14" rx="2" /><line x1="4" y1="11" x2="20" y2="11" />
      <line x1="8" y1="4" x2="8" y2="8" /><line x1="16" y1="4" x2="16" y2="8" />
    </svg>
  );
}
export function IconTruck({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <rect x="2" y="10" width="11" height="7" /><path d="M13 12h4l3 3v2h-7z" />
      <circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}
export function IconRecycle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M12 3 L14 8 L9 8 Z" /><path d="M12 21 L10 16 L15 16 Z" />
      <path d="M4 15 L8 12 L6 8 Z" /><path d="M20 9 L16 12 L18 16 Z" />
    </svg>
  );
}
export function IconStar({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <polygon points="12,3 14.7,9.3 21.5,9.9 16.3,14.3 17.9,21 12,17.3 6.1,21 7.7,14.3 2.5,9.9 9.3,9.3" />
    </svg>
  );
}
export function IconFlag({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <line x1="5" y1="3" x2="5" y2="21" /><path d="M5 4 h13 l-3 4 l3 4 h-13" />
    </svg>
  );
}
export function IconUser({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="8" r="3.4" /><path d="M4.5 20c0-4.2 3.4-6.6 7.5-6.6s7.5 2.4 7.5 6.6" />
    </svg>
  );
}
export function IconMapPin({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}
export function IconBell({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M6 10a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
export function IconShop({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M4 9 L5 4 h14 l1 5" /><path d="M4 9 v11 h16 V9" /><path d="M4 9 a3 3 0 0 0 6 0 a3 3 0 0 0 6 0 a3 3 0 0 0 4 0" />
      <path d="M9 20 v-6 h6 v6" />
    </svg>
  );
}
export function IconSun({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
    </svg>
  );
}
export function IconMoon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z" />
    </svg>
  );
}
export function IconChat({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M4 5h16v11H8l-4 4z" />
    </svg>
  );
}
export function IconSend({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M4 12 L20 4 L14 20 L11 13 Z" />
    </svg>
  );
}
export function IconClose({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}
export function IconLeaf({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <path d="M5 19c0-8 4-14 14-14 0 10-6 14-14 14z" /><path d="M6 18c3-3 6-6 12-12" />
    </svg>
  );
}
export function IconUpload({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M21 17l-5-5-4 4-3-3-5 5" />
    </svg>
  );
}
