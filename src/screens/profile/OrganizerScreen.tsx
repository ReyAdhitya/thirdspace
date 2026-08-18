import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityCard } from '../../components/ActivityCard';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import type { RootNav, RootStackParamList } from '../../navigation/types';
import { listByOrganizer } from '../../services/activities';
import { getUser } from '../../services/auth';
import { isFollowing, toggleFollow } from '../../services/follows';
import { colors, space, type } from '../../theme';

export function OrganizerScreen() {
  const nav = useNavigation<RootNav>();
  const { uid } = useRoute<RouteProp<RootStackParamList, 'Organizer'>>().params;
  const { t, user, showBanner } = useApp();
  const host = getUser(uid);
  const events = listByOrganizer(uid).filter((a) => a.status === 'published');
  const following = user ? isFollowing(user.uid, uid) : false;

  if (!host) {
    return (
      <Screen onBack={() => nav.goBack()}>
        <EmptyState title={t('error')} />
      </Screen>
    );
  }

  return (
    <Screen onBack={() => nav.goBack()} title={t('host')}>
      <ScrollView contentContainerStyle={{ padding: space.screen, paddingBottom: 40 }}>
        {host.photoUrl ? (
          <Image source={{ uri: host.photoUrl }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.surface2 }]} />
        )}
        <Text style={[type.title, { color: colors.ink, marginTop: 16 }]}>{host.displayName}</Text>
        <Text style={[type.body, { color: colors.muted, marginTop: 8 }]}>
          {host.bio ?? ''}
        </Text>
        {user && user.uid !== uid ? (
          <View style={{ marginTop: 16 }}>
            <Button
              label={following ? t('unfollow') : t('follow')}
              variant={following ? 'ghost' : 'primary'}
              onPress={async () => {
                await toggleFollow(user.uid, uid);
                showBanner(following ? t('unfollow') : t('following'));
              }}
            />
          </View>
        ) : null}
        <Text style={[type.h2, { color: colors.ink, marginTop: 28 }]}>{t('hostEvents')}</Text>
        <View style={{ marginTop: 12 }}>
          {events.map((a) => (
            <View key={a.id} style={{ marginBottom: 16 }}>
              <ActivityCard
                activity={a}
                variant="wide"
                onPress={() => nav.navigate('Activity', { id: a.id })}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 88, height: 88, borderRadius: 44 },
});
