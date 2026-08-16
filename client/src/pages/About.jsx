import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const PILLARS = [
  {
    title: 'Less waste, right from home',
    body: 'Good waste management starts with small things at home. We make it easier to sort your trash, recycling, and compost so more of what you throw away can actually be put to good use.'
  },
  {
    title: 'Give useful things a second life',
    body: 'Not everything that is old or unwanted needs to become waste. Through the Eco Marketplace, you can find, share, swap, repair, or pass on things that still have plenty of life left in them.'
  },
  {
    title: 'Keep e-waste out of regular bins',
    body: 'Old phones, batteries, electronics, and other hazardous items need to be handled differently. ZeroLoop helps you find the right authorised collection points so they do not end up where they should not.'
  },
  {
    title: 'Find greener choices nearby',
    body: 'Want to explore solar, composting, repairs, or other sustainable services? ZeroLoop brings useful local options together so you do not have to search everywhere yourself.'
  },
  {
    title: 'Make good habits feel rewarding',
    body: 'Every small action counts. EcoPoints recognise the things you already do and turn those actions into useful rewards.'
  }
];

const STEPS = [
  {
    n: '01',
    title: 'Sort it right',
    body: 'Not sure where something goes? Use the Recycling Guide to find the right bin and build better sorting habits.'
  },
  {
    n: '02',
    title: 'Put pickups on autopilot',
    body: 'Follow your regular weekly pickup schedule, and request an extra pickup whenever you need one.'
  },
  {
    n: '03',
    title: 'See what you are doing',
    body: 'Your Dashboard keeps your pickups, activity, and EcoPoints together so you can see your progress at a glance.'
  },
  {
    n: '04',
    title: 'Keep the good going',
    body: 'Use your EcoPoints, discover local green services, and give useful things a second life through the Eco Marketplace.'
  }
];

export default function About() {
  const { account } = useApp();

  return (
    <section className="view active">
      <div className="view-header">

        <span className="eyebrow">About ZeroLoop</span>

        {/* ZeroLoop Logo */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            marginBottom: 20
          }}
        >
          <img
            src="/logo.png"
            alt="ZeroLoop logo"
            style={{
              width: 200,
              height: 'auto',
              display: 'block'
            }}
          />
        </div>



        <h1>A cleaner neighbourhood starts with small choices</h1>

        <p className="view-sub">
          <b>ZeroLoop</b> refers to completing the <b>"loop of sustainability"</b>.
          ZeroLoop is here to make everyday waste management a little easier and
          get you <b>sustainable solutions</b>. From sorting your bins to finding
          better ways to reuse, repair, and recycle, we help turn small household
          habits into a cleaner, healthier community.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <h3>Why we built ZeroLoop</h3>

        <p
          style={{
            fontSize: 13.5,
            color: 'var(--ink-soft)',
            lineHeight: 1.6,
            margin: 0
          }}
        >
          Sustainability and waste management can feel like a problem that is too big for one person to fix.
          But most of it comes down to small decisions we make every day like
          which bin something goes into, whether we repair or replace
          something, and do we take the time to find a better way to dispose
          of something that is no longer useful, or how we get electricity in our homes.

          <br />
          <br />

          ZeroLoop is designed to make those decisions easier. We bring
          pickups, recycling guidance, local green services, rewards, and
          community sharing into one place — so doing the right thing does not
          have to feel complicated.
        </p>

        {account.points > 0 && (
          <div className="row-sub" style={{ marginTop: 12 }}>
            You have already earned{' '}
            <strong>{account.points.toLocaleString('en-IN')} EcoPoints</strong>.
            That's {account.points.toLocaleString('en-IN')} small actions
            that add up to something bigger.
          </div>
        )}
      </div>

      <div className="grid grid-auto" style={{ marginBottom: 18 }}>
        {PILLARS.map((p) => (
          <div className="card" key={p.title}>
            <h3>{p.title}</h3>

            <p
              style={{
                fontSize: 13,
                color: 'var(--ink-soft)',
                lineHeight: 1.55,
                margin: 0
              }}
            >
              {p.body}
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>How ZeroLoop fits into your day</h3>

        <div className="grid grid-2" style={{ marginTop: 8 }}>
          {STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                display: 'flex',
                gap: 12
              }}
            >
              <span
                className="mono"
                style={{
                  color: 'var(--bin-green)',
                  fontWeight: 700,
                  fontSize: 14
                }}
              >
                {s.n}
              </span>

              <div>
                <div className="row-title">{s.title}</div>
                <div className="row-sub">{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <Link className="btn btn-dark" to="/">
          Back to Dashboard
        </Link>

        <Link className="btn btn-outline" to="/rewards">
          See your EcoPoints
        </Link>
      </div>
    </section>
  );
}