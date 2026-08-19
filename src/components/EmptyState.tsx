import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '../theme';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';

export function EmptyState({
  title,
  body,
  action,
  onAction,
  icon = 'compass',
}: {
  title: string;
  body?: string;
  action?: string;
  onAction?: () => void;
  icon?: IconName;
}) {
  return (
    <View style={styles.box}>
      <View style={styles.badge}>
        <Icon name={icon} size={22} color={colors.pine} />
      </View>
      <Text style={[type.h2, { color: colors.ink, marginTop: space.x4 }]}>{title}</Text>
      {body ? (
        <Text style={[type.meta, { color: colors.muted, marginTop: space.x2, textAlign: 'center' }]}>
          {body}
        </Text>
      ) : null}
      {action && onAction ? (
        <View style={styles.action}>
          <Button label={action} variant="white" onPress={onAction} compact />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', paddingVertical: space.x10 },
  badge: {
    width: 54,
    height: 54,
    borderRadius: radius.lg,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: { marginTop: space.x5, minWidth: 160 },
});
