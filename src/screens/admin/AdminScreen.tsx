import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import type { RootNav } from '../../navigation/types';
import {
  listPublished,
  setActivityStatus,
  setFeatured,
} from '../../services/activities';
import { getUser, listUsers, setBanned } from '../../services/auth';
import { listReports, resolveReport } from '../../services/reports';
import { colors, space, type } from '../../theme';

export function AdminScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, showBanner } = useApp();

  if (!user || user.role !== 'admin') {
    return (
      <Screen onBack={() => nav.goBack()} title={t('admin')}>
        <EmptyState title={t('error')} body={t('needLogin')} />
      </Screen>
    );
  }

  const events = listPublished({ includeHidden: true });
  const users = listUsers().filter((u) => u.uid !== user.uid);
  const reports = listReports();

  return (
    <Screen onBack={() => nav.goBack()} title={t('admin')}>
      <ScrollView contentContainerStyle={{ padding: space.screen, paddingBottom: 48 }}>
        <Text style={[type.h2, { color: colors.ink }]}>{t('tabDiscover')}</Text>
        {events.map((a) => (
          <View key={a.id} style={styles.card}>
            <Pressable onPress={() => nav.navigate('Activity', { id: a.id })}>
              <Text style={[type.bodyStrong, { color: colors.ink }]}>{a.title}</Text>
              <Text style={[type.meta, { color: colors.muted }]}>
                {a.status} · {a.featured ? t('featured') : ''}
              </Text>
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <Mini
                label={a.status === 'hidden' ? t('unhide') : t('hide')}
                onPress={() =>
                  void setActivityStatus(
                    a.id,
                    a.status === 'hidden' ? 'published' : 'hidden',
                  )
                }
              />
              <Mini
                label={a.featured ? t('unfeature') : t('feature')}
                onPress={() => void setFeatured(a.id, !a.featured)}
              />
            </View>
          </View>
        ))}

        <Text style={[type.h2, { color: colors.ink, marginTop: 24 }]}>{t('users')}</Text>
        {users.map((u) => (
          <View key={u.uid} style={styles.card}>
            <Text style={[type.bodyStrong, { color: colors.ink }]}>
              {u.displayName} · {u.email}
            </Text>
            <Text style={[type.meta, { color: colors.muted }]}>
              {u.role}
              {u.banned ? ` · ${t('banned')}` : ''}
            </Text>
            <View style={{ marginTop: 10 }}>
              <Mini
                label={u.banned ? t('unban') : t('ban')}
                onPress={() => void setBanned(u.uid, !u.banned)}
              />
            </View>
          </View>
        ))}

        <Text style={[type.h2, { color: colors.ink, marginTop: 24 }]}>{t('reportsInbox')}</Text>
        {reports.length === 0 ? (
          <EmptyState title={t('noReports')} />
        ) : (
          reports.map((r) => (
            <View key={r.id} style={styles.card}>
              <Text style={[type.meta, { color: colors.muted }]}>
                {r.targetType} · {r.targetId} · {r.status}
              </Text>
              <Text style={[type.body, { color: colors.ink, marginTop: 6 }]}>{r.reason}</Text>
              <Text style={[type.meta, { color: colors.muted, marginTop: 4 }]}>
                {getUser(r.reporterId)?.displayName}
              </Text>
              {r.status === 'open' ? (
                <View style={{ marginTop: 10 }}>
                  <Button
                    label="OK"
                    variant="ghost"
                    onPress={() => {
                      void resolveReport(r.id);
                      showBanner(t('reportSent'));
                    }}
                  />
                </View>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

function Mini({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.mini}>
      <Text style={[type.meta, { color: colors.pine }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.line,
  },
  mini: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.pine,
  },
});
