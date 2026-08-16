import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useApp } from '../context/AppContext.jsx';
import Ticket from '../components/Ticket.jsx';
import { useGreenSpotLocation } from '../hooks/useGreenSpotLocation.js';
import GreenSpaceMap from '../components/GreenSpaceMap.jsx';

const GAUGES = [
  { key: 'trash', label: 'Trash bin', color: 'var(--ink-soft)' },
  { key: 'recycle', label: 'Recycling', color: 'var(--route-blue)' },
  { key: 'compost', label: 'Compost', color: 'var(--bin-green)' }
];

function formatPickupDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

export default function Dashboard() {
  const { account } = useApp();

  const [bins] = useState({
    trash: 62,
    recycle: 38,
    compost: 81
  });

  const [activity, setActivity] = useState(null);
  const [upcomingPickups, setUpcomingPickups] = useState([]);

  const {
    status: locStatus,
    coords
  } = useGreenSpotLocation();

  useEffect(() => {
    api.getRecentActivity().then((data) => {
      setActivity(data || []);
    });

    api.getUpcomingPickups().then((data) => {
      setUpcomingPickups(data || []);
    });
  }, []);

  const primaryAddress =
    account?.addresses?.[0]?.label ||
    'No address on file yet';

  const firstName =
    account?.name
      ? account.name.split(' ')[0]
      : 'there';

  return (
    <section className="view active">

      {/*_____________________ HEADER ___________________________ */}

      <div className="view-header">
        <span className="eyebrow">Today</span>

        <h1>
          Good afternoon, {firstName}
        </h1>

        <p className="view-sub">
          Here&rsquo;s what&rsquo;s happening with your service this week.
        </p>
      </div>


      {/*_____________________ PICKUP + GREEN SPOTS ___________________________ */}

      <div
        className="grid"
        style={{
          gridTemplateColumns: '1.5fr 1fr'
        }}
      >

        {/* PICKUP TICKET */}

        <Ticket
          id={
            upcomingPickups.length > 0
              ? `TICKET ${upcomingPickups[0].ticketId}`
              : 'NO UPCOMING PICKUP'
          }
          headline={
            upcomingPickups.length > 0
              ? `Next pickup — ${formatPickupDate(upcomingPickups[0].date)}`
              : 'No upcoming pickup'
          }
          stamp="Scheduled"
          meta={[
            {
              k: 'Collecting',
              v: upcomingPickups[0]?.type || '—'
            },
            {
              k: 'Route',
              v: upcomingPickups[0]?.route || 'Route 12 — Hauz Khas Zone'
            },
            {
              k: 'Window',
              v: '7:00 – 10:00 AM'
            },
            {
              k: 'Address',
              v: primaryAddress
            }
          ]}
        >
          <div className="quick-actions">
            <Link
              className="btn btn-outline"
              to="/schedule"
            >
              Reschedule
            </Link>
          </div>
        </Ticket>


        {/* __________GREEN SPACES _______________*/}

        <div
          className="card"
          style={{
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >

          <div
            style={{
              padding: '16px 16px 0'
            }}
          >
            <h3 style={{ marginBottom: 2 }}>
              Green spots near you
            </h3>

            <div className="row-sub">
              Parks and green spaces within 20 km
            </div>
          </div>


          {!coords ? (
            <div
              className="map-preview"
              style={{
                margin: 16,
                height: 170,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 20
              }}
            >
              <div className="row-sub">
                📍 Getting your location...
              </div>
            </div>
          ) : (


            <div
              className="map-preview"
              style={{
                margin: 16,
                marginTop: 12,
                height: 170,
                overflow: 'hidden',
                borderRadius: 8
              }}
            >
              <GreenSpaceMap
                coords={coords}
                height="170px"
              />
            </div>
          )}


          {/* ____________________MAP BUTTON ________________*/}

          <Link
            to="/track"
            className="btn btn-outline btn-sm"
            style={{
              margin: '0 16px 16px',
              justifyContent: 'center'
            }}
          >
            {locStatus === 'loading'
              ? 'Getting location…'
              : 'View full map'}
          </Link>

        </div>
      </div>


      {/*_____________________ GAUGES ___________________________  */}

      <div
        className="grid grid-3"
        style={{
          marginTop: 18
        }}
      >

        {GAUGES.map((g) => (

          <div
            className="card gauge-card"
            key={g.key}
          >

            <div className="gauge-row">

              <h3 style={{ margin: 0 }}>
                {g.label}
              </h3>

              <span className="gauge-pct">
                {bins[g.key]}%
              </span>

            </div>


            <div className="gauge-track">

              <div
                className="gauge-fill"
                style={{
                  width: `${bins[g.key]}%`,
                  background: g.color
                }}
              />

            </div>


            {g.key === 'compost' ? (

              <div
                className="row-sub"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >

                <span>
                  Filling up — {upcomingPickups[1]
                    ? formatPickupDate(upcomingPickups[1].date)
                    : 'No upcoming pickup'}
                </span>

                <Link
                  className="btn btn-outline btn-sm"
                  to="/schedule"
                >
                  Request pickup
                </Link>

              </div>

            ) : (

              <div className="row-sub">
                Next collection — {upcomingPickups[0]
                  ? formatPickupDate(upcomingPickups[0].date)
                  : 'No upcoming pickup'}
              </div>

            )}

          </div>

        ))}

      </div>


      {/*_____________________ ACTIVITY ___________________________ */}

      <div
        className="grid grid-2"
        style={{
          marginTop: 18,
          alignItems: 'start'
        }}
      >

        {/* RECENT ACTIVITY */}

        <div className="card">

          <h3>
            Recent activity
          </h3>


          {activity === null ? (

            <div className="row-sub">
              Loading…
            </div>

          ) : activity.length === 0 ? (

            <div className="row-sub">
              No activity yet — reports, extra pickups,
              and reward redemptions you make will show
              up here.
            </div>

          ) : (

            activity.map((i, idx) => {

              const dotColor =
                i.color === 'red'
                  ? 'var(--danger)'
                  : i.color === 'blue'
                  ? 'var(--route-blue)'
                  : 'var(--safety-amber-dark)';

              return (
                <div
                  className="activity-item"
                  key={idx}
                >

                  <span
                    className="activity-dot"
                    style={{
                      background: dotColor
                    }}
                  />

                  <div>

                    <div className="activity-text">
                      {i.text}
                    </div>

                    <div className="activity-time">
                      {new Date(i.time).toLocaleString(
                        'en-IN',
                        {
                          day: 'numeric',
                          month: 'short',
                          hour: 'numeric',
                          minute: '2-digit'
                        }
                      )}
                    </div>

                  </div>

                </div>
              );
            })

          )}

        </div>


        {/* QUICK ACTIONS */}

        <div className="card">

          <h3>
            Quick actions
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 9
            }}
          >

            <Link
              className="btn btn-outline btn-block"
              to="/schedule"
              style={{
                justifyContent: 'flex-start'
              }}
            >
              Schedule an extra pickup
            </Link>

            <Link
              className="btn btn-outline btn-block"
              to="/guide"
              style={{
                justifyContent: 'flex-start'
              }}
            >
              Look up how to sort an item
            </Link>

            <Link
              className="btn btn-outline btn-block"
              to="/report"
              style={{
                justifyContent: 'flex-start'
              }}
            >
              Report a missed pickup
            </Link>

            <Link
              className="btn btn-outline btn-block"
              to="/rewards"
              style={{
                justifyContent: 'flex-start'
              }}
            >
              Redeem EcoPoints
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}