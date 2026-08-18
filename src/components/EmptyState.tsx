import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '../theme';
import { Button } from './Button';

/** An empty screen is an invitation, so it states the next move. */
export function EmptyState({
  title,
  body,
  action,
  onAction,
}: {
  title: string;
  body?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.box}>
      <View style={styles.mark} />
      <Text style={[type.h2, { color: colors.ink, marginTop: space.x4 }]}>{title}</Text>
      {body ? (
        <Text style={[type.bodySm, { color: colors.dim, marginTop: space.x2 }]}>
          {body}
        </Text>
      ) : null}
      {action && onAction ? (
        <View style={styles.action}>
          <Button label={action} variant="quiet" onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { paddingVertical: space.x12 },
  mark: { width: 28, height: 1, backgroundColor: colors.accent },
  action: { marginTop: space.x6, alignSelf: 'flex-start', minWidth: 180 },
});
