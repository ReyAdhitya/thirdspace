import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { SectionHead } from '../../components/Text';
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
        <View style={styles.gutter}>
          <EmptyState title={t('error')} body={t('needLogin')} />
        </View>
      </Screen>
    );
  }

  const events = listPublished({ includeHidden: true });
  const users = listUsers().filter((u) => u.uid !== user.uid);
  const reports = listReports();
  const open = reports.filter((r) => r.status === 'open');

  return (
    <Screen onBack={() => nav.goBack()} title={t('admin')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <View style={styles.summary}>
            <Count label={t('tabDiscover')} value={events.length} />
            <Count label={t('users')} value={users.length} />
            <Count label={t('reportsInbox')} value={open.length} alert={open.length > 0} />
          </View>

          <View style={styles.section}>
            <SectionHead label={t('tabDiscover')} />
            {events.map((a) => (
              <View key={a.id} style={styles.row}>
                <Pressable
                  onPress={() => nav.navigate('Activity', { id: a.id })}
                  style={{ flex: 1 }}
                >
                  <Text style={[type.bodyStrong, { color: colors.ink }]} numberOfLines={1}>
                    {a.title}
                  </Text>
                  <Text style={[type.data, { color: colors.faint, marginTop: space.x1 }]}>
                    {a.status === 'hidden' ? t('hidden') : 'live'}
                    {a.featured ? ` · ${t('featured')}` : ''}
                  </Text>
                </Pressable>
                <View style={styles.actions}>
                  <Action
                    label={a.status === 'hidden' ? t('unhide') : t('hide')}
                    onPress={() =>
                      void setActivityStatus(
                        a.id,
                        a.status === 'hidden' ? 'published' : 'hidden',
                      )
                    }
                  />
                  <Action
                    label={a.featured ? t('unfeature') : t('feature')}
                    onPress={() => void setFeatured(a.id, !a.featured)}
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <SectionHead label={t('users')} />
            {users.map((u) => (
              <View key={u.uid} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={[type.bodyStrong, { color: colors.ink }]}>
                    {u.displayName}
                  </Text>
                  <Text style={[type.data, { color: colors.faint, marginTop: space.x1 }]}>
                    {u.role}
                    {u.banned ? ' · banned' : ''}
                  </Text>
                </View>
                <Action
                  label={u.banned ? t('unban') : t('ban')}
                  danger={!u.banned}
                  onPress={() => void setBanned(u.uid, !u.banned)}
                />
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <SectionHead label={t('reportsInbox')} />
            {reports.length === 0 ? (
              <EmptyState title={t('noReports')} />
            ) : (
              reports.map((r) => (
                <View key={r.id} style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.label, { color: colors.faint }]}>
                      {r.targetType} · {r.status}
                    </Text>
                    <Text style={[type.body, { color: colors.ink, marginTop: space.x2 }]}>
                      {r.reason}
                    </Text>
                    <Text style={[type.meta, { color: colors.faint, marginTop: space.x1 }]}>
                      {getUser(r.reporterId)?.displayName}
                    </Text>
                  </View>
                  {r.status === 'open' ? (
                    <Action
                      label={t('continue')}
                      onPress={() => {
                        void resolveReport(r.id);
                        showBanner(t('reportSent'));
                      }}
                    />
                  ) : null}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Count({
  label,
  value,
  alert,
}: {
  label: string;
  value: number;
  alert?: boolean;
}) {
  return (
    <View>
      <Text style={[type.dataLg, { color: alert ? colors.accent : colors.ink }]}>
        {String(value).padStart(2, '0')}
      </Text>
      <Text style={[type.label, { color: colors.faint, marginTop: space.x1 }]}>
        {label}
      </Text>
    </View>
  );
}

function Action({
  label,
  onPress,
  danger,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={6} style={styles.action}>
      <Text style={[type.label, { color: danger ? colors.accent : colors.dim }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: space.x4, paddingBottom: space.x16 },
  gutter: { paddingHorizontal: space.gutter },
  summary: {
    flexDirection: 'row',
    gap: space.x8,
    paddingBottom: space.x6,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  section: { marginTop: space.x12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x4,
    paddingVertical: space.x4,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  actions: { alignItems: 'flex-end', gap: space.x2 },
  action: { paddingVertical: space.x1 },
});
