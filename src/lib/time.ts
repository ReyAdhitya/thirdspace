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

type Lang = 'zh-Hant' | 'en' | 'zh-Hans';

function localeOf(lang: Lang): string {
  return lang === 'en' ? 'en-HK' : lang === 'zh-Hans' ? 'zh-CN' : 'zh-HK';
}

/** CJK reads 星期五 in full; English keeps the short Fri. */
function weekdayStyle(lang: Lang): 'short' | 'long' {
  return lang === 'en' ? 'short' : 'long';
}

export function formatWhen(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(localeOf(lang), {
    timeZone: TZ,
    month: 'short',
    day: 'numeric',
    weekday: weekdayStyle(lang),
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));
}

export function formatDay(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(localeOf(lang), {
    timeZone: TZ,
    month: 'short',
    day: 'numeric',
    weekday: weekdayStyle(lang),
  }).format(new Date(iso));
}

/** "Aug" in English, "8月" in Chinese — for the big ticket date. */
export function formatMonth(iso: string, lang: Lang): string {
  if (lang === 'en') {
    return new Intl.DateTimeFormat('en-HK', { timeZone: TZ, month: 'short' }).format(
      new Date(iso),
    );
  }
  return `${Number(hkParts(iso).month)}月`;
}

/** Localised weekday initial for the calendar strip. */
export function formatWeekdayShort(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(localeOf(lang), {
    timeZone: TZ,
    weekday: 'short',
  })
    .format(new Date(iso))
    .replace('星期', '')
    .replace('週', '');
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
