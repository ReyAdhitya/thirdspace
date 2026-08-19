import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, type } from '../theme';

/** The doorway: a pine arch with a light keyhole cut, as drawn on the board. */
export function ArchMark({
  size = 56,
  color = colors.pine,
}: {
  size?: number;
  color?: string;
}) {
  const w = size * 0.78;
  return (
    <Svg width={w} height={size} viewBox="0 0 78 100">
      {/* Outer arch: semicircular top on straight jambs. */}
      <Path
        d="M39 0C17.46 0 0 17.46 0 39v61h78V39C78 17.46 60.54 0 39 0z"
        fill={color}
      />
      {/* Inner cut, offset right, leaving a crescent of pine. */}
      <Path
        d="M50 20c-13.25 0-24 10.75-24 24v56h48V44c0-13.25-10.75-24-24-24z"
        fill={colors.stone}
      />
    </Svg>
  );
}

export function Wordmark({
  size = 34,
  color = colors.ink,
  markSize,
}: {
  size?: number;
  color?: string;
  markSize?: number;
}) {
  return (
    <View style={styles.row}>
      <ArchMark size={markSize ?? size * 1.15} />
      <Text style={[type.wordmark, { fontSize: size, color }]}>Thirdspace</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
