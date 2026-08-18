import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { CANVAS_MAX_WIDTH, colors, space, type, useShell } from '../theme';

/**
 * Every screen sits in the same measure: full width on a phone,
 * a centred editorial column on a desktop browser.
 */
export function Screen({
  children,
  onBack,
  title,
  action,
}: {
  children: React.ReactNode;
  onBack?: () => void;
  title?: string;
  action?: { label: string; onPress: () => void };
}) {
  const { t } = useApp();
  const { isDesktop } = useShell();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={[styles.center, isDesktop && styles.centerDesktop]}>
        <View style={[styles.canvas, isDesktop && { maxWidth: CANVAS_MAX_WIDTH }]}>
          {onBack || title || action ? (
            <View style={styles.top}>
              {onBack ? (
                <Pressable onPress={onBack} hitSlop={12} accessibilityRole="button">
                  <Text style={[type.label, { color: colors.dim }]}>{t('back')}</Text>
                </Pressable>
              ) : null}
              <Text
                style={[type.label, { color: colors.faint, flex: 1 }]}
                numberOfLines={1}
              >
                {title ?? ''}
              </Text>
              {action ? (
                <Pressable onPress={action.onPress} hitSlop={12}>
                  <Text style={[type.label, { color: colors.ink }]}>{action.label}</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

export function InAppBanner() {
  const { banner } = useApp();
  const { isDesktop } = useShell();
  if (!banner) return null;
  const warn = banner.tone === 'warn';
  return (
    <View
      pointerEvents="none"
      style={[styles.bannerWrap, isDesktop && styles.bannerWrapDesktop]}
    >
      <View style={styles.banner}>
        <View
          style={[
            styles.bannerMark,
            { backgroundColor: warn ? colors.accent : colors.ink },
          ]}
        />
        <Text style={[type.data, { color: colors.ink, flex: 1 }]}>{banner.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1 },
  centerDesktop: { alignItems: 'center' },
  canvas: { flex: 1, width: '100%' },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x4,
    paddingHorizontal: space.gutter,
    paddingTop: space.x2,
    paddingBottom: space.x3,
  },
  bannerWrap: {
    position: 'absolute',
    left: space.gutter,
    right: space.gutter,
    bottom: Platform.OS === 'web' ? space.x6 : space.x12,
    zIndex: 30,
    alignItems: 'stretch',
  },
  bannerWrapDesktop: { alignItems: 'center' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    maxWidth: 420,
    width: '100%',
    backgroundColor: colors.raised,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    paddingVertical: space.x3,
    paddingHorizontal: space.x4,
  },
  bannerMark: { width: 3, alignSelf: 'stretch' },
});
