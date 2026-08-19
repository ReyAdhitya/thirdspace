import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { districtLabel } from '../data/districts';
import { activityTitle } from '../lib/localize';
import { formatDay } from '../lib/time';
import type { Activity } from '../types';
import { colors, radius, space, type } from '../theme';
import { Icon } from './Icon';

function priceLabel(priceHkd: number, free: string) {
  return priceHkd <= 0 ? free : `HK$${priceHkd}`;
}

/** Large photo card: title, place, time and price set over the image. */
export function ActivityHeroCard({
  activity,
  onPress,
  onSave,
  saved,
}: {
  activity: Activity;
  onPress: () => void;
  onSave?: () => void;
  saved?: boolean;
}) {
  const { lang, t } = useApp();
  return (
    <Pressable onPress={onPress} style={styles.hero}>
      <Image
        source={{ uri: activity.photoUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={220}
      />
      <LinearGradient
        colors={['transparent', 'rgba(16,18,16,0.20)', 'rgba(16,18,16,0.88)']}
        locations={[0, 0.42, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.heroCopy}>
        <Text style={[type.h1, { color: colors.white }]} numberOfLines={2}>
          {activityTitle(activity, lang)}
        </Text>
        <Text style={[type.meta, { color: 'rgba(255,255,255,0.88)', marginTop: 4 }]}>
          {districtLabel(activity.district, lang)} · {formatDay(activity.startsAt, lang)}
        </Text>
        <Text style={[type.metaStrong, { color: colors.white, marginTop: space.x2 }]}>
          {priceLabel(activity.priceHkd, t('free'))}
        </Text>
      </View>
      {onSave ? (
        <Pressable onPress={onSave} hitSlop={10} style={styles.heart}>
          <Icon name="heart" size={16} color={saved ? colors.rose : colors.ink} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

/** Compact row: square thumbnail, title, place · time, price on the right. */
export function ActivityRow({
  activity,
  onPress,
  trailing,
}: {
  activity: Activity;
  onPress: () => void;
  trailing?: string;
}) {
  const { lang, t } = useApp();
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Image
        source={{ uri: activity.photoUrl }}
        style={styles.thumb}
        contentFit="cover"
        transition={180}
      />
      <View style={styles.rowCopy}>
        <Text style={[type.h3, { color: colors.ink }]} numberOfLines={1}>
          {activityTitle(activity, lang)}
        </Text>
        <Text
          style={[type.meta, { color: colors.muted, marginTop: 3 }]}
          numberOfLines={1}
        >
          {districtLabel(activity.district, lang)} · {formatDay(activity.startsAt, lang)}
        </Text>
      </View>
      <Text style={[type.metaStrong, { color: colors.pine }]}>
        {trailing ?? priceLabel(activity.priceHkd, t('free'))}
      </Text>
    </Pressable>
  );
}

/** Tall photo tile with a label at the bottom, used for districts. */
export function PhotoTile({
  photoUrl,
  label,
  onPress,
  width = 78,
  height = 96,
}: {
  photoUrl: string;
  label: string;
  onPress: () => void;
  width?: number;
  height?: number;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.tile, { width, height }]}>
      <Image
        source={{ uri: photoUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={180}
      />
      <LinearGradient
        colors={['transparent', 'rgba(16,18,16,0.80)']}
        style={StyleSheet.absoluteFill}
      />
      <Text style={[type.small, styles.tileLabel]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 190,
    borderRadius: radius.xl,
    overflow: 'hidden',
    /** Ink-tinted so the card still reads if a photo is slow or missing. */
    backgroundColor: '#2A2E2B',
    justifyContent: 'flex-end',
  },
  heroCopy: { padding: space.x4, paddingRight: 64 },
  heart: {
    position: 'absolute',
    right: space.x4,
    bottom: space.x4,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: space.x3,
  },
  thumb: {
    width: 54,
    height: 54,
    borderRadius: radius.sm,
    backgroundColor: '#2A2E2B',
  },
  rowCopy: { flex: 1 },
  tile: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: '#2A2E2B',
    justifyContent: 'flex-end',
  },
  tileLabel: {
    color: colors.white,
    fontWeight: '500',
    paddingHorizontal: space.x2,
    paddingBottom: space.x2,
  },
});
