import type { IconName } from '../components/Icon';

/** Join badges (stamps), not coupons. Thresholds stay as on the old Profile. */
export const JOIN_BADGES: { icon: IconName; at: number; nameKey: string }[] = [
  { icon: 'feather', at: 1, nameKey: 'badgeFirst' },
  { icon: 'camera', at: 2, nameKey: 'badgeRegular' },
  { icon: 'map-pin', at: 3, nameKey: 'badgeExplorer' },
  { icon: 'music', at: 5, nameKey: 'badgeNeighbour' },
  { icon: 'coffee', at: 8, nameKey: 'badgeThirdspace' },
];
