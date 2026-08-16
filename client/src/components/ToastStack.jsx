import React from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function ToastStack() {
  const { toasts } = useApp();
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          <span className="dot"></span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
