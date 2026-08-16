import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useApp } from '../context/AppContext.jsx';
import { marketplaceItems as fallbackItems } from '../data/mockData.js';

const CATEGORIES = ['All', 'Compost', 'Upcycled', 'Plants', 'Repair Services', 'Other'];
const BADGE_CLASS = {
  Compost: 'badge-green',
  Upcycled: 'badge-blue',
  Plants: 'badge-green',
  'Repair Services': 'badge-amber',
  Other: 'badge-grey'
};

function priceLabel(item) {
  if (item.priceType === 'free') return 'Free';
  if (item.priceType === 'points') return `${item.price.toLocaleString('en-IN')} pts`;
  return `₹${item.price.toLocaleString('en-IN')}`;
}

const EMPTY_FORM = { name: '', description: '', category: 'Compost', priceType: 'inr', price: '', seller: '' };

export default function Marketplace() {
  const { account, showToast } = useApp();
  const [category, setCategory] = useState('All');
  const [items, setItems] = useState(fallbackItems);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.getMarketplaceItems(category).then((data) => {
      if (data) setItems(data);
    });
  }, [category]);

  const filtered = category === 'All' ? items : items.filter((i) => i.category === category);

  const submitListing = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Give your listing a name');
      return;
    }
    const payload = { ...form, price: form.priceType === 'free' ? 0 : Number(form.price) || 0, seller: form.seller || account.name };
    const created = await api.createMarketplaceItem(payload);
    setItems((prev) => [created || { ...payload, _id: 'local-' + Date.now() }, ...prev]);
    setForm(EMPTY_FORM);
    setShowForm(false);
    showToast('Listing published to the Eco Marketplace');
  };

  return (
    <section className="view active">
      <div className="view-header">
        <span className="eyebrow">Community</span>
        <h1>Eco Marketplace</h1>
        <p className="view-sub">Buy, sell, or give away compost, upcycled goods, plants, and repair services with neighbours in your zone.</p>
      </div>

      <div className="chip-row">
        {CATEGORIES.map((c) => (
          <button key={c} className={'chip' + (category === c ? ' on' : '')} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
        <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : 'List an item'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <h3>List an item or service</h3>
          <form onSubmit={submitListing}>
            <div className="grid grid-2">
              <div className="field">
                <label htmlFor="mpName">Item or service name</label>
                <input type="text" id="mpName" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Upcycled glass jars" required />
              </div>
              <div className="field">
                <label htmlFor="mpCategory">Category</label>
                <select id="mpCategory" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="mpPriceType">Price type</label>
                <select id="mpPriceType" value={form.priceType} onChange={(e) => setForm({ ...form, priceType: e.target.value })}>
                  <option value="inr">Rupees (₹)</option>
                  <option value="points">EcoPoints</option>
                  <option value="free">Free</option>
                </select>
              </div>
              {form.priceType !== 'free' && (
                <div className="field">
                  <label htmlFor="mpPrice">{form.priceType === 'points' ? 'Points' : 'Price (₹)'}</label>
                  <input type="text" id="mpPrice" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" />
                </div>
              )}
            </div>
            <div className="field">
              <label htmlFor="mpDesc">Description</label>
              <textarea id="mpDesc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What are you offering?" />
            </div>
            <button type="submit" className="btn btn-dark">Publish listing</button>
          </form>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">No listings in this category yet — be the first to add one.</div>
      ) : (
        <div className="grid grid-auto">
          {filtered.map((item) => (
            <div className="item-card" key={item._id || item.name}>
              <div className="item-card-top">
                <div className="item-name">{item.name}</div>
                <span className={'badge ' + (BADGE_CLASS[item.category] || 'badge-grey')}>{item.category}</span>
              </div>
              <div className="item-note">{item.description}</div>
              <div className="row-between" style={{ border: 'none', padding: '10px 0 0' }}>
                <div className="row-sub">{item.seller}</div>
                <div className="row-title mono">{priceLabel(item)}</div>
              </div>
              <button className="btn btn-outline btn-sm btn-block" style={{ marginTop: 10 }} onClick={() => showToast('Message sent to ' + item.seller)}>
                Contact seller
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
