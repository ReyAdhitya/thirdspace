import React from 'react';
import { Text, type TextStyle } from 'react-native';

import { useApp } from '../context/AppContext';
import { colors, type } from '../theme';

/** Price is typography, never a tag. Free reads as a word, paid as data. */
export function PriceText({
  priceHkd,
  size = 'sm',
  tone = 'ink',
}: {
  priceHkd: number;
  size?: 'sm' | 'lg';
  tone?: 'ink' | 'dim';
}) {
  const { t } = useApp();
  const free = priceHkd <= 0;
  const base: TextStyle = size === 'lg' ? type.dataLg : type.data;
  return (
    <Text style={[base, { color: tone === 'dim' ? colors.dim : colors.ink }]}>
      {free ? t('free') : `HK$${priceHkd}`}
    </Text>
  );
}
