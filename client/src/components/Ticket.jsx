import React from 'react';

// The signature "manifest ticket" card reused across Dashboard, Schedule,
// Rewards, and Report — styled to look like a weigh-station / collection
// ticket, with a stamped status badge and a perforated divider.
export default function Ticket({ id, headline, stamp, stampVariant = 'green', meta = [], children }) {
  return (
    <div className="ticket">
      <div className="ticket-top">
        <div>
          {id && <span className="ticket-id mono">{id}</span>}
          <div className="ticket-headline">{headline}</div>
        </div>
        {stamp && <div className={`stamp stamp-${stampVariant}`}>{stamp}</div>}
      </div>

      {meta.length > 0 && (
        <>
          <div className="ticket-divider"></div>
          <div className="ticket-meta">
            {meta.map((m) => (
              <div key={m.k}>
                <span className="k">{m.k}</span>
                <span className="v">{m.v}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {children}
    </div>
  );
}
