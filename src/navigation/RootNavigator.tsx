import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { useApp } from '../context/AppContext';
import { AdminScreen } from '../screens/admin/AdminScreen';
import { InterestsScreen } from '../screens/auth/InterestsScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ActivityScreen } from '../screens/discover/ActivityScreen';
import { CreateActivityScreen } from '../screens/organizer/CreateActivityScreen';
import { OrganizerScreen } from '../screens/profile/OrganizerScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { CheckoutScreen } from '../screens/tickets/CheckoutScreen';
import { colors, type } from '../theme';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';
import { StyleSheet, Text, View } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { ready, bootError, user, t, retry } = useApp();

  if (!ready) return <Loading label={t('loading')} />;

  if (bootError) {
    return (
      <View style={styles.err}>
        <Text style={[type.h2, { color: colors.ink }]}>{t('error')}</Text>
        <Text style={[type.body, { color: colors.muted, marginVertical: 12 }]}>{bootError}</Text>
        <Button label={t('retry')} onPress={retry} />
      </View>
    );
  }

  const needInterests = Boolean(user && user.onboarded === false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : needInterests ? (
        <Stack.Screen name="Interests" component={InterestsScreen} />
      ) : (
        <>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="Activity" component={ActivityScreen} />
          <Stack.Screen name="Organizer" component={OrganizerScreen} />
          <Stack.Screen name="CreateActivity" component={CreateActivityScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Admin" component={AdminScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  err: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.paper },
});
