import React from 'react';
import { Text } from 'react-native';

import { useApp } from '../context/AppContext';
import { colors, type } from '../theme';

export function PriceText({
  priceHkd,
  invert,
}: {
  priceHkd: number;
  invert?: boolean;
}) {
  const { t } = useApp();
  const label = priceHkd <= 0 ? t('free') : `HK$${priceHkd}`;
  return (
    <Text
      style={[
        type.price,
        { color: invert ? colors.paper : colors.pine },
      ]}
    >
      {label}
    </Text>
  );
}
