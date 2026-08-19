import type { AppLanguage } from '../types';

/**
 * Google Maps Embed only. Embed is free and unmetered, unlike the Maps
 * JavaScript / Dynamic Maps SDKs, so nothing here is billed per load.
 * With a key we use the official Embed API; without one we fall back to
 * the keyless `output=embed` URL so a demo still shows a real Google map.
 */
export const HONG_KONG = 'Hong Kong';

/** Whole-territory view: harbour, Kowloon and the Island all in frame. */
export const HK_DEFAULT_ZOOM = 11;
export const PLACE_ZOOM = 15;

function embedLanguage(lang: AppLanguage): string {
  if (lang === 'zh-Hant') return 'zh-TW';
  if (lang === 'zh-Hans') return 'zh-CN';
  return 'en';
}

function apiKey(): string | undefined {
  const key = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  return key && key.length > 0 ? key : undefined;
}

export function mapsEmbedUrl({
  query,
  lang,
  zoom = HK_DEFAULT_ZOOM,
}: {
  query: string;
  lang: AppLanguage;
  zoom?: number;
}): string {
  const q = encodeURIComponent(query.trim() || HONG_KONG);
  const hl = embedLanguage(lang);
  const key = apiKey();

  if (key) {
    return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}&zoom=${zoom}&language=${hl}&region=HK`;
  }
  return `https://maps.google.com/maps?q=${q}&z=${zoom}&hl=${hl}&output=embed`;
}

/** Prefer coordinates when we have them, otherwise a searchable address. */
export function activityMapQuery(a: {
  lat?: number;
  lng?: number;
  address: string;
  addressEn?: string;
}): string {
  if (typeof a.lat === 'number' && typeof a.lng === 'number') {
    return `${a.lat},${a.lng}`;
  }
  return `${a.addressEn ?? a.address}, ${HONG_KONG}`;
}

/** A place name typed into search, scoped to Hong Kong. */
export function placeQuery(text: string): string {
  const term = text.trim();
  if (!term) return HONG_KONG;
  return `${term}, ${HONG_KONG}`;
}
