export const TZ = 'Asia/Hong_Kong';

export function nowHk(): Date {
  return new Date();
}

export function hkParts(iso: string | Date) {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const bag: Record<string, string> = {};
  for (const p of fmt.formatToParts(d)) {
    if (p.type !== 'literal') bag[p.type] = p.value;
  }
  return bag;
}

export function formatWhen(
  iso: string,
  lang: 'zh-Hant' | 'en' | 'zh-Hans',
): string {
  const locale = lang === 'en' ? 'en-HK' : lang === 'zh-Hans' ? 'zh-CN' : 'zh-HK';
  return new Intl.DateTimeFormat(locale, {
    timeZone: TZ,
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));
}

export function formatDay(iso: string, lang: 'zh-Hant' | 'en' | 'zh-Hans'): string {
  const locale = lang === 'en' ? 'en-HK' : lang === 'zh-Hans' ? 'zh-CN' : 'zh-HK';
  return new Intl.DateTimeFormat(locale, {
    timeZone: TZ,
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(iso));
}

export function hkHour(d = new Date()): number {
  const hour = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    hour12: false,
  }).format(d);
  return Number(hour);
}

export function isWeekendHk(iso: string): boolean {
  const wd = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
  }).format(new Date(iso));
  return wd === 'Sat' || wd === 'Sun';
}

/** Build an ISO string that represents local HK wall time. */
export function hkIso(
  y: number,
  m: number,
  d: number,
  hh: number,
  mm: number,
): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${y}-${pad(m)}-${pad(d)}T${pad(hh)}:${pad(mm)}:00+08:00`;
}

export function toDatetimeLocalValue(iso: string): string {
  const p = hkParts(iso);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

export function fromDatetimeLocalValue(value: string): string {
  return `${value}:00+08:00`;
}
