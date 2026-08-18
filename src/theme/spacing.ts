/** 4/8 grid. Nothing off-grid. */
export const space = {
  x1: 4,
  x2: 8,
  x3: 12,
  x4: 16,
  x6: 24,
  x8: 32,
  x12: 48,
  x16: 64,
  gutter: 20,
} as const;

/** Near-square. Images get 2, controls get 2, nothing gets a pill. */
export const radius = {
  none: 0,
  xs: 2,
  sm: 3,
} as const;

export const hairline = 1;
