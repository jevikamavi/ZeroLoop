import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap
} from 'react-leaflet';

const SEARCH_RADIUS = 20000; // 20 km

function RecenterMap({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(
        [coords.lat, coords.lng],
        11
      );
    }
  }, [coords, map]);

  return null;
}

export default function GreenSpaceMap({ coords }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coords) return;

    async function findGreenSpaces() {
      setLoading(true);
      setError(null);

      const query = `
        [out:json][timeout:25];

        (
          nwr(
            around:${SEARCH_RADIUS},
            ${coords.lat},
            ${coords.lng}
          )["leisure"="park"];

          nwr(
            around:${SEARCH_RADIUS},
            ${coords.lat},
            ${coords.lng}
          )["leisure"="garden"];

          nwr(
            around:${SEARCH_RADIUS},
            ${coords.lat},
            ${coords.lng}
          )["leisure"="nature_reserve"];
        );

        out center tags;
      `;

      try {
        const response = await fetch(
          'https://overpass-api.de/api/interpreter',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain'
            },
            body: query
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to find nearby green spaces. (${response.status})`
          );
        }

        const data = await response.json();

        const greenSpaces = data.elements
          .map((place) => {
            let lat;
            let lng;

            if (place.type === 'node') {
              lat = place.lat;
              lng = place.lon;
            } else if (place.center) {
              lat = place.center.lat;
              lng = place.center.lon;
            }

            if (
              typeof lat !== 'number' ||
              typeof lng !== 'number'
            ) {
              return null;
            }

            return {
              id: `${place.type}-${place.id}`,
              lat,
              lng,
              name:
                place.tags?.name ||
                'Unnamed green space',
              type:
                place.tags?.leisure ||
                'green space'
            };
          })
          .filter(Boolean);

        setPlaces(greenSpaces);
      } catch (err) {
        console.error(
          'Green space search failed:',
          err
        );

        setError(
          'Could not load nearby green spaces.'
        );
      } finally {
        setLoading(false);
      }
    }

    findGreenSpaces();
  }, [coords]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '480px'
      }}
    >
      <MapContainer
        center={[
          coords.lat,
          coords.lng
        ]}
        zoom={11}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap coords={coords} />

        {/* YOUR LOCATION */}
        <CircleMarker
          center={[
            coords.lat,
            coords.lng
          ]}
          radius={9}
          pathOptions={{
            color: '#2563eb',
            fillColor: '#2563eb',
            fillOpacity: 1
          }}
        >
          <Popup>
            <strong>You are here</strong>
          </Popup>
        </CircleMarker>

        {/* GREEN SPACES */}
        {places.map((place) => (
          <CircleMarker
            key={place.id}
            center={[
              place.lat,
              place.lng
            ]}
            radius={8}
            pathOptions={{
              color: '#16a34a',
              fillColor: '#22c55e',
              fillOpacity: 0.9
            }}
          >
            <Popup>
              <strong>
                {place.name}
              </strong>
              <br />
              {place.type.replace('_', ' ')}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1000,
            background: 'white',
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 13
          }}
        >
          🌳 Finding nearby green spaces...
        </div>
      )}

      {error && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1000,
            background: 'white',
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 13
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}