import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '../theme';
import { Icon } from './Icon';

/** Serif section title, optional caption, and a quiet "see all" on the right. */
export function SectionHead({
  title,
  caption,
  action,
  onAction,
}: {
  title: string;
  caption?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={[type.h2, { color: colors.ink }]}>{title}</Text>
        {caption ? (
          <Text style={[type.meta, { color: colors.muted, marginTop: 2 }]}>
            {caption}
          </Text>
        ) : null}
      </View>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} style={styles.action}>
          <Text style={[type.meta, { color: colors.muted }]}>{action}</Text>
          <Icon name="chevron-right" size={14} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** Underlined segmented control, as on Tickets and Admin. */
export function Segments<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (next: T) => void;
  items: { id: T; label: string }[];
}) {
  return (
    <View style={styles.segments}>
      {items.map((item) => {
        const on = item.id === value;
        return (
          <Pressable
            key={item.id}
            onPress={() => onChange(item.id)}
            style={styles.segment}
          >
            <Text
              style={[
                on ? type.bodyStrong : type.body,
                { color: on ? colors.ink : colors.faint },
              ]}
            >
              {item.label}
            </Text>
            <View
              style={[
                styles.segmentRule,
                { backgroundColor: on ? colors.pine : 'transparent' },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: space.x3 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  segments: {
    flexDirection: 'row',
    gap: space.x6,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  segment: { paddingBottom: space.x3 },
  segmentRule: {
    height: 2,
    marginTop: space.x3,
    marginBottom: -1,
    borderRadius: 2,
  },
});
