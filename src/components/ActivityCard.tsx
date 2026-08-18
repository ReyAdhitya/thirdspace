import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { districtLabel } from '../data/districts';
import { formatDay } from '../lib/time';
import type { Activity } from '../types';
import { colors, radius, space, type } from '../theme';
import { PriceText } from './PriceText';

/**
 * carousel — fixed-width, horizontal rail
 * stack    — full width, photo above a type block
 * line     — no photo, one hairline row
 */
export function ActivityCard({
  activity,
  onPress,
  onSave,
  saved,
  variant = 'carousel',
}: {
  activity: Activity;
  onPress: () => void;
  onSave?: () => void;
  saved?: boolean;
  variant?: 'carousel' | 'stack' | 'line';
}) {
  const { lang, t } = useApp();

  const meta = `${districtLabel(activity.district, lang)} · ${formatDay(
    activity.startsAt,
    lang,
  )}`;

  if (variant === 'line') {
    return (
      <Pressable onPress={onPress} style={styles.line}>
        <View style={{ flex: 1, paddingRight: space.x4 }}>
          <Text style={[type.bodyStrong, { color: colors.ink }]} numberOfLines={1}>
            {activity.title}
          </Text>
          <Text style={[type.meta, { color: colors.dim, marginTop: space.x1 }]}>
            {meta}
          </Text>
        </View>
        <PriceText priceHkd={activity.priceHkd} tone="dim" />
      </Pressable>
    );
  }

  const stack = variant === 'stack';

  return (
    <Pressable onPress={onPress} style={stack ? styles.stack : styles.carousel}>
      <Image
        source={{ uri: activity.photoUrl }}
        style={[styles.photo, { height: stack ? 240 : 168 }]}
        contentFit="cover"
        transition={220}
      />
      <View style={styles.copy}>
        <Text
          style={[stack ? type.h2 : type.bodyStrong, { color: colors.ink }]}
          numberOfLines={2}
        >
          {activity.title}
        </Text>
        <View style={styles.footRow}>
          <Text style={[type.meta, { color: colors.dim, flex: 1 }]} numberOfLines={1}>
            {meta}
          </Text>
          <PriceText priceHkd={activity.priceHkd} />
        </View>
        {onSave ? (
          <Pressable onPress={onSave} hitSlop={8} style={styles.save}>
            <Text style={[type.label, { color: saved ? colors.ink : colors.faint }]}>
              {saved ? t('savedOn') : t('save')}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  carousel: { width: 248, marginRight: space.x4 },
  stack: { width: '100%', marginBottom: space.x8 },
  photo: {
    width: '100%',
    borderRadius: radius.xs,
    backgroundColor: colors.raised,
  },
  copy: { marginTop: space.x3 },
  footRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space.x3,
    marginTop: space.x2,
  },
  save: { marginTop: space.x3, alignSelf: 'flex-start' },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.x4,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
});
