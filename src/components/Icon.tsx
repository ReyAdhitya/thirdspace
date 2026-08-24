import { Feather } from '@expo/vector-icons';
import React from 'react';

import { colors } from '../theme';

/** Thin outline set, one weight everywhere, matching the board's icon row. */
export type IconName =
  | 'search'
  | 'sliders'
  | 'bell'
  | 'map-pin'
  | 'calendar'
  | 'user'
  | 'user-plus'
  | 'users'
  | 'heart'
  | 'message-circle'
  | 'tag'
  | 'compass'
  | 'settings'
  | 'chevron-left'
  | 'chevron-right'
  | 'share-2'
  | 'x'
  | 'plus'
  | 'minus'
  | 'camera'
  | 'send'
  | 'check'
  | 'more-horizontal'
  | 'coffee'
  | 'edit-3'
  | 'shield'
  | 'file-text'
  | 'info'
  | 'globe'
  | 'log-out'
  | 'award'
  | 'music'
  | 'image'
  | 'clock'
  | 'bookmark'
  | 'feather'
  | 'lock'
  | 'mail'
  | 'eye';

export function Icon({
  name,
  size = 20,
  color = colors.ink,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <Feather name={name} size={size} color={color} />;
}
