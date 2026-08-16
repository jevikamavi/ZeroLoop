import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap
} from 'react-leaflet';

const SEARCH_RADIUS = 20000; // 20 km

// Reliable fallback locations around Delhi.
// These are used only if the live OpenStreetMap search fails.
const FALLBACK_PLACES = [
  {
    id: 'deer-park',
    lat: 28.5456,
    lng: 77.1955,
    name: 'Deer Park, Hauz Khas',
    type: 'park'
  },
  {
    id: 'hauz-khas-district-park',
    lat: 28.5505,
    lng: 77.2012,
    name: 'Hauz Khas District Park',
    type: 'park'
  },
  {
    id: 'garden-five-senses',
    lat: 28.5132,
    lng: 77.2025,
    name: 'Garden of Five Senses',
    type: 'garden'
  },
  {
    id: 'nehru-park',
    lat: 28.5968,
    lng: 77.1898,
    name: 'Nehru Park',
    type: 'park'
  },
  {
    id: 'lodhi-garden',
    lat: 28.5933,
    lng: 77.2197,
    name: 'Lodhi Garden',
    type: 'garden'
  },
  {
    id: 'sanjay-van',
    lat: 28.5305,
    lng: 77.1532,
    name: 'Sanjay Van',
    type: 'nature reserve'
  },
  {
    id: 'jahanpanah-city-forest',
    lat: 28.5158,
    lng: 77.2308,
    name: 'Jahanpanah City Forest',
    type: 'park'
  },
  {
    id: 'buddha-jayanti-park',
    lat: 28.6117,
    lng: 77.1788,
    name: 'Buddha Jayanti Park',
    type: 'park'
  }
];

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

// Calculate distance between two coordinates in metres.
function distanceInMetres(lat1, lng1, lat2, lng2) {
  const R = 6371000;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

export default function GreenSpaceMap({ coords }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] =
    useState(false);

  useEffect(() => {
    if (!coords) return;

    async function findGreenSpaces() {
      setLoading(true);
      setUsingFallback(false);

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
            body: query,
            signal: AbortSignal.timeout(12000)
          }
        );

        if (!response.ok) {
          throw new Error(
            `Overpass returned ${response.status}`
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

        if (greenSpaces.length === 0) {
          throw new Error(
            'No green spaces returned'
          );
        }

        setPlaces(greenSpaces);
      } catch (err) {
        console.warn(
          'Live green-space search failed. Using fallback locations.'
        );

        // Only show fallback places that are within
        // 20 km of the user's actual location.
        const nearbyFallbacks =
          FALLBACK_PLACES.filter((place) => {
            return (
              distanceInMetres(
                coords.lat,
                coords.lng,
                place.lat,
                place.lng
              ) <= SEARCH_RADIUS
            );
          });

        setPlaces(nearbyFallbacks);
        setUsingFallback(true);
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
            <strong>
              You are here
            </strong>
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
              {place.type}
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

      {usingFallback && !loading && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1000,
            background: 'white',
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 12
          }}
        >
          🌳 Showing nearby Delhi green spaces
        </div>
      )}
    </div>
  );
}