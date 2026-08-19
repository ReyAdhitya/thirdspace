import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, radius, space, type } from '../theme';

export type RegionId = 'nt' | 'kowloon' | 'island';

/**
 * Stylised three-region map: New Territories, Kowloon, Hong Kong Island.
 * Simplified silhouettes, not survey-accurate — it is a wayfinding device.
 */
export function HongKongMap({
  active,
  onPick,
  labels,
}: {
  active: RegionId | null;
  onPick: (id: RegionId) => void;
  labels: Record<RegionId, string>;
}) {
  const fill = (id: RegionId) =>
    active === id ? colors.pine : active === null ? colors.harbor : '#B7C6C0';

  return (
    <View style={styles.card}>
      <Svg width="100%" height="100%" viewBox="0 0 320 210" style={StyleSheet.absoluteFill}>
        {/* New Territories: broad northern mass. */}
        <Path
          d="M36 26c22-12 58-16 92-10 30 5 58 2 84 10 22 7 34 22 30 38-3 14-20 20-38 22-26 3-44 14-70 15-30 1-52-6-76-14-20-7-34-16-36-30-2-13 4-24 14-31z"
          fill={fill('nt')}
          opacity={0.95}
        />
        {/* Kowloon peninsula: hanging south from the mainland. */}
        <Path
          d="M126 106c20-4 44-3 60 4 12 5 16 16 10 26-6 11-22 16-40 16-20 0-36-6-42-16-6-11-2-25 12-30z"
          fill={fill('kowloon')}
          opacity={0.95}
        />
        {/* Hong Kong Island: elongated island across the harbour. */}
        <Path
          d="M112 172c26-9 62-10 88-3 16 4 24 12 20 19-4 8-20 12-42 13-28 1-52-2-66-8-11-5-11-16 0-21z"
          fill={fill('island')}
          opacity={0.95}
        />
      </Svg>

      <Pressable onPress={() => onPick('nt')} style={[styles.pin, styles.pinNt]}>
        <Text style={[type.small, styles.pinText]}>{labels.nt}</Text>
      </Pressable>
      <Pressable onPress={() => onPick('kowloon')} style={[styles.pin, styles.pinKln]}>
        <Text style={[type.small, styles.pinText]}>{labels.kowloon}</Text>
      </Pressable>
      <Pressable onPress={() => onPick('island')} style={[styles.pin, styles.pinIsl]}>
        <Text style={[type.small, styles.pinText]}>{labels.island}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 210,
    borderRadius: radius.xl,
    backgroundColor: colors.pineSoft,
    overflow: 'hidden',
  },
  pin: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: space.x3,
    paddingVertical: 5,
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  pinText: { color: colors.ink, fontWeight: '600' },
  pinNt: { left: '14%', top: '14%' },
  pinKln: { left: '44%', top: '55%' },
  pinIsl: { left: '58%', top: '84%' },
});
