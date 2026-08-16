import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { recyclingItems as fallbackItems } from '../data/mockData.js';

const CATEGORIES = ['All', 'Recycle', 'Compost', 'Trash', 'Hazardous'];
const BADGE_CLASS = { Recycle: 'badge-blue', Compost: 'badge-green', Trash: 'badge-grey', Hazardous: 'badge-red' };

export default function RecyclingGuide() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [items, setItems] = useState(fallbackItems);

  useEffect(() => {
    const handle = setTimeout(() => {
      api.searchRecycling(query, category).then((data) => {
        if (data) setItems(data);
      });
    }, 250);
    return () => clearTimeout(handle);
  }, [query, category]);

  const filtered = useMemo(() => {
    return items.filter(
      (item) => (category === 'All' || item.category === category) && item.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [items, query, category]);

  return (
    <section className="view active">
      <div className="view-header">
        <span className="eyebrow">Sorting help</span>
        <h1>Recycling guide</h1>
        <p className="view-sub">Search any item to see which bin it belongs in.</p>
      </div>

      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search an item — e.g. “pizza box” or “batteries”"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="chip-row">
        {CATEGORIES.map((c) => (
          <button key={c} className={'chip' + (category === c ? ' on' : '')} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No matches. Try a different word, or check the item&rsquo;s packaging for a local sorting symbol.</div>
      ) : (
        <div className="grid grid-auto">
          {filtered.map((item) => (
            <div className="item-card" key={item.name}>
              <div className="item-card-top">
                <div className="item-name">{item.name}</div>
                <span className={'badge ' + BADGE_CLASS[item.category]}>{item.category}</span>
              </div>
              <div className="item-note">{item.note}</div>
              {(item.diyVideoUrl || item.diyProductUrl) ? (
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {item.diyVideoUrl && (
                    <a className="btn btn-outline btn-sm" href={item.diyVideoUrl} target="_blank" rel="noreferrer">
                      Watch DIY idea
                    </a>
                  )}
                  {item.diyProductUrl && (
                    <a className="btn btn-outline btn-sm" href={item.diyProductUrl} target="_blank" rel="noreferrer">
                      Shop related product
                    </a>
                  )}
                </div>
              ) : (
                <div className="row-sub" style={{ marginTop: 10, fontStyle: 'italic' }}>DIY video &amp; product links coming soon</div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
