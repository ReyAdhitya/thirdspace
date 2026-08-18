import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityCard } from '../../components/ActivityCard';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { SectionHead } from '../../components/Text';
import { useApp } from '../../context/AppContext';
import { stampKeys } from '../../lib/stamps';
import type { RootNav } from '../../navigation/types';
import { getActivity, listPublished } from '../../services/activities';
import { getUser } from '../../services/auth';
import { followedOrganizerIds } from '../../services/follows';
import { savedIds } from '../../services/saves';
import { ticketsForUser } from '../../services/tickets';
import { colors, space, type } from '../../theme';

export function ProfileScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user } = useApp();

  if (!user) {
    return (
      <Screen>
        <View style={styles.gutter}>
          <EmptyState title={t('needLogin')} />
        </View>
      </Screen>
    );
  }

  const tickets = ticketsForUser(user.uid);
  const joined = tickets.filter((x) => x.status === 'joined');
  const past = joined.filter((tk) => {
    const a = getActivity(tk.activityId);
    return a ? new Date(a.endsAt).getTime() < Date.now() : false;
  });
  const saved = savedIds(user.uid)
    .map((id) => getActivity(id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const stamps = stampKeys(joined.length);
  const follows = followedOrganizerIds(user.uid);
  const hosting = listPublished({ includeHidden: true }).filter(
    (a) => a.organizerId === user.uid,
  );

  return (
    <Screen action={{ label: t('settings'), onPress: () => nav.navigate('Settings') }}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <Text style={[type.label, { color: colors.dim }]}>{user.role}</Text>
          <Text style={[type.display, { color: colors.ink, marginTop: space.x3 }]}>
            {user.displayName}
          </Text>
          {user.bio ? (
            <Text
              style={[type.body, { color: colors.dim, marginTop: space.x3, maxWidth: 380 }]}
            >
              {user.bio}
            </Text>
          ) : null}

          <View style={styles.stats}>
            <Stat label={t('joined')} value={joined.length} />
            <Stat label={t('saved')} value={saved.length} />
            <Stat label={t('following')} value={follows.length} />
          </View>

          <View style={{ marginTop: space.x8 }}>
            <Button
              label={t('createEvent')}
              onPress={() => nav.navigate('CreateActivity', {})}
            />
            {user.role === 'admin' ? (
              <View style={{ marginTop: space.x2 }}>
                <Button
                  label={t('admin')}
                  variant="quiet"
                  onPress={() => nav.navigate('Admin')}
                />
              </View>
            ) : null}
          </View>

          <View style={styles.section}>
            <SectionHead label={t('stamps')} />
            <Text style={[type.meta, { color: colors.faint, marginTop: space.x4 }]}>
              {t('stampsHint')}
            </Text>
            <View style={styles.stampRow}>
              {stamps.length === 0 ? (
                <Text style={[type.data, { color: colors.faint }]}>—</Text>
              ) : (
                stamps.map((k) => (
                  <View key={k} style={styles.stamp}>
                    <View style={styles.stampMark} />
                    <Text style={[type.bodySm, { color: colors.ink }]}>{t(k)}</Text>
                  </View>
                ))
              )}
            </View>
          </View>

          <View style={styles.section}>
            <SectionHead label={t('saved')} />
            {saved.length === 0 ? (
              <EmptyState title={t('noSaved')} />
            ) : (
              <View style={{ marginTop: space.x4 }}>
                {saved.map((a) => (
                  <ActivityCard
                    key={a.id}
                    activity={a}
                    variant="line"
                    onPress={() => nav.navigate('Activity', { id: a.id })}
                  />
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <SectionHead label={t('footprint')} />
            {past.length === 0 ? (
              <EmptyState title={t('noFootprint')} />
            ) : (
              <View style={{ marginTop: space.x4 }}>
                {past.map((tk) => {
                  const a = getActivity(tk.activityId);
                  if (!a) return null;
                  return (
                    <ActivityCard
                      key={tk.id}
                      activity={a}
                      variant="line"
                      onPress={() => nav.navigate('Activity', { id: a.id })}
                    />
                  );
                })}
              </View>
            )}
          </View>

          {follows.length > 0 ? (
            <View style={styles.section}>
              <SectionHead label={t('following')} />
              <View style={{ marginTop: space.x4 }}>
                {follows.map((uid) => (
                  <Pressable
                    key={uid}
                    onPress={() => nav.navigate('Organizer', { uid })}
                    style={styles.row}
                  >
                    <Text style={[type.bodyStrong, { color: colors.ink, flex: 1 }]}>
                      {getUser(uid)?.displayName ?? uid}
                    </Text>
                    <Text style={[type.label, { color: colors.faint }]}>{t('host')}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {hosting.length > 0 ? (
            <View style={styles.section}>
              <SectionHead label={t('hostEvents')} />
              <View style={{ marginTop: space.x4 }}>
                {hosting.map((a) => (
                  <ActivityCard
                    key={a.id}
                    activity={a}
                    variant="line"
                    onPress={() => nav.navigate('Activity', { id: a.id })}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View>
      <Text style={[type.dataLg, { color: colors.ink }]}>
        {String(value).padStart(2, '0')}
      </Text>
      <Text style={[type.label, { color: colors.faint, marginTop: space.x1 }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: space.x2, paddingBottom: space.x16 },
  gutter: { paddingHorizontal: space.gutter },
  stats: {
    flexDirection: 'row',
    gap: space.x8,
    marginTop: space.x8,
    paddingTop: space.x6,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  section: { marginTop: space.x12 },
  stampRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.x6, marginTop: space.x4 },
  stamp: { flexDirection: 'row', alignItems: 'center', gap: space.x2 },
  stampMark: { width: 6, height: 6, backgroundColor: colors.accent },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.x4,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
});
