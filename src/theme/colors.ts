/**
 * One surface family (warm near-black) and one accent.
 * The accent is reserved for the primary commitment (Join) and the
 * active navigation state. Everything else is ink, dim, or a hairline.
 */
export const colors = {
  bg: '#0B0B0A',
  raised: '#131311',
  sunken: '#070706',

  ink: '#F4F1EA',
  dim: '#8A8780',
  faint: '#5E5B55',

  hairline: '#242320',
  hairlineStrong: '#35332E',

  accent: '#E4462B',
  accentPressed: '#C43A22',
  onAccent: '#0B0B0A',

  scrim: 'rgba(11, 11, 10, 0.55)',
  scrimStrong: 'rgba(11, 11, 10, 0.82)',
} as const;

export type ColorName = keyof typeof colors;
