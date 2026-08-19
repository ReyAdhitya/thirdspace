import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '../theme';

export function Loading({ label }: { label?: string }) {
  return (
    <View style={styles.box}>
      <ActivityIndicator color={colors.pine} />
      {label ? (
        <Text style={[type.meta, { color: colors.muted, marginTop: space.x3 }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

/** Cream placeholder blocks while a section resolves. */
export function LoadingRows({ rows = 3 }: { rows?: number }) {
  return (
    <View style={{ gap: space.x3 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.thumb} />
          <View style={{ flex: 1, gap: space.x2 }}>
            <View style={[styles.bar, { width: `${70 - i * 8}%` }]} />
            <View style={[styles.bar, { width: '40%', height: 8 }]} />
          </View>
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
    backgroundColor: colors.stone,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: space.x2,
  },
  thumb: {
    width: 54,
    height: 54,
    borderRadius: radius.sm,
    backgroundColor: colors.paper,
  },
  bar: { height: 11, borderRadius: 4, backgroundColor: colors.paper },
});
