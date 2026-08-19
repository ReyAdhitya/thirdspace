import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { SectionHead, Segments } from '../../components/SectionHead';
import { useApp } from '../../context/AppContext';
import { hkParts } from '../../lib/time';
import type { RootNav } from '../../navigation/types';
import {
  getActivity,
  listPublished,
  setActivityStatus,
  setFeatured,
} from '../../services/activities';
import { getUser, listUsers, setBanned } from '../../services/auth';
import { listReports, resolveReport } from '../../services/reports';
import { colors, radius, space, type } from '../../theme';

type Tab = 'pending' | 'processed' | 'all';

export function AdminScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, showBanner } = useApp();
  const [tab, setTab] = useState<Tab>('pending');
  const [showEvents, setShowEvents] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <Screen onBack={() => nav.goBack()} title={t('reportsTitle')}>
        <EmptyState title={t('error')} body={t('needLogin')} icon="shield" />
      </Screen>
    );
  }

  const reports = listReports();
  const open = reports.filter((r) => r.status === 'open');
  const done = reports.filter((r) => r.status === 'resolved');
  const shown = tab === 'pending' ? open : tab === 'processed' ? done : reports;

  const events = listPublished({ includeHidden: true });
  const users = listUsers().filter((u) => u.uid !== user.uid);

  return (
    <Screen onBack={() => nav.goBack()} title={t('reportsTitle')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <Segments
            value={tab}
            onChange={setTab}
            items={[
              { id: 'pending', label: `${t('pendingTab')}(${open.length})` },
              { id: 'processed', label: t('processedTab') },
              { id: 'all', label: t('allTab') },
            ]}
          />
        </View>

        <View style={[styles.gutter, styles.list]}>
          {shown.length === 0 ? (
            <EmptyState title={t('noReports')} icon="shield" />
          ) : (
            shown.map((r) => {
              const at = hkParts(r.createdAt);
              const target =
                r.targetType === 'event' ? getActivity(r.targetId) : undefined;
              const reporter = getUser(r.reporterId);
              return (
                <View key={r.id} style={styles.card}>
                  {target?.photoUrl ? (
                    <Image
                      source={{ uri: target.photoUrl }}
                      style={styles.thumb}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={[styles.thumb, styles.thumbEmpty]}>
                      <Icon name="user" size={18} color={colors.harbor} />
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={[type.metaStrong, { color: colors.ink }]}>
                      {t('reportReasonLabel')}: {r.reason}
                    </Text>
                    <Text style={[type.small, { color: colors.muted, marginTop: 3 }]}>
                      {t('reporterLabel')}: {reporter?.email ?? r.reporterId}
                    </Text>
                    <Text style={[type.small, { color: colors.faint, marginTop: 2 }]}>
                      {Number(at.month)}月{at.day}日 {at.hour}:{at.minute} ·{' '}
                      {r.targetType}
                    </Text>
                    <View style={styles.actions}>
                      <Pressable
                        onPress={() => {
                          if (r.targetType === 'event') {
                            nav.navigate('Activity', { id: r.targetId });
                          } else {
                            nav.navigate('Organizer', { uid: r.targetId });
                          }
                        }}
                        style={styles.ghostBtn}
                      >
                        <Text style={[type.small, { color: colors.ink, fontWeight: '600' }]}>
                          {t('reviewAction')}
                        </Text>
                      </Pressable>
                      {r.status === 'open' ? (
                        <Pressable
                          onPress={() => {
                            void resolveReport(r.id);
                            showBanner(t('resolveAction'));
                          }}
                          style={styles.pineBtn}
                        >
                          <Text
                            style={[type.small, { color: colors.white, fontWeight: '600' }]}
                          >
                            {t('resolveAction')}
                          </Text>
                        </Pressable>
                      ) : (
                        <View style={styles.doneTag}>
                          <Icon name="check" size={13} color={colors.pine} />
                          <Text style={[type.small, { color: colors.pine }]}>
                            {t('processedTab')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={[styles.gutter, styles.block]}>
          <SectionHead
            title={t('tabDiscover')}
            action={showEvents ? t('clear') : t('seeAllBoard')}
            onAction={() => setShowEvents((v) => !v)}
          />
          {showEvents ? (
            <View style={styles.rows}>
              {events.map((a) => (
                <View key={a.id} style={styles.modRow}>
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => nav.navigate('Activity', { id: a.id })}
                  >
                    <Text style={[type.metaStrong, { color: colors.ink }]} numberOfLines={1}>
                      {a.title}
                    </Text>
                    <Text style={[type.small, { color: colors.faint, marginTop: 2 }]}>
                      {a.status === 'hidden' ? t('hidden') : 'live'}
                      {a.featured ? ` · ${t('featured')}` : ''}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      void setActivityStatus(
                        a.id,
                        a.status === 'hidden' ? 'published' : 'hidden',
                      )
                    }
                    style={styles.ghostBtn}
                  >
                    <Text style={[type.small, { color: colors.ink }]}>
                      {a.status === 'hidden' ? t('unhide') : t('hide')}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => void setFeatured(a.id, !a.featured)}
                    style={styles.ghostBtn}
                  >
                    <Text style={[type.small, { color: colors.ink }]}>
                      {a.featured ? t('unfeature') : t('feature')}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View style={[styles.gutter, styles.block]}>
          <SectionHead title={t('users')} />
          <View style={styles.rows}>
            {users.map((u) => (
              <View key={u.uid} style={styles.modRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[type.metaStrong, { color: colors.ink }]}>
                    {u.displayName}
                  </Text>
                  <Text style={[type.small, { color: colors.faint, marginTop: 2 }]}>
                    {u.email} · {u.role}
                    {u.banned ? ' · banned' : ''}
                  </Text>
                </View>
                <Pressable
                  onPress={() => void setBanned(u.uid, !u.banned)}
                  style={[styles.ghostBtn, !u.banned && { borderColor: colors.rose }]}
                >
                  <Text
                    style={[
                      type.small,
                      { color: u.banned ? colors.ink : colors.rose, fontWeight: '600' },
                    ]}
                  >
                    {u.banned ? t('unban') : t('ban')}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.gutter, styles.block]}>
          <Button
            label={t('back')}
            variant="white"
            onPress={() => nav.goBack()}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x10 },
  gutter: { paddingHorizontal: space.gutter },
  list: { marginTop: space.x5, gap: space.x3 },
  card: {
    flexDirection: 'row',
    gap: space.x3,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: space.x3,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.paper,
  },
  thumbEmpty: { alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: space.x2, marginTop: space.x3 },
  ghostBtn: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.xs,
    paddingHorizontal: space.x3,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  pineBtn: {
    borderRadius: radius.xs,
    paddingHorizontal: space.x4,
    paddingVertical: 7,
    backgroundColor: colors.pine,
  },
  doneTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  block: { marginTop: space.x8 },
  rows: { marginTop: space.x3, gap: space.x2 },
  modRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x2,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: space.x3,
  },
});
