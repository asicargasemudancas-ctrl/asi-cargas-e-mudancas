// Estimativa de distância por estrada a partir da distância em linha reta.
// O fator 1,22 foi calibrado com trechos conhecidos da ASI (ex.: Petrolina–Fortaleza ≈ 810 km).
export const ROAD_FACTOR = 1.22;
export const KM_PER_TRAVEL_DAY = 900;

const EARTH_RADIUS_KM = 6371;

export type GeoPoint = { readonly lon: number; readonly lat: number };

export function straightLineKm(a: GeoPoint, b: GeoPoint): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function roadEstimateKm(a: GeoPoint, b: GeoPoint): number {
  return Math.round((straightLineKm(a, b) * ROAD_FACTOR) / 10) * 10;
}

export function travelDays(roadKm: number): number {
  return Math.max(1, Math.ceil(roadKm / KM_PER_TRAVEL_DAY));
}

export function formatKm(km: number): string {
  return `${new Intl.NumberFormat("pt-BR").format(Math.round(km))} km`;
}
