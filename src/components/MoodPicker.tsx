import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import type { MoodId } from '../types';
import { colors, space, type } from '../theme';

const MOODS: MoodId[] = ['quiet', 'create', 'meet', 'weekend', 'nearby'];

const keys: Record<MoodId, string> = {
  quiet: 'moodQuiet',
  create: 'moodCreate',
  meet: 'moodMeet',
  weekend: 'moodWeekend',
  nearby: 'moodNearby',
};

/** Moods are words in a row. Selected gets the accent rule, nothing else. */
export function MoodPicker({
  value,
  onChange,
  wrap,
}: {
  value: MoodId | MoodId[] | null;
  onChange: (next: MoodId) => void;
  wrap?: boolean;
}) {
  const { t } = useApp();
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  return (
    <View style={[styles.row, wrap && styles.wrap]}>
      {MOODS.map((id) => {
        const on = selected.includes(id);
        return (
          <Pressable key={id} onPress={() => onChange(id)} hitSlop={6}>
            <Text
              style={[
                type.bodyStrong,
                { color: on ? colors.ink : colors.dim },
              ]}
            >
              {t(keys[id])}
            </Text>
            <View
              style={[
                styles.rule,
                { backgroundColor: on ? colors.accent : 'transparent' },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export { MOODS };

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space.x6,
    alignItems: 'flex-start',
  },
  wrap: { flexWrap: 'wrap', rowGap: space.x4 },
  rule: { height: 2, marginTop: space.x2 },
});
