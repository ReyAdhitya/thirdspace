/**
 * OpenStreetMap official embed. Free, no API key, no Google Maps bill.
 * Web and native both load this URL (iframe / WebView). Attribution lives
 * in OSM’s own chrome — do not crop it off.
 */
export const HK_CENTER = { lat: 22.32, lng: 114.17 };

/** Whole-territory span: harbour, Kowloon and the Island in frame. */
export const HK_SPAN = { lat: 0.22, lng: 0.28 };

/** Street-level span around a selected event or district centre. */
export const PLACE_SPAN = { lat: 0.016, lng: 0.016 };

export type OsmView = {
  lat: number;
  lng: number;
  spanLat?: number;
  spanLng?: number;
  marker?: boolean;
};

function bbox(lat: number, lng: number, spanLat: number, spanLng: number) {
  const west = lng - spanLng / 2;
  const east = lng + spanLng / 2;
  const south = lat - spanLat / 2;
  const north = lat + spanLat / 2;
  const n = (x: number) => x.toFixed(6);
  return `${n(west)},${n(south)},${n(east)},${n(north)}`;
}

export function osmEmbedUrl({
  lat,
  lng,
  spanLat = PLACE_SPAN.lat,
  spanLng = PLACE_SPAN.lng,
  marker = false,
}: OsmView): string {
  const box = bbox(lat, lng, spanLat, spanLng);
  let url = `https://www.openstreetmap.org/export/embed.html?bbox=${box}&layer=mapnik`;
  if (marker) url += `&marker=${lat.toFixed(6)},${lng.toFixed(6)}`;
  return url;
}

export function hkTerritoryUrl(): string {
  return osmEmbedUrl({
    lat: HK_CENTER.lat,
    lng: HK_CENTER.lng,
    spanLat: HK_SPAN.lat,
    spanLng: HK_SPAN.lng,
    marker: false,
  });
}

export function osmPlaceUrl(lat: number, lng: number): string {
  return osmEmbedUrl({
    lat,
    lng,
    spanLat: PLACE_SPAN.lat,
    spanLng: PLACE_SPAN.lng,
    marker: true,
  });
}
