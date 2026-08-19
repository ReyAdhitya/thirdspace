import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityRow } from '../../components/ActivityCard';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Icon, type IconName } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { SectionHead } from '../../components/SectionHead';
import { useApp } from '../../context/AppContext';
import { districtLabel } from '../../data/districts';
import type { RootNav } from '../../navigation/types';
import { getActivity, listPublished } from '../../services/activities';
import { getUser } from '../../services/auth';
import { followedOrganizerIds } from '../../services/follows';
import { savedIds } from '../../services/saves';
import { ticketsForUser } from '../../services/tickets';
import { colors, radius, space, type } from '../../theme';

/** Badge shelf from the board: five cream tiles with thin glyphs. */
const BADGES: { icon: IconName; at: number }[] = [
  { icon: 'feather', at: 1 },
  { icon: 'camera', at: 2 },
  { icon: 'map-pin', at: 3 },
  { icon: 'music', at: 5 },
  { icon: 'coffee', at: 8 },
];

export function ProfileScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, lang } = useApp();

  if (!user) {
    return (
      <Screen title="Profile" caption={t('profileCaption')}>
        <EmptyState title={t('needLogin')} icon="user" />
      </Screen>
    );
  }

  const tickets = ticketsForUser(user.uid);
  const joined = tickets.filter((x) => x.status === 'joined');
  const saved = savedIds(user.uid)
    .map((id) => getActivity(id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const follows = followedOrganizerIds(user.uid);
  const hosting = listPublished({ includeHidden: true }).filter(
    (a) => a.organizerId === user.uid,
  );

  const attended = joined.length;
  const level = Math.max(1, Math.floor(attended / 3) + 1);
  const toNext = (level * 3) - attended;

  return (
    <Screen
      actions={[{ icon: 'settings', onPress: () => nav.navigate('Settings') }]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.gutter, styles.head]}>
          {user.photoUrl ? (
            <Image source={{ uri: user.photoUrl }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarEmpty]}>
              <Icon name="user" size={26} color={colors.harbor} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={[type.h1, { color: colors.ink }]}>{user.displayName}</Text>
            <Text style={[type.meta, { color: colors.muted }]}>
              @{user.email.split('@')[0]}
            </Text>
            <Text style={[type.small, { color: colors.faint, marginTop: 2 }]}>
              {districtLabel(user.homeDistrict, lang)} · Hong Kong
            </Text>
          </View>
        </View>

        <View style={[styles.gutter, styles.stats]}>
          <Stat label={t('statAttended')} value={attended} />
          <Stat label={t('statSaved')} value={saved.length} />
          <Stat label={t('statFollowing')} value={follows.length} />
          <Stat label={t('statFans')} value={hosting.length * 5} />
        </View>

        <View style={[styles.gutter, styles.block]}>
          <SectionHead title={t('journey')} action={t('seeAllBoard')} onAction={() => {}} />
          <View style={styles.journey}>
            <View style={{ flex: 1 }}>
              <Text style={[type.small, { color: colors.muted }]}>{t('journeyLevel')}</Text>
              <Text style={[type.h2, { color: colors.ink, marginTop: 2 }]}>
                {t('explorer')} Lv.{level}
              </Text>
              <Text style={[type.small, { color: colors.muted, marginTop: space.x1 }]}>
                {t('nextLevelPre')} {toNext} {t('nextLevelPost')}
              </Text>
            </View>
            <View style={styles.medal}>
              <Icon name="award" size={26} color={colors.pine} />
            </View>
          </View>
        </View>

        <View style={[styles.gutter, styles.block]}>
          <SectionHead title={t('impressions')} action={t('seeAllBoard')} onAction={() => {}} />
          <View style={styles.badges}>
            {BADGES.map((b) => {
              const earned = attended >= b.at;
              return (
                <View
                  key={b.icon}
                  style={[styles.badge, earned && { backgroundColor: colors.pineSoft }]}
                >
                  <Icon
                    name={b.icon}
                    size={19}
                    color={earned ? colors.pine : colors.faint}
                  />
                </View>
              );
            })}
          </View>
        </View>

        <View style={[styles.gutter, styles.block]}>
          <SectionHead title={t('savedActivities')} />
          <View style={styles.rows}>
            {saved.length === 0 ? (
              <EmptyState title={t('noSaved')} icon="heart" />
            ) : (
              saved.map((a) => (
                <ActivityRow
                  key={a.id}
                  activity={a}
                  onPress={() => nav.navigate('Activity', { id: a.id })}
                />
              ))
            )}
          </View>
        </View>

        {follows.length > 0 ? (
          <View style={[styles.gutter, styles.block]}>
            <SectionHead title={t('following')} />
            <View style={styles.rows}>
              {follows.map((uid) => {
                const h = getUser(uid);
                return (
                  <Pressable
                    key={uid}
                    onPress={() => nav.navigate('Organizer', { uid })}
                    style={styles.hostRow}
                  >
                    {h?.photoUrl ? (
                      <Image
                        source={{ uri: h.photoUrl }}
                        style={styles.hostAvatar}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={[styles.hostAvatar, { backgroundColor: colors.paper }]} />
                    )}
                    <Text style={[type.bodyStrong, { color: colors.ink, flex: 1 }]}>
                      {h?.displayName ?? uid}
                    </Text>
                    <Icon name="chevron-right" size={16} color={colors.faint} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        <View style={[styles.gutter, styles.block]}>
          <Button
            label={t('createEvent')}
            icon="plus"
            onPress={() => nav.navigate('CreateActivity', {})}
          />
          {user.role === 'admin' ? (
            <View style={{ marginTop: space.x3 }}>
              <Button
                label={t('reportsTitle')}
                variant="white"
                icon="shield"
                onPress={() => nav.navigate('Admin')}
              />
            </View>
          ) : null}
        </View>

        {hosting.length > 0 ? (
          <View style={[styles.gutter, styles.block]}>
            <SectionHead title={t('hostEvents')} />
            <View style={styles.rows}>
              {hosting.map((a) => (
                <ActivityRow
                  key={a.id}
                  activity={a}
                  trailing={`${a.joinedCount} / ${a.capacity}`}
                  onPress={() => nav.navigate('Activity', { id: a.id })}
                />
              ))}
            </View>
          </View>
        ) : null}
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
  gutter: { paddingHorizontal: space.gutter },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.x4 },
  avatar: { width: 64, height: 64, borderRadius: radius.pill },
  avatarEmpty: {
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    marginTop: space.x6,
    paddingVertical: space.x4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.hairline,
  },
  stat: { flex: 1, alignItems: 'center' },
  block: { marginTop: space.x6 },
  journey: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x4,
    backgroundColor: colors.paper,
    borderRadius: radius.xl,
    padding: space.x4,
    marginTop: space.x3,
  },
  medal: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badges: { flexDirection: 'row', gap: space.x2, marginTop: space.x3 },
  badge: {
    flex: 1,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rows: { marginTop: space.x3, gap: space.x3 },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: space.x3,
  },
  hostAvatar: { width: 36, height: 36, borderRadius: radius.pill },
});
