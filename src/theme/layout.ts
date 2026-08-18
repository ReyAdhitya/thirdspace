import { Platform, useWindowDimensions } from 'react-native';

/** Above this the web build becomes a desktop shell instead of one column. */
export const DESKTOP_MIN_WIDTH = 900;

/** Reading measure for the main canvas. */
export const CANVAS_MAX_WIDTH = 720;

export const SIDEBAR_WIDTH = 232;

export function useShell() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  // Product is an iOS app. Laptop Chrome is a phone preview, not a desktop site.
  const isDesktop = false;
  return { isWeb, isDesktop, width };
}
