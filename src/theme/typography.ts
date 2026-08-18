import { Platform, TextStyle } from 'react-native';

const display = Platform.select({
  web: '"Noto Serif TC", "Songti TC", serif',
  ios: 'Songti TC',
  android: 'serif',
  default: 'serif',
}) as string;

const body = Platform.select({
  web: '"Noto Sans TC", "PingFang HK", sans-serif',
  ios: 'PingFang HK',
  android: 'sans-serif',
  default: 'sans-serif',
}) as string;

const mono = Platform.select({
  web: '"IBM Plex Mono", ui-monospace, monospace',
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
}) as string;

export const fonts = { display, body, mono };

export const type = {
  greeting: {
    fontFamily: display,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700',
    letterSpacing: 0.2,
  } as TextStyle,
  title: {
    fontFamily: display,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
  } as TextStyle,
  h2: {
    fontFamily: display,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  } as TextStyle,
  body: {
    fontFamily: body,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,
  bodyStrong: {
    fontFamily: body,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  } as TextStyle,
  meta: {
    fontFamily: body,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  } as TextStyle,
  label: {
    fontFamily: body,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.8,
  } as TextStyle,
  price: {
    fontFamily: mono,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    letterSpacing: 0.3,
  } as TextStyle,
  tab: {
    fontFamily: body,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
  } as TextStyle,
};
