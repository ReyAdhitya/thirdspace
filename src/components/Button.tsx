import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
} from 'react-native';

import { colors, radius, space, type } from '../theme';

type Variant = 'primary' | 'quiet' | 'destructive';

type Props = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  /** Right-aligned data, e.g. a price on the Join button. */
  trailing?: string;
};

export function Button({
  label,
  variant = 'primary',
  loading,
  disabled,
  trailing,
  ...rest
}: Props) {
  const primary = variant === 'primary';
  const fg = primary
    ? colors.onAccent
    : variant === 'destructive'
      ? colors.accent
      : colors.ink;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        primary && { backgroundColor: pressed ? colors.accentPressed : colors.accent },
        !primary && styles.outlined,
        variant === 'destructive' && { borderColor: colors.accent },
        !primary && pressed && { backgroundColor: colors.raised },
        disabled && { opacity: 0.4 },
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <View style={styles.row}>
          <Text style={[type.action, { color: fg }]}>{label}</Text>
          {trailing ? (
            <Text style={[type.data, { color: fg, opacity: primary ? 0.72 : 1 }]}>
              {trailing}
            </Text>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.x4,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
  },
});
