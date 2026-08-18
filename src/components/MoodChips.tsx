import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import type { MoodId } from '../types';
import { colors, radius, space, type } from '../theme';

const MOODS: MoodId[] = ['quiet', 'create', 'meet', 'weekend', 'nearby'];

const keys: Record<MoodId, string> = {
  quiet: 'moodQuiet',
  create: 'moodCreate',
  meet: 'moodMeet',
  weekend: 'moodWeekend',
  nearby: 'moodNearby',
};

export function MoodChips({
  value,
  onChange,
  multi,
}: {
  value: MoodId | MoodId[] | null;
  onChange: (next: MoodId) => void;
  multi?: boolean;
}) {
  const { t } = useApp();
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
        {MOODS.map((id) => {
          const on = selected.includes(id);
          return (
            <Pressable
              key={id}
              onPress={() => onChange(id)}
              style={[styles.chip, on && styles.on]}
            >
              <Text style={[type.meta, { color: on ? colors.paper : colors.ink }]}>
                {t(keys[id])}
              </Text>
            </Pressable>
          );
        })}
        {!multi && value ? (
          <Pressable onPress={() => onChange(value as MoodId)} style={styles.chip}>
            <Text style={[type.meta, { color: colors.muted }]}>×</Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}

export { MOODS };

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm, paddingVertical: space.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  on: {
    backgroundColor: colors.pine,
    borderColor: colors.pine,
  },
});
