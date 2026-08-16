import React, { useEffect, useRef, useState } from 'react';
import { api } from '../api/client.js';
import { useApp } from '../context/AppContext.jsx';
import { IconUpload } from '../components/icons.jsx';

const ISSUE_TYPES = ['Missed pickup', 'Damaged bin', 'Illegal dumping', 'Billing question', 'Other'];

export default function Report() {
  const { account, showToast } = useApp();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('No file selected');
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ type: '', address: account.addresses[0]?.id || '', date: '', description: '' });

  useEffect(() => {
    api.getReports().then((data) => {
      if (data) setReports(data.map((r) => ({ id: r.ticketId, type: r.type, date: new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) })));
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.description.trim()) {
      showToast('Please add an issue type and description');
      return;
    }
    const result = await api.createReport(form);
    const ticketId = result?.ticketId || `RPT-${Math.floor(1000 + Math.random() * 9000)}`;
    setReports((prev) => [{ id: ticketId, type: form.type, date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }, ...prev]);
    setForm({ type: '', address: account.addresses[0]?.id || '', date: '', description: '' });
    setFileName('No file selected');
    showToast('Report submitted — ticket ' + ticketId);
  };

  return (
    <section className="view active">
      <div className="view-header">
        <span className="eyebrow">Support</span>
        <h1>Report an issue</h1>
        <p className="view-sub">Missed pickup, a damaged bin, or something else — let your crew know.</p>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="issueType">Issue type</label>
              <select id="issueType" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required>
                <option value="">Select an issue…</option>
                {ISSUE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="issueAddress">Address</label>
              <select id="issueAddress" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}>
                {account.addresses.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="issueDate">Date it happened</label>
              <input type="date" id="issueDate" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="issueDesc">Description</label>
              <textarea
                id="issueDesc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Tell us what happened"
                required
              />
            </div>
            <div className="field">
              <label>Photo (optional)</label>
              <div className="file-drop">
                <IconUpload className="ic-sm" />
                <span>{fileName}</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => setFileName(e.target.files[0] ? e.target.files[0].name : 'No file selected')}
                />
                <button type="button" className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }} onClick={() => fileInputRef.current.click()}>
                  Choose file
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Submit report</button>
          </form>
        </div>

        <div className="card">
          <h3>Past reports</h3>
          {reports.length === 0 ? (
            <p className="row-sub">No reports yet.</p>
          ) : (
            reports.map((r, idx) => (
              <div className="mini-ticket" key={idx}>
                <div className="mt-left">
                  <div>
                    <div className="mt-type">{r.type}</div>
                    <div className="mt-sub">{r.id} · Filed {r.date}</div>
                  </div>
                </div>
                <span className="badge badge-amber">Submitted</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
