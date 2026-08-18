import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native';

import { colors, radius, type } from '../theme';

type Props = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  loading,
  disabled,
  ...rest
}: Props) {
  const bg =
    variant === 'primary'
      ? colors.pine
      : variant === 'danger'
        ? colors.danger
        : 'transparent';
  const fg = variant === 'ghost' ? colors.pine : colors.paper;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.88 : 1 },
        variant === 'ghost' ? styles.ghost : undefined,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[type.bodyStrong, { color: fg }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  ghost: {
    borderWidth: 1,
    borderColor: colors.pine,
  },
});
