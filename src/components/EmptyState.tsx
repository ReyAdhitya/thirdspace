import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '../theme';
import { Button } from './Button';

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
      <Text style={[type.h2, { color: colors.ink }]}>{title}</Text>
      {body ? (
        <Text style={[type.body, { color: colors.muted, marginTop: space.sm }]}>
          {body}
        </Text>
      ) : null}
      {action && onAction ? (
        <View style={{ marginTop: space.lg }}>
          <Button label={action} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    paddingVertical: space.xxl,
    paddingHorizontal: space.lg,
  },
});
