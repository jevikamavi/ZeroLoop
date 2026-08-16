import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useApp } from '../context/AppContext.jsx';
import { rewardsCatalog as fallbackCatalog, impactByMonth } from '../data/mockData.js';

export default function Rewards() {
  const { account, setAccount, showToast } = useApp();
  const [catalog, setCatalog] = useState(fallbackCatalog);

  useEffect(() => {
    api.getRewards().then((data) => {
      if (data) {
        setCatalog(data.catalog);
        setAccount((prev) => ({ ...prev, points: data.points }));
      }
    });
  }, []);

  const redeem = async (reward) => {
    if (account.points < reward.cost) return;
    const result = await api.redeemReward(reward.id);
    setAccount((prev) => ({ ...prev, points: result?.points ?? prev.points - reward.cost }));
    showToast('Redeemed: ' + reward.name);
  };

  const maxImpact = Math.max(...impactByMonth.map((x) => x.v));

  return (
    <section className="view active">
      <div className="view-header">
        <span className="eyebrow">EcoPoints</span>
        <h1>Rewards &amp; impact</h1>
        <p className="view-sub">Earn points automatically for on-time sorting and low-contamination recycling.</p>
      </div>

      <div className="ticket points-ticket">
        <div>
          <span className="ticket-id mono">MEMBER SINCE MAR 2023</span>
          <div className="points-num">{account.points.toLocaleString('en-IN')}</div>
          <div className="row-sub">EcoPoints available</div>
        </div>
        <div className="stamp stamp-amber">14 wk streak</div>
      </div>

      <div className="grid grid-3" style={{ marginTop: 18 }}>
        <div className="card">
          <div className="card-label">Waste diverted</div>
          <div className="stat-num">1,470 kg</div>
        </div>
        <div className="card">
          <div className="card-label">CO₂ avoided</div>
          <div className="stat-num">1.6 tonnes</div>
        </div>
        <div className="card">
          <div className="card-label">Diverted by month</div>
          <div className="bars">
            {impactByMonth.map((x) => (
              <div className="bar-col" key={x.m}>
                <div className="bar" style={{ height: `${(x.v / maxImpact) * 100}%` }}></div>
                <div className="bar-label">{x.m}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 style={{ margin: '24px 0 12px' }}>Redeem points</h3>
      <div className="grid grid-auto">
        {catalog.map((r) => {
          const canAfford = account.points >= r.cost;
          return (
            <div className="card reward-card" key={r.id || r.name}>
              <div className="card-label">Reward</div>
              <h3>{r.name}</h3>
              <div className="row-title mono">{r.cost.toLocaleString('en-IN')} pts</div>
              <button className={'btn btn-sm ' + (canAfford ? 'btn-primary' : 'btn-outline')} disabled={!canAfford} onClick={() => redeem(r)}>
                {canAfford ? 'Redeem' : 'Not enough points'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
