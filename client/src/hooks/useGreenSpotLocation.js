import { useEffect, useState } from 'react';
//default data for showing hauz khas region if user denies location access or if location is not supported
const DEFAULT_COORDS = {
  lat: 28.5494,
  lng: 77.2001
};

export function useGreenSpotLocation() {
  const [status, setStatus] = useState('loading');
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('unsupported');
      setCoords(DEFAULT_COORDS);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const actualCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setCoords(actualCoords);
        setStatus('granted');
      },
      (error) => {
        console.warn('Location error:', error);

        setCoords(DEFAULT_COORDS);
        setStatus('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }, []);

  return {
    status,
    coords
  };
}