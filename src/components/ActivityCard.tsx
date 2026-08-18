import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { districtLabel } from '../data/districts';
import { formatDay } from '../lib/time';
import type { Activity } from '../types';
import { colors, radius, space, type } from '../theme';
import { PriceText } from './PriceText';

export function ActivityCard({
  activity,
  onPress,
  onHeart,
  saved,
  variant = 'row',
}: {
  activity: Activity;
  onPress: () => void;
  onHeart?: () => void;
  saved?: boolean;
  variant?: 'row' | 'grid' | 'wide';
}) {
  const { lang } = useApp();
  const tall = variant === 'grid' || variant === 'wide';
  return (
    <Pressable
      onPress={onPress}
      style={[styles.wrap, variant === 'grid' && styles.grid]}
    >
      <View style={styles.frame}>
        <Image
          source={{ uri: activity.photoUrl }}
          style={{ width: '100%', height: tall ? 168 : 128 }}
          contentFit="cover"
        />
        <View style={styles.priceTag}>
          <PriceText priceHkd={activity.priceHkd} invert />
        </View>
        {onHeart ? (
          <Pressable onPress={onHeart} style={styles.heart} hitSlop={8}>
            <Text style={{ fontSize: 16 }}>{saved ? '♥' : '♡'}</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={[type.bodyStrong, { color: colors.ink, marginTop: 10 }]} numberOfLines={2}>
        {activity.title}
      </Text>
      <Text style={[type.meta, { color: colors.muted, marginTop: 4 }]}>
        {districtLabel(activity.district, lang)} · {formatDay(activity.startsAt, lang)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 220, marginRight: space.md },
  grid: { width: '48%', marginRight: 0, marginBottom: space.lg },
  frame: {
    backgroundColor: colors.surface2,
    padding: 4,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  priceTag: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
