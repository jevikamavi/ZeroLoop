import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', address: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!form.name.trim() || !form.email.trim() || !form.password) {
        setError('Please fill in your name, email and password.');
        return;
      }
      if (form.password.length < 6) {
        setError('Password should be at least 6 characters.');
        return;
      }
      if (form.password !== form.confirm) {
        setError('Passwords do not match.');
        return;
      }
      setSubmitting(true);
      const result = await register(form.name.trim(), form.email.trim(), form.password, form.address.trim());
      setSubmitting(false);
      if (!result.ok) setError(result.message);
      return;
    }

    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    const result = await login(form.email.trim(), form.password);
    setSubmitting(false);
    if (!result.ok) setError(result.message);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <img src="/logo.png" alt="ZeroLoop logo" className="brand-mark" />
          <div>
            <strong>ZeroLoop</strong>
            <span>Completing the loop with sustainability</span>
          </div>
        </div>

        <div className="auth-toggle">
          <button type="button" className={mode === 'login' ? 'on' : ''} onClick={() => switchMode('login')}>
            Log in
          </button>
          <button type="button" className={mode === 'register' ? 'on' : ''} onClick={() => switchMode('register')}>
            Create account
          </button>
        </div>

        <h1 style={{ fontSize: 22, marginTop: 18 }}>{mode === 'login' ? 'Welcome back' : 'Join ZeroLoop'}</h1>
        <p className="view-sub" style={{ marginBottom: 18 }}>
          {mode === 'login'
            ? 'Log in to see your pickups, rewards, and reports.'
            : 'Set up your account for waste pickups across Delhi.'}
        </p>

        <form onSubmit={submit}>
          {mode === 'register' && (
            <div className="field">
              <label htmlFor="authName">Full name</label>
              <input type="text" id="authName" value={form.name} onChange={update('name')} placeholder="e.g. Jevika Mavi" autoComplete="name" required />
            </div>
          )}

          <div className="field">
            <label htmlFor="authEmail">Email</label>
            <input type="email" id="authEmail" value={form.email} onChange={update('email')} placeholder="you@example.com" autoComplete="email" required />
          </div>

          <div className="field">
            <label htmlFor="authPassword">Password</label>
            <input
              type="password"
              id="authPassword"
              value={form.password}
              onChange={update('password')}
              placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              required
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="field">
                <label htmlFor="authConfirm">Confirm password</label>
                <input type="password" id="authConfirm" value={form.confirm} onChange={update('confirm')} autoComplete="new-password" required />
              </div>
              <div className="field">
                <label htmlFor="authAddress">Address (optional)</label>
                <input
                  type="text"
                  id="authAddress"
                  value={form.address}
                  onChange={update('address')}
                  placeholder="e.g. A-142, Hauz Khas Enclave"
                />
              </div>
            </>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? (
            <>
              New to ZeroLoop?{' '}
              <button type="button" onClick={() => switchMode('register')}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('login')}>
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
