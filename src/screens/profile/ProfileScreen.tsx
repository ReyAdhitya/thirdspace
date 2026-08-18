import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityCard } from '../../components/ActivityCard';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { stampKeys } from '../../lib/stamps';
import type { RootNav } from '../../navigation/types';
import { getActivity, listPublished } from '../../services/activities';
import { getUser } from '../../services/auth';
import { followedOrganizerIds } from '../../services/follows';
import { savedIds } from '../../services/saves';
import { ticketsForUser } from '../../services/tickets';
import { colors, radius, space, type } from '../../theme';

export function ProfileScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user } = useApp();

  if (!user) {
    return (
      <Screen>
        <EmptyState title={t('needLogin')} />
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
    .filter(Boolean);
  const stamps = stampKeys(joined.length);
  const follows = followedOrganizerIds(user.uid);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.screen, paddingBottom: 48 }}>
        <Text style={[type.label, { color: colors.pine }]}>{user.role}</Text>
        <Text style={[type.greeting, { color: colors.ink, fontSize: 34, marginTop: 6 }]}>
          {user.displayName}
        </Text>
        {user.bio ? (
          <Text style={[type.body, { color: colors.muted, marginTop: 8 }]}>{user.bio}</Text>
        ) : null}

        <View style={{ marginTop: 20, gap: 10 }}>
          <Button label={t('createEvent')} onPress={() => nav.navigate('CreateActivity', {})} />
          <Button label={t('settings')} variant="ghost" onPress={() => nav.navigate('Settings')} />
          {user.role === 'admin' ? (
            <Button label={t('admin')} variant="ghost" onPress={() => nav.navigate('Admin')} />
          ) : null}
        </View>

        <Text style={[type.h2, { color: colors.ink, marginTop: 32 }]}>{t('stamps')}</Text>
        <Text style={[type.meta, { color: colors.muted, marginTop: 6 }]}>{t('stampsHint')}</Text>
        <View style={styles.stamps}>
          {stamps.length === 0 ? (
            <Text style={[type.meta, { color: colors.muted }]}>{t('stamp1')} — 0</Text>
          ) : (
            stamps.map((k) => (
              <View key={k} style={styles.stamp}>
                <Text style={[type.bodyStrong, { color: colors.pine }]}>{t(k)}</Text>
              </View>
            ))
          )}
        </View>

        <Text style={[type.h2, { color: colors.ink, marginTop: 28 }]}>{t('saved')}</Text>
        {saved.length === 0 ? (
          <EmptyState title={t('noSaved')} />
        ) : (
          saved.map((a) =>
            a ? (
              <View key={a.id} style={{ marginTop: 12 }}>
                <ActivityCard
                  activity={a}
                  variant="wide"
                  onPress={() => nav.navigate('Activity', { id: a.id })}
                />
              </View>
            ) : null,
          )
        )}

        <Text style={[type.h2, { color: colors.ink, marginTop: 28 }]}>{t('footprint')}</Text>
        {past.length === 0 ? (
          <EmptyState title={t('noFootprint')} />
        ) : (
          past.map((tk) => {
            const a = getActivity(tk.activityId);
            if (!a) return null;
            return (
              <Pressable
                key={tk.id}
                onPress={() => nav.navigate('Activity', { id: a.id })}
                style={styles.row}
              >
                <Text style={[type.bodyStrong, { color: colors.ink }]}>{a.title}</Text>
              </Pressable>
            );
          })
        )}

        <Text style={[type.h2, { color: colors.ink, marginTop: 28 }]}>{t('following')}</Text>
        {follows.length === 0 ? (
          <Text style={[type.meta, { color: colors.muted, marginTop: 8 }]}>—</Text>
        ) : (
          follows.map((uid) => (
            <Pressable
              key={uid}
              onPress={() => nav.navigate('Organizer', { uid })}
              style={styles.row}
            >
              <Text style={[type.body, { color: colors.pine }]}>
                → {getUser(uid)?.displayName ?? uid}
              </Text>
            </Pressable>
          ))
        )}

        <Text style={[type.h2, { color: colors.ink, marginTop: 28 }]}>{t('hostEvents')}</Text>
        {listPublished({ includeHidden: true })
          .filter((a) => a.organizerId === user.uid)
          .map((a) => (
            <Pressable
              key={a.id}
              onPress={() => nav.navigate('Activity', { id: a.id })}
              style={styles.row}
            >
              <Text style={[type.bodyStrong, { color: colors.ink }]}>{a.title}</Text>
            </Pressable>
          ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stamps: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  stamp: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.pineSoft,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
});
