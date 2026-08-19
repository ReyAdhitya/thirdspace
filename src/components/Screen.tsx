import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { colors, radius, space, type } from '../theme';
import { Icon, type IconName } from './Icon';

export type ScreenAction = {
  icon?: IconName;
  label?: string;
  onPress: () => void;
};

/**
 * Stone ground for every screen. Optional back chevron, serif title and
 * caption on the left, thin glyph actions on the right.
 */
export function Screen({
  children,
  onBack,
  onClose,
  title,
  caption,
  actions,
  bare,
}: {
  children: React.ReactNode;
  onBack?: () => void;
  onClose?: () => void;
  title?: string;
  caption?: string;
  actions?: ScreenAction[];
  /** Skip the header entirely, e.g. a full-bleed hero. */
  bare?: boolean;
}) {
  const showHeader = !bare && (onBack || onClose || title || actions?.length);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {showHeader ? (
        <View style={styles.header}>
          {onBack ? (
            <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
              <Icon name="chevron-left" size={22} color={colors.ink} />
            </Pressable>
          ) : null}
          {onClose ? (
            <Pressable onPress={onClose} hitSlop={12} style={styles.back}>
              <Icon name="x" size={20} color={colors.ink} />
            </Pressable>
          ) : null}

          <View style={styles.titleBlock}>
            {title ? (
              <Text style={[type.screenTitle, { color: colors.ink }]} numberOfLines={1}>
                {title}
              </Text>
            ) : null}
            {caption ? (
              <Text style={[type.meta, { color: colors.muted, marginTop: 2 }]}>
                {caption}
              </Text>
            ) : null}
          </View>

          {actions?.length ? (
            <View style={styles.actions}>
              {actions.map((a, i) => (
                <Pressable
                  key={`${a.icon ?? a.label}-${i}`}
                  onPress={a.onPress}
                  hitSlop={10}
                >
                  {a.icon ? (
                    <Icon name={a.icon} size={20} color={colors.ink} />
                  ) : (
                    <Text style={[type.meta, { color: colors.muted }]}>{a.label}</Text>
                  )}
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
      {children}
    </SafeAreaView>
  );
}

/** Compact header for pushed screens: back chevron, centred serif title. */
export function StackHeader({
  title,
  caption,
  onBack,
  actions,
}: {
  title: string;
  caption?: string;
  onBack: () => void;
  actions?: ScreenAction[];
}) {
  return (
    <View style={styles.stackHeader}>
      <Pressable onPress={onBack} hitSlop={12}>
        <Icon name="chevron-left" size={22} color={colors.ink} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={[type.h2, { color: colors.ink }]} numberOfLines={1}>
          {title}
        </Text>
        {caption ? (
          <Text style={[type.small, { color: colors.muted }]}>{caption}</Text>
        ) : null}
      </View>
      {actions?.map((a, i) => (
        <Pressable key={i} onPress={a.onPress} hitSlop={10}>
          {a.icon ? <Icon name={a.icon} size={20} color={colors.ink} /> : null}
        </Pressable>
      ))}
    </View>
  );
}

export function InAppBanner() {
  const { banner } = useApp();
  if (!banner) return null;
  const warn = banner.tone === 'warn';
  return (
    <View pointerEvents="none" style={styles.bannerWrap}>
      <View style={[styles.banner, warn && { backgroundColor: colors.ink }]}>
        <Icon
          name={warn ? 'info' : 'check'}
          size={15}
          color={colors.white}
        />
        <Text style={[type.meta, { color: colors.white, flex: 1 }]}>{banner.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.stone },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    paddingHorizontal: space.gutter,
    /** Air under the phone bezel: web has no safe-area inset to lean on. */
    paddingTop: space.x5,
    paddingBottom: space.x4,
  },
  back: { marginLeft: -4 },
  titleBlock: { flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: space.x4 },
  stackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    paddingHorizontal: space.gutter,
    paddingTop: space.x5,
    paddingBottom: space.x3,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  bannerWrap: {
    position: 'absolute',
    left: space.gutter,
    right: space.gutter,
    bottom: 92,
    zIndex: 30,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x2,
    backgroundColor: colors.pine,
    borderRadius: radius.md,
    paddingVertical: space.x3,
    paddingHorizontal: space.x4,
  },
});
