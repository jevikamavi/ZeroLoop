import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useApp } from '../context/AppContext.jsx';
import { defaultRecurring, defaultUpcoming } from '../data/mockData.js';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SCHEDULE_ROWS = [
  { key: 'trash', label: 'Trash — every week' },
  { key: 'recycle', label: 'Recycling — every other week' },
  { key: 'compost', label: 'Compost — every week' }
];

export default function Schedule() {
  const { showToast } = useApp();
  const [recurring, setRecurring] = useState(defaultRecurring);
  const [upcoming, setUpcoming] = useState(defaultUpcoming);
  const [form, setForm] = useState({ bulk: true, yard: false, extraTrash: false, date: '', notes: '' });

  useEffect(() => {
    api.getRecurringSchedule().then((data) => {
      if (data && data.length) {
        const next = {};
        data.forEach((d) => { next[d.wasteType] = d.days; });
        setRecurring((prev) => ({ ...prev, ...next }));
      }
    });
    api.getUpcomingPickups().then((data) => {
      if (data && data.length) {
        setUpcoming(
          data.map((p) => ({
            date: new Date(p.date).toDateString(),
            type: p.type,
            sub: `${p.route || 'Route 12'} · ${p.ticketId}`,
            status: p.status === 'scheduled' ? 'green' : 'grey'
          }))
        );
      }
    });
  }, []);

  const toggleDay = (wasteType, day) => {
    setRecurring((prev) => {
      const has = prev[wasteType]?.includes(day);
      const days = has ? prev[wasteType].filter((d) => d !== day) : [...(prev[wasteType] || []), day];
      return { ...prev, [wasteType]: days };
    });
  };

  const saveSchedule = async () => {
    await api.saveRecurringSchedule(recurring);
    showToast('Recurring schedule saved');
  };

  const submitExtra = async (e) => {
    e.preventDefault();
    const types = [form.bulk && 'Bulk Items', form.yard && 'Yard Waste', form.extraTrash && 'Extra Trash'].filter(Boolean);
    if (!form.date || types.length === 0) {
      showToast('Pick a date and at least one item type');
      return;
    }
    const result = await api.requestExtraPickup({ types, date: form.date, notes: form.notes });
    const ticketId = result?.ticketId || `ZL-${Math.floor(40000 + Math.random() * 9000)}-X`;
    setUpcoming((prev) => [
      { date: new Date(form.date).toDateString(), type: types.join(' + '), sub: `Route 12 · ${ticketId}`, status: 'green' },
      ...prev
    ]);
    setForm({ bulk: true, yard: false, extraTrash: false, date: '', notes: '' });
    showToast(`Extra pickup requested — ticket ${ticketId}`);
  };

  return (
    <section className="view active">
      <div className="view-header">
        <span className="eyebrow">Service schedule</span>
        <h1>Schedule &amp; pickups</h1>
        <p className="view-sub">Manage your recurring collection days and request one-off pickups.</p>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3>Recurring schedule</h3>
          {SCHEDULE_ROWS.map((row) => (
            <div key={row.key} style={{ marginBottom: 16 }}>
              <div className="card-label" style={{ marginBottom: 8 }}>{row.label}</div>
              <div className="day-picker">
                {DAY_LABELS.map((label, idx) => {
                  const day = DAY_NAMES[idx];
                  const on = recurring[row.key]?.includes(day);
                  return (
                    <button type="button" key={idx} className={'day-chip' + (on ? ' on' : '')} onClick={() => toggleDay(row.key, day)}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <button className="btn btn-dark" style={{ marginTop: 4 }} onClick={saveSchedule}>Save schedule</button>
        </div>

        <div className="card">
          <h3>Request an extra pickup</h3>
          <form onSubmit={submitExtra}>
            <div className="field">
              <label>What needs picking up?</label>
              <div className="checkline">
                <input type="checkbox" checked={form.bulk} onChange={(e) => setForm({ ...form, bulk: e.target.checked })} /> Bulk items (furniture, appliances)
              </div>
              <div className="checkline">
                <input type="checkbox" checked={form.yard} onChange={(e) => setForm({ ...form, yard: e.target.checked })} /> Yard waste
              </div>
              <div className="checkline">
                <input type="checkbox" checked={form.extraTrash} onChange={(e) => setForm({ ...form, extraTrash: e.target.checked })} /> Extra trash bags
              </div>
            </div>
            <div className="field">
              <label htmlFor="extraDate">Preferred date</label>
              <input
                type="date"
                id="extraDate"
                min={new Date().toISOString().split('T')[0]}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="extraNotes">Notes for the crew (optional)</label>
              <textarea
                id="extraNotes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. Items are on the curb behind the mailbox"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Request pickup</button>
          </form>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Upcoming pickups</h3>
        {upcoming.map((p, idx) => (
          <div className="mini-ticket" key={idx}>
            <div className="mt-left">
              <div className="mt-date mono">{(p.date || '').slice(4, 10)}</div>
              <div>
                <div className="mt-type">{p.type}</div>
                <div className="mt-sub">{p.sub}</div>
              </div>
            </div>
            <span className={'badge badge-' + (p.status === 'green' ? 'green' : 'grey')}>
              {p.status === 'green' ? 'Confirmed' : 'Upcoming'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
