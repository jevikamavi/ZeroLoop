import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useApp } from '../context/AppContext.jsx';
import { greenServices as fallbackServices } from '../data/mockData.js';

const CATEGORIES = ['All', 'Solar', 'E-Waste', 'Composting', 'Water', 'EV Charging', 'Plantation'];

export default function GreenServices() {
  const { showToast } = useApp();
  const [category, setCategory] = useState('All');
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    api.getGreenServices(category).then((data) => {
      if (data) setServices(data);
    });
  }, [category]);

  const filtered = category === 'All' ? services : services.filter((s) => s.category === category);

  return (
    <section className="view active">
      <div className="view-header">
        <span className="eyebrow">Community</span>
        <h1>Green Services</h1>
        <p className="view-sub">Curated, verified sustainability services around your zone — solar, e-waste pickup, composting, water harvesting, and more.</p>
      </div>

      <div className="chip-row">
        {CATEGORIES.map((c) => (
          <button key={c} className={'chip' + (category === c ? ' on' : '')} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No services listed in this category yet.</div>
      ) : (
        <div className="grid grid-auto">
          {filtered.map((s) => (
            <div className="item-card" key={s._id || s.name}>
              <div className="item-card-top">
                <div className="item-name">{s.name}</div>
                <span className="badge badge-blue">{s.category}</span>
              </div>
              <div className="item-note">{s.description}</div>
              <div className="row-sub" style={{ marginTop: 10 }}>{s.provider} · {s.area}</div>
              <button className="btn btn-outline btn-sm btn-block" style={{ marginTop: 10 }} onClick={() => showToast(s.contact)}>
                Get in touch
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
