import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '../theme';

export function Loading({ label }: { label?: string }) {
  return (
    <View style={styles.box}>
      <ActivityIndicator color={colors.dim} size="small" />
      {label ? (
        <Text style={[type.label, { color: colors.faint, marginTop: space.x4 }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

/** Inline placeholder for a section that is still resolving. */
export function LoadingRows({ rows = 3 }: { rows?: number }) {
  return (
    <View>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.bar, { width: `${72 - i * 12}%` }]} />
          <View style={[styles.bar, styles.barSm]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.x8,
    backgroundColor: colors.bg,
  },
  row: {
    paddingVertical: space.x4,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  bar: { height: 10, backgroundColor: colors.raised },
  barSm: { width: '32%', height: 8, marginTop: space.x2 },
});
