import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import type { MoodId } from '../types';
import { colors, radius, space, type } from '../theme';
import { Icon, type IconName } from './Icon';

const MOODS: {
  id: MoodId;
  key: string;
  icon: IconName;
  /** The board tints one glyph warm; the rest are pine. */
  tint?: string;
}[] = [
  { id: 'quiet', key: 'moodQuiet', icon: 'feather' },
  { id: 'create', key: 'moodCreate', icon: 'edit-3' },
  { id: 'meet', key: 'moodMeet', icon: 'heart', tint: colors.rose },
  { id: 'weekend', key: 'moodWeekend', icon: 'calendar' },
  { id: 'nearby', key: 'moodNearby', icon: 'map-pin' },
];

/** Rounded-square icon tiles on cream, pine when chosen. */
export function MoodPicker({
  value,
  onChange,
}: {
  value: MoodId | MoodId[] | null;
  onChange: (next: MoodId) => void;
}) {
  const { t } = useApp();
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {MOODS.map((mood) => {
        const on = selected.includes(mood.id);
        return (
          <Pressable
            key={mood.id}
            onPress={() => onChange(mood.id)}
            style={styles.item}
          >
            <View style={[styles.tile, on && { backgroundColor: colors.pine }]}>
              <Icon
                name={mood.icon}
                size={21}
                color={on ? colors.white : (mood.tint ?? colors.pine)}
              />
            </View>
            <Text
              style={[
                type.small,
                { color: on ? colors.ink : colors.muted, marginTop: space.x2 },
              ]}
              numberOfLines={1}
            >
              {t(mood.key)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export { MOODS };

const styles = StyleSheet.create({
  row: { gap: space.x3, paddingRight: space.x4 },
  item: { alignItems: 'center', width: 62 },
  tile: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
