import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityRow } from '../../components/ActivityCard';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { SectionHead } from '../../components/SectionHead';
import { useApp } from '../../context/AppContext';
import { userBio, userName } from '../../lib/localize';
import type { RootNav, RootStackParamList } from '../../navigation/types';
import { listByOrganizer } from '../../services/activities';
import { getUser } from '../../services/auth';
import { isFollowing, toggleFollow } from '../../services/follows';
import { colors, radius, space, type } from '../../theme';

export function OrganizerScreen() {
  const nav = useNavigation<RootNav>();
  const { uid } = useRoute<RouteProp<RootStackParamList, 'Organizer'>>().params;
  const { t, lang, user, showBanner } = useApp();

  const host = getUser(uid);
  const events = listByOrganizer(uid).filter((a) => a.status === 'published');
  const following = user ? isFollowing(user.uid, uid) : false;

  if (!host) {
    return (
      <Screen onBack={() => nav.goBack()}>
        <EmptyState title={t('error')} action={t('back')} onAction={() => nav.goBack()} />
      </Screen>
    );
  }

  const guests = events.reduce((sum, a) => sum + a.joinedCount, 0);

  return (
    <Screen bare>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cover}>
          {events[0] ? (
            <Image
              source={{ uri: events[0].photoUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          ) : null}
          <LinearGradient
            colors={['rgba(16,18,16,0.4)', 'rgba(16,18,16,0.1)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.coverBar}>
            <Pressable onPress={() => nav.goBack()} style={styles.round} hitSlop={6}>
              <Icon name="chevron-left" size={18} color={colors.ink} />
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={() => showBanner(t('report'))}
              style={styles.round}
              hitSlop={6}
            >
              <Icon name="more-horizontal" size={18} color={colors.ink} />
            </Pressable>
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.headRow}>
            {host.photoUrl ? (
              <Image source={{ uri: host.photoUrl }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={[styles.avatar, styles.avatarEmpty]}>
                <Icon name="user" size={24} color={colors.harbor} />
              </View>
            )}
            {user && user.uid !== uid ? (
              <Pressable
                onPress={async () => {
                  await toggleFollow(user.uid, uid);
                  showBanner(following ? t('unfollow') : t('followed'));
                }}
                style={[styles.followBtn, following && styles.followOn]}
              >
                <Text
                  style={[
                    type.small,
                    { color: following ? colors.muted : colors.pine, fontWeight: '600' },
                  ]}
                >
                  {following ? t('followed') : t('followBoard')}
                </Text>
              </Pressable>
            ) : null}
          </View>

          <Text style={[type.h1, { color: colors.ink, marginTop: space.x3 }]}>
            {userName(host, lang)}
          </Text>
          <Text style={[type.meta, { color: colors.muted }]}>
            @{host.email.split('@')[0]}
          </Text>
          {userBio(host, lang) ? (
            <Text style={[type.body, { color: colors.muted, marginTop: space.x3 }]}>
              {userBio(host, lang)}
            </Text>
          ) : null}

          <View style={styles.stats}>
            <Stat label={t('hostStatHeld')} value={events.length} />
            <Stat label={t('hostStatPeople')} value={guests} />
            <Stat label={t('hostStatFollowers')} value={events.length * 12} />
            <Stat label={t('hostStatFollowing')} value={4} />
          </View>

          <View style={styles.block}>
            <SectionHead title={t('hostEventsBoard')} />
            <View style={styles.rows}>
              {events.length === 0 ? (
                <EmptyState title={t('empty')} icon="calendar" />
              ) : (
                events.map((a) => (
                  <ActivityRow
                    key={a.id}
                    activity={a}
                    trailing={`${a.joinedCount} / ${a.capacity}`}
                    onPress={() => nav.navigate('Activity', { id: a.id })}
                  />
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={[type.numeralSm, { color: colors.ink }]}>{value}</Text>
      <Text style={[type.small, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x10 },
  cover: { height: 150, backgroundColor: colors.paper },
  coverBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.x4,
    paddingTop: space.x3,
  },
  round: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    backgroundColor: colors.stone,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    marginTop: -20,
    paddingHorizontal: space.gutter,
    paddingTop: space.x4,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: -44,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.stone,
  },
  avatarEmpty: {
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followBtn: {
    borderWidth: 1,
    borderColor: colors.pine,
    borderRadius: radius.sm,
    paddingHorizontal: space.x3,
    paddingVertical: 6,
  },
  followOn: { borderColor: colors.hairline, backgroundColor: colors.white },
  stats: {
    flexDirection: 'row',
    marginTop: space.x5,
    paddingVertical: space.x4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.hairline,
  },
  stat: { flex: 1, alignItems: 'center' },
  block: { marginTop: space.x6 },
  rows: { marginTop: space.x3, gap: space.x3 },
});
