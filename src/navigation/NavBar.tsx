import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { SIDEBAR_WIDTH, colors, space, type, useShell } from '../theme';

/**
 * One nav, two shapes: a word row along the bottom of a phone, a
 * standing column on a desktop browser. Labels only — no icon set.
 */
export function NavBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { isDesktop } = useShell();
  const { t, user } = useApp();

  const items = state.routes.map((route, index) => ({
    key: route.key,
    name: route.name,
    label: descriptors[route.key].options.title ?? route.name,
    focused: state.index === index,
    onPress: () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!event.defaultPrevented) navigation.navigate(route.name);
    },
  }));

  if (isDesktop) {
    return (
      <View style={styles.sidebar}>
        <View style={styles.brand}>
          <Text style={[type.h2, { color: colors.ink }]}>{t('appName')}</Text>
          <View style={styles.brandMark} />
        </View>

        <View style={styles.sideItems}>
          {items.map((item) => (
            <Pressable key={item.key} onPress={item.onPress} style={styles.sideItem}>
              <View
                style={[
                  styles.sideMark,
                  { backgroundColor: item.focused ? colors.accent : 'transparent' },
                ]}
              />
              <Text
                style={[
                  type.bodyStrong,
                  { color: item.focused ? colors.ink : colors.dim },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {user ? (
          <View style={styles.sideFoot}>
            <Text style={[type.label, { color: colors.faint }]}>{user.role}</Text>
            <Text
              style={[type.bodySm, { color: colors.dim, marginTop: space.x1 }]}
              numberOfLines={1}
            >
              {user.displayName}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.bottom}>
      {items.map((item) => (
        <Pressable key={item.key} onPress={item.onPress} style={styles.bottomItem}>
          <View
            style={[
              styles.topMark,
              { backgroundColor: item.focused ? colors.accent : 'transparent' },
            ]}
          />
          <Text
            style={[type.tab, { color: item.focused ? colors.ink : colors.faint }]}
            numberOfLines={1}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingBottom: space.x4,
  },
  bottomItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: space.x3,
  },
  topMark: {
    height: 2,
    width: 18,
    marginBottom: space.x2,
  },

  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.bg,
    borderRightWidth: 1,
    borderRightColor: colors.hairline,
    paddingVertical: space.x8,
    paddingHorizontal: space.x6,
    justifyContent: 'space-between',
  },
  brand: { gap: space.x3 },
  brandMark: { width: 20, height: 2, backgroundColor: colors.accent },
  sideItems: { gap: space.x4, flex: 1, marginTop: space.x12 },
  sideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    paddingVertical: space.x1,
  },
  sideMark: { width: 2, height: 16 },
  sideFoot: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: space.x4,
  },
});
