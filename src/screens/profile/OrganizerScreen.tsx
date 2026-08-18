import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityCard } from '../../components/ActivityCard';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { SectionHead } from '../../components/Text';
import { useApp } from '../../context/AppContext';
import type { RootNav, RootStackParamList } from '../../navigation/types';
import { listByOrganizer } from '../../services/activities';
import { getUser } from '../../services/auth';
import { isFollowing, toggleFollow } from '../../services/follows';
import { colors, radius, space, type } from '../../theme';

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
        <View style={styles.gutter}>
          <EmptyState title={t('error')} action={t('back')} onAction={() => nav.goBack()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen onBack={() => nav.goBack()} title={t('host')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <View style={styles.head}>
            {host.photoUrl ? (
              <Image
                source={{ uri: host.photoUrl }}
                style={styles.avatar}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.avatar, { backgroundColor: colors.raised }]} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={[type.h1, { color: colors.ink }]}>{host.displayName}</Text>
              <Text style={[type.data, { color: colors.faint, marginTop: space.x1 }]}>
                {String(events.length).padStart(2, '0')} · {t('hostEvents')}
              </Text>
            </View>
          </View>

          {host.bio ? (
            <Text style={[type.body, { color: colors.dim, marginTop: space.x6 }]}>
              {host.bio}
            </Text>
          ) : null}

          {user && user.uid !== uid ? (
            <View style={{ marginTop: space.x8 }}>
              <Button
                label={following ? t('unfollow') : t('follow')}
                variant={following ? 'quiet' : 'primary'}
                onPress={async () => {
                  await toggleFollow(user.uid, uid);
                  showBanner(following ? t('unfollow') : t('following'));
                }}
              />
            </View>
          ) : null}

          <View style={styles.section}>
            <SectionHead label={t('hostEvents')} />
            {events.length === 0 ? (
              <EmptyState title={t('empty')} />
            ) : (
              <View style={{ marginTop: space.x6 }}>
                {events.map((a) => (
                  <ActivityCard
                    key={a.id}
                    activity={a}
                    variant="stack"
                    onPress={() => nav.navigate('Activity', { id: a.id })}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: space.x4, paddingBottom: space.x16 },
  gutter: { paddingHorizontal: space.gutter },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.x4 },
  avatar: { width: 64, height: 64, borderRadius: radius.xs },
  section: { marginTop: space.x12 },
});
