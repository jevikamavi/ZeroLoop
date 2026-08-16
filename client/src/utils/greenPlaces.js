const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function buildGreenPlacesSrc(lat, lng) {
  if (MAPS_API_KEY) {
    return `https://www.google.com/maps/embed/v1/search?key=${MAPS_API_KEY}&q=parks+and+green+spaces&center=${lat},${lng}&zoom=14`;
  }

  return `https://maps.google.com/maps?q=parks+and+green+spaces+near+${lat},${lng}&z=14&output=embed`;
}