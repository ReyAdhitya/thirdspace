import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '../components/Icon';
import { colors, space, type } from '../theme';

const ICONS: Record<string, IconName> = {
  Discover: 'search',
  Districts: 'map-pin',
  Tickets: 'tag',
  Profile: 'user',
};

/** Bottom tabs on every platform, thin glyphs, pine when active. */
export function NavBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space.x3) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const label = descriptors[route.key].options.title ?? route.name;
        return (
          <Pressable
            key={route.key}
            style={styles.item}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!event.defaultPrevented) navigation.navigate(route.name);
            }}
          >
            <Icon
              name={ICONS[route.name] ?? 'compass'}
              size={21}
              color={focused ? colors.pine : colors.faint}
            />
            <Text
              style={[
                type.tab,
                {
                  color: focused ? colors.pine : colors.faint,
                  fontWeight: focused ? '600' : '500',
                  marginTop: 3,
                },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.stone,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: space.x2,
  },
  item: { flex: 1, alignItems: 'center', paddingVertical: space.x1 },
});
