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
import { Icon, type IconName } from './Icon';

type Variant = 'pine' | 'white' | 'outline' | 'paper';

type Props = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  icon?: IconName;
  danger?: boolean;
  compact?: boolean;
};

export function Button({
  label,
  variant = 'pine',
  loading,
  disabled,
  icon,
  danger,
  compact,
  ...rest
}: Props) {
  const pine = variant === 'pine';
  const fg = pine
    ? colors.white
    : danger
      ? colors.rose
      : variant === 'paper'
        ? colors.ink
        : colors.ink;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        pine && { backgroundColor: pressed ? colors.pinePressed : colors.pine },
        variant === 'white' && [
          styles.bordered,
          { backgroundColor: pressed ? colors.stone : colors.white },
        ],
        variant === 'paper' && {
          backgroundColor: pressed ? colors.hairlineOnPaper : colors.paper,
        },
        variant === 'outline' && [
          styles.bordered,
          { backgroundColor: pressed ? colors.stone : 'transparent' },
        ],
        danger && variant !== 'pine' && { borderColor: colors.rose },
        disabled && { opacity: 0.45 },
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={17} color={fg} /> : null}
          <Text style={[type.button, { color: fg }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.x5,
  },
  compact: { minHeight: 40, borderRadius: radius.sm, paddingHorizontal: space.x4 },
  bordered: { borderWidth: 1, borderColor: colors.hairline },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.x2 },
});
