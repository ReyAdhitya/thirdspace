import { Platform, TextStyle } from 'react-native';

/** Noto Serif TC for headings, Noto Sans TC for body. Both carry 繁中. */
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

export const fonts = { serif, sans };

export const type = {
  /** Wordmark and hero lines. */
  wordmark: {
    fontFamily: serif,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '500',
    letterSpacing: 0.2,
  } as TextStyle,
  /** Screen titles: "Discover", "Tickets". */
  screenTitle: {
    fontFamily: serif,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600',
    letterSpacing: -0.2,
  } as TextStyle,
  /** Event and card titles. */
  h1: {
    fontFamily: serif,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  } as TextStyle,
  h2: {
    fontFamily: serif,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
  } as TextStyle,
  h3: {
    fontFamily: serif,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
  } as TextStyle,
  /** Big numerals: the date on a ticket, profile stats. */
  numeral: {
    fontFamily: serif,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '600',
  } as TextStyle,
  numeralSm: {
    fontFamily: serif,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
  } as TextStyle,

  body: {
    fontFamily: sans,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '400',
  } as TextStyle,
  bodyStrong: {
    fontFamily: sans,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  } as TextStyle,
  meta: {
    fontFamily: sans,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '400',
  } as TextStyle,
  metaStrong: {
    fontFamily: sans,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  } as TextStyle,
  small: {
    fontFamily: sans,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '400',
  } as TextStyle,
  button: {
    fontFamily: sans,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  } as TextStyle,
  tab: {
    fontFamily: sans,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '500',
  } as TextStyle,
};
