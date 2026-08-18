/** Quiet future tokens. One accent (harbor pine). Not purple. Not neon. */
export const colors = {
  paper: '#E7E4DC',
  ink: '#1A1E1B',
  muted: '#5E655F',
  line: '#C9C4B8',
  surface: '#F3F1EA',
  surface2: '#DDD8CC',
  pine: '#24564A',
  pinePressed: '#1B4037',
  pineSoft: '#D7E4DE',
  danger: '#8F3D32',
  dangerSoft: '#F0D8D4',
  good: '#24564A',
  overlay: 'rgba(26, 30, 27, 0.48)',
  tabBar: '#F3F1EA',
  webStage: '#2C322E',
} as const;

export type ColorName = keyof typeof colors;
