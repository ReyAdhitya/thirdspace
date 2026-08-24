import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { ArchMark } from '../components/Logo';
import { useApp } from '../context/AppContext';
import { AdminScreen } from '../screens/admin/AdminScreen';
import { InterestsScreen } from '../screens/auth/InterestsScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ActivityScreen } from '../screens/discover/ActivityScreen';
import { ChatScreen } from '../screens/discover/ChatScreen';
import { CreateActivityScreen } from '../screens/organizer/CreateActivityScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { FollowingScreen } from '../screens/profile/FollowingScreen';
import { HistoryScreen } from '../screens/profile/HistoryScreen';
import { OrganizerScreen } from '../screens/profile/OrganizerScreen';
import { SavedScreen } from '../screens/profile/SavedScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { YourEventsScreen } from '../screens/profile/YourEventsScreen';
import { CheckoutScreen } from '../screens/tickets/CheckoutScreen';
import { colors, space, type } from '../theme';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { ready, bootError, user, t, retry } = useApp();

  if (!ready) return <Loading label={t('loading')} />;

  if (bootError) {
    return (
      <View style={styles.err}>
        <ArchMark size={44} />
        <Text style={[type.h1, { color: colors.ink, marginTop: space.x5 }]}>
          {t('error')}
        </Text>
        <Text style={[type.meta, { color: colors.muted, marginTop: space.x2 }]}>
          {bootError}
        </Text>
        <View style={styles.action}>
          <Button label={t('retry')} onPress={retry} />
        </View>
      </View>
    );
  }

  const needInterests = Boolean(user && user.onboarded === false);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.stone },
      }}
    >
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : needInterests ? (
        <Stack.Screen name="Interests" component={InterestsScreen} />
      ) : (
        <>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="Activity" component={ActivityScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Organizer" component={OrganizerScreen} />
          <Stack.Screen name="CreateActivity" component={CreateActivityScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Admin" component={AdminScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="YourEvents" component={YourEventsScreen} />
          <Stack.Screen name="Saved" component={SavedScreen} />
          <Stack.Screen name="Following" component={FollowingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  err: {
    flex: 1,
    justifyContent: 'center',
    padding: space.x6,
    backgroundColor: colors.stone,
  },
  action: { marginTop: space.x6 },
});
