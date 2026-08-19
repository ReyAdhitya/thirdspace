import { Platform, TextStyle } from 'react-native';

/**
 * One sans family across the whole UI. Outfit carries Latin, Noto Sans TC
 * carries 中文, so a mixed string never changes personality mid-line.
 * No serif anywhere.
 */
const sans = Platform.select({
  web: '"Outfit", "Noto Sans TC", "PingFang HK", sans-serif',
  ios: 'PingFang HK',
  android: 'sans-serif',
  default: 'sans-serif',
}) as string;

export const fonts = { sans };

export const type = {
  /** Wordmark on login. */
  wordmark: {
    fontFamily: sans,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '500',
    letterSpacing: -0.6,
  } as TextStyle,
  /** Screen titles: Discover, Tickets. */
  screenTitle: {
    fontFamily: sans,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '500',
    letterSpacing: -0.6,
  } as TextStyle,
  h1: {
    fontFamily: sans,
    fontSize: 22,
    lineHeight: 29,
    fontWeight: '500',
    letterSpacing: -0.4,
  } as TextStyle,
  h2: {
    fontFamily: sans,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: -0.2,
  } as TextStyle,
  h3: {
    fontFamily: sans,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
  } as TextStyle,
  /** Big numerals: ticket day, profile stats. */
  numeral: {
    fontFamily: sans,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '500',
    letterSpacing: -1,
  } as TextStyle,
  numeralSm: {
    fontFamily: sans,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '500',
    letterSpacing: -0.3,
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
    fontWeight: '500',
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
    fontWeight: '500',
  } as TextStyle,
  small: {
    fontFamily: sans,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '400',
  } as TextStyle,
  button: {
    fontFamily: sans,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  } as TextStyle,
  tab: {
    fontFamily: sans,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '400',
  } as TextStyle,
};
