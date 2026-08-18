import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, type } from '../theme';

export function Loading({ label }: { label?: string }) {
  return (
    <View style={styles.box}>
      <ActivityIndicator color={colors.pine} />
      {label ? (
        <Text style={[type.meta, { color: colors.muted, marginTop: 12 }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
});
