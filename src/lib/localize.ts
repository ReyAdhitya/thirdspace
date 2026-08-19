import type { Activity, AppLanguage, User } from '../types';

/**
 * Content localisation. A card must never mix languages: when the locale is
 * English every string on it comes from the English field, falling back to
 * the original only when no translation exists (e.g. user-created events).
 */
export function activityTitle(a: Activity, lang: AppLanguage): string {
  return lang === 'en' ? (a.titleEn ?? a.title) : a.title;
}

export function activitySummary(a: Activity, lang: AppLanguage): string {
  return lang === 'en' ? (a.summaryEn ?? a.summary) : a.summary;
}

export function activityAddress(a: Activity, lang: AppLanguage): string {
  return lang === 'en' ? (a.addressEn ?? a.address) : a.address;
}

export function userName(u: User | undefined, lang: AppLanguage): string {
  if (!u) return '';
  return lang === 'en' ? (u.displayNameEn ?? u.displayName) : u.displayName;
}

export function userBio(u: User | undefined, lang: AppLanguage): string {
  if (!u) return '';
  return lang === 'en' ? (u.bioEn ?? u.bio ?? '') : (u.bio ?? '');
}
