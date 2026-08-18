import { Platform, TextStyle } from 'react-native';

/**
 * Three roles, each with a job:
 *   serif — one or two display lines per screen, never a section heading
 *   sans  — everything a person reads
 *   mono  — data: price, time, counts, labels, nav
 * CJK falls back inside every stack so 繁中 never loses a glyph.
 */
const serif = Platform.select({
  web: '"Noto Serif TC", "Songti TC", serif',
  ios: 'Songti TC',
  android: 'serif',
  default: 'serif',
}) as string;

const sans = Platform.select({
  web: '"Noto Sans TC", "PingFang HK", sans-serif',
  ios: 'PingFang HK',
  android: 'sans-serif',
  default: 'sans-serif',
}) as string;

const mono = Platform.select({
  web: '"IBM Plex Mono", "Noto Sans TC", ui-monospace, monospace',
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
}) as string;

export const fonts = { serif, sans, mono };

export const type = {
  /** Serif. One or two lines, once per screen. */
  display: {
    fontFamily: serif,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '600',
    letterSpacing: -1,
  } as TextStyle,
  displaySm: {
    fontFamily: serif,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '600',
    letterSpacing: -0.6,
  } as TextStyle,

  h1: {
    fontFamily: sans,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: -0.5,
  } as TextStyle,
  h2: {
    fontFamily: sans,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: -0.2,
  } as TextStyle,

  body: {
    fontFamily: sans,
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '400',
  } as TextStyle,
  bodyStrong: {
    fontFamily: sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  } as TextStyle,
  bodySm: {
    fontFamily: sans,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  } as TextStyle,
  meta: {
    fontFamily: sans,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '400',
  } as TextStyle,

  /** Mono. Eyebrows and section markers. */
  label: {
    fontFamily: mono,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  } as TextStyle,
  /** Mono. Price, time, counts. */
  data: {
    fontFamily: mono,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: 0.2,
  } as TextStyle,
  dataLg: {
    fontFamily: mono,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    letterSpacing: 0.2,
  } as TextStyle,
  action: {
    fontFamily: mono,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,
  tab: {
    fontFamily: mono,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as TextStyle,
};
