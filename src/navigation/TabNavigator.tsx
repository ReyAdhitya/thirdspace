import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { useApp } from '../context/AppContext';
import { DistrictsScreen } from '../screens/districts/DistrictsScreen';
import { DiscoverScreen } from '../screens/discover/DiscoverScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { TicketsScreen } from '../screens/tickets/TicketsScreen';
import { colors, useShell } from '../theme';
import { NavBar } from './NavBar';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  const { t } = useApp();
  const { isDesktop } = useShell();

  return (
    <Tab.Navigator
      tabBar={(props) => <NavBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarPosition: isDesktop ? 'left' : 'bottom',
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{ title: t('tabDiscover') }}
      />
      <Tab.Screen
        name="Districts"
        component={DistrictsScreen}
        options={{ title: t('tabDistricts') }}
      />
      <Tab.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{ title: t('tabTickets') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t('tabProfile') }}
      />
    </Tab.Navigator>
  );
}
