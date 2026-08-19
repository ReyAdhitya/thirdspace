/** Palette from the design board: stone ground, cream cards, pine actions. */
export const colors = {
  stone: '#F6F4F1',
  paper: '#EDEAD8',
  ink: '#1A1A1A',
  pine: '#1F3D34',
  harbor: '#8DA29A',

  pinePressed: '#162C26',
  pineSoft: '#E4EAE6',
  white: '#FFFFFF',

  /** Secondary text on stone. */
  muted: '#6E6E68',
  faint: '#9A968E',
  hairline: '#E3DFD7',
  hairlineOnPaper: '#DCD7C2',

  /** The single warm icon accent on the board (heart). */
  rose: '#C4564A',

  scrim: 'rgba(20, 22, 20, 0.42)',
  scrimStrong: 'rgba(16, 18, 16, 0.72)',

  /** Backdrop behind the phone frame in a desktop browser. */
  stage: '#DEDAD3',
} as const;

export type ColorName = keyof typeof colors;
