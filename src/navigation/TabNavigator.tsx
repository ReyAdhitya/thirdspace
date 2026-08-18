import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import React from 'react';

import { useApp } from '../context/AppContext';
import { DistrictsScreen } from '../screens/districts/DistrictsScreen';
import { DiscoverScreen } from '../screens/discover/DiscoverScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { TicketsScreen } from '../screens/tickets/TicketsScreen';
import { colors, type } from '../theme';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  const { t } = useApp();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.pine,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.line,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: type.tab,
      }}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: t('tabDiscover'),
          tabBarIcon: ({ color }) => <Feather name="compass" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Districts"
        component={DistrictsScreen}
        options={{
          title: t('tabDistricts'),
          tabBarIcon: ({ color }) => <Feather name="map-pin" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{
          title: t('tabTickets'),
          tabBarIcon: ({ color }) => <Feather name="bookmark" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t('tabProfile'),
          tabBarIcon: ({ color }) => <Feather name="user" size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
