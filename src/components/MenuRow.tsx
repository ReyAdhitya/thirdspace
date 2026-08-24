import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '../theme';
import { Icon, type IconName } from './Icon';

/** Cream chevron row — Profile stack, JPEG structure, our skin. */
export function MenuRow({
  icon,
  label,
  onPress,
  trailing,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  trailing?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.stone }]}
    >
      <View style={styles.glyph}>
        <Icon name={icon} size={18} color={colors.pine} />
      </View>
      <Text style={[type.body, { color: colors.ink, flex: 1 }]}>{label}</Text>
      {trailing ? (
        <Text style={[type.meta, { color: colors.muted }]}>{trailing}</Text>
      ) : null}
      <Icon name="chevron-right" size={16} color={colors.faint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: space.x4,
    paddingVertical: space.x4,
  },
  glyph: {
    width: 28,
    alignItems: 'center',
  },
});
