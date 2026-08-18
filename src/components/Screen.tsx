import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { colors, space, type } from '../theme';

export function Screen({
  children,
  onBack,
  title,
}: {
  children: React.ReactNode;
  onBack?: () => void;
  title?: string;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {onBack || title ? (
        <View style={styles.top}>
          {onBack ? (
            <Pressable onPress={onBack} hitSlop={12} accessibilityRole="button">
              <Text style={[type.body, { color: colors.pine }]}>←</Text>
            </Pressable>
          ) : (
            <View style={{ width: 18 }} />
          )}
          <Text style={[type.bodyStrong, { color: colors.ink, flex: 1, textAlign: 'center' }]}>
            {title ?? ''}
          </Text>
          <View style={{ width: 18 }} />
        </View>
      ) : null}
      {children}
    </SafeAreaView>
  );
}

export function InAppBanner() {
  const { banner } = useApp();
  if (!banner) return null;
  return (
    <View
      pointerEvents="none"
      style={[
        styles.banner,
        { backgroundColor: banner.tone === 'warn' ? colors.danger : colors.pine },
      ]}
    >
      <Text style={[type.meta, { color: colors.paper }]}>{banner.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.screen,
    paddingBottom: space.sm,
    gap: space.md,
  },
  banner: {
    position: 'absolute',
    top: 54,
    left: 20,
    right: 20,
    zIndex: 20,
    padding: 12,
    borderRadius: 12,
  },
});
