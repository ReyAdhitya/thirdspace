import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '../theme';

/** Section marker: mono eyebrow over a hairline. No card, no chip. */
export function SectionHead({
  label,
  action,
  onAction,
}: {
  label: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.head}>
      <Text style={[type.label, { color: colors.dim }]}>{label}</Text>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={[type.data, { color: colors.ink }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** A labelled fact. Used on the event page and the ticket. */
export function Fact({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <View style={styles.fact}>
      <Text style={[type.label, { color: colors.faint }]}>{label}</Text>
      <Text
        style={[mono ? type.data : type.body, { color: colors.ink, marginTop: space.x2 }]}
      >
        {value}
      </Text>
    </View>
  );
}

export function Rule({ strong }: { strong?: boolean }) {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: strong ? colors.hairlineStrong : colors.hairline,
      }}
    />
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingBottom: space.x3,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  fact: {
    paddingVertical: space.x4,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
});
