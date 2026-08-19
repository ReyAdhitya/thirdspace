import { Platform, useWindowDimensions } from 'react-native';

/** The web preview is a phone, never a desktop site. */
export const PHONE_MAX_WIDTH = 390;

export function useShell() {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  /** True when the browser window is wider than the phone frame. */
  const isFramed = isWeb && width > PHONE_MAX_WIDTH;
  return { isWeb, isFramed, width, height };
}
