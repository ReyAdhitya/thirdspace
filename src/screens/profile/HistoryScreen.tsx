import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityRow } from '../../components/ActivityCard';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { SectionHead } from '../../components/SectionHead';
import { useApp } from '../../context/AppContext';
import { JOIN_BADGES } from '../../data/badges';
import type { RootNav } from '../../navigation/types';
import { getActivity } from '../../services/activities';
import { ticketsForUser } from '../../services/tickets';
import { colors, radius, space, type } from '../../theme';

export function HistoryScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user } = useApp();

  if (!user) {
    return (
      <Screen onBack={() => nav.goBack()} title={t('history')}>
        <EmptyState title={t('needLogin')} icon="clock" />
      </Screen>
    );
  }

  const joined = ticketsForUser(user.uid).filter((x) => x.status === 'joined');
  const attended = joined.length;
  const journeyEvents = joined
    .map((tk) => getActivity(tk.activityId))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .sort(
      (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
    );

  return (
    <Screen onBack={() => nav.goBack()} title={t('history')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.gutter, styles.block]}>
          <SectionHead title={t('journey')} />
          <View style={styles.rows}>
            {journeyEvents.length === 0 ? (
              <EmptyState title={t('noJourneyYet')} body={t('noFootprint')} icon="clock" />
            ) : (
              journeyEvents.map((a) => (
                <ActivityRow
                  key={a.id}
                  activity={a}
                  onPress={() => nav.navigate('Activity', { id: a.id })}
                />
              ))
            )}
          </View>
        </View>

        <View style={[styles.gutter, styles.block]}>
          <SectionHead title={t('impressions')} />
          <View style={styles.badges}>
            {JOIN_BADGES.map((b) => {
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
          <View style={styles.badgeList}>
            {JOIN_BADGES.map((b) => {
              const earned = attended >= b.at;
              return (
                <View key={b.icon} style={styles.badgeRow}>
                  <View
                    style={[
                      styles.badgeMark,
                      earned && { backgroundColor: colors.pineSoft },
                    ]}
                  >
                    <Icon
                      name={b.icon}
                      size={17}
                      color={earned ? colors.pine : colors.faint}
                    />
                  </View>
                  <Text
                    style={[
                      type.bodyStrong,
                      { color: earned ? colors.ink : colors.muted, flex: 1 },
                    ]}
                  >
                    {t(b.nameKey)}
                  </Text>
                  <Text
                    style={[type.small, { color: earned ? colors.pine : colors.faint }]}
                  >
                    {earned
                      ? t('badgeUnlocked')
                      : t('badgeLocked').replace('{n}', String(b.at))}
                  </Text>
                </View>
              );
            })}
            <Text style={[type.small, { color: colors.faint, marginTop: space.x2 }]}>
              {t('stampsHint')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x10 },
  gutter: { paddingHorizontal: space.gutter },
  block: { marginTop: space.x5 },
  rows: { marginTop: space.x3, gap: space.x3 },
  badges: { flexDirection: 'row', gap: space.x2, marginTop: space.x3 },
  badge: {
    flex: 1,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeList: { marginTop: space.x4 },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    paddingVertical: space.x3,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  badgeMark: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
