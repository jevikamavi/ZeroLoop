import React from 'react';
import { useGreenSpotLocation } from '../hooks/useGreenSpotLocation.js';
import GreenSpaceMap from '../components/GreenSpaceMap.jsx';

export default function Track() {
  const { status, coords } = useGreenSpotLocation();

  if (!coords) {
    return (
      <section className="view active">
        <div className="view-header">
          <span className="eyebrow">Nearby</span>

          <h1>Green spots near you</h1>

          <p className="view-sub">
            📍 Getting your location...
          </p>
        </div>
      </section>
    );
  }

  const subtitle =
    status === 'denied'
      ? "Location access was declined, so we're showing green spots around the Hauz Khas Zone instead."
      : status === 'unsupported'
      ? "Your browser doesn't support location, so we're showing green spots around the Hauz Khas Zone instead."
      : 'Showing parks and green spaces within 20 km of your location.';

  return (
    <section className="view active">
      <div className="view-header">
        <span className="eyebrow">Nearby</span>

        <h1>Green spots near you</h1>

        <p className="view-sub">
          {subtitle}
        </p>
      </div>

      <div
        className="card"
        style={{
          padding: 0,
          overflow: 'hidden'
        }}
      >
        <div className="map-preview">
          <GreenSpaceMap coords={coords} />
        </div>
      </div>

      <p
        className="view-sub"
        style={{ marginTop: 14 }}
      >
        Your location is used to find nearby parks,cgardens, and green spaces. ZeroLoop does not save your location.
      </p>
    </section>
  );
}