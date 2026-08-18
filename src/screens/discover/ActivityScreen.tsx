import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { PriceText } from '../../components/PriceText';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { districtLabel } from '../../data/districts';
import { formatWhen } from '../../lib/time';
import type { ActivityRoute, RootNav } from '../../navigation/types';
import { getActivity } from '../../services/activities';
import { getUser } from '../../services/auth';
import { listMessages, postMessage } from '../../services/chat';
import { isSaved, toggleSave } from '../../services/saves';
import {
  cancelTicket,
  hasJoinedTicket,
  joinActivity,
  ticketFor,
  waitlistPosition,
} from '../../services/tickets';
import { colors, radius, space, type } from '../../theme';

export function ActivityScreen() {
  const nav = useNavigation<RootNav>();
  const { id } = useRoute<ActivityRoute>().params;
  const { t, user, lang, showBanner } = useApp();
  const activity = getActivity(id);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!activity) {
    return (
      <Screen onBack={() => nav.goBack()} title={t('error')}>
        <EmptyState title={t('error')} body={t('empty')} action={t('retry')} onAction={() => nav.goBack()} />
      </Screen>
    );
  }

  const host = getUser(activity.organizerId);
  const now = Date.now();
  const started = now >= new Date(activity.startsAt).getTime();
  const ended = now >= new Date(activity.endsAt).getTime();
  const mine = user ? ticketFor(user.uid, activity.id) : undefined;
  const joined = user ? hasJoinedTicket(user.uid, activity.id) : false;
  const full = activity.joinedCount >= activity.capacity && !joined;
  const saved = user ? isSaved(user.uid, activity.id) : false;
  const chats = listMessages(activity.id, 'chat');
  const comments = listMessages(activity.id, 'comment');
  const pos = user ? waitlistPosition(user.uid, activity.id) : null;
  const activityId = activity.id;

  async function onJoin() {
    if (!user) {
      showBanner(t('needLogin'), 'warn');
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await joinActivity(user.uid, activityId, { allowWaitlist: true });
      if (!res.ok && res.reason === 'need-pay') {
        nav.navigate('Checkout', { activityId });
        return;
      }
      if (!res.ok && res.reason === 'full') {
        setErr(t('full'));
        return;
      }
      if (!res.ok) {
        setErr(t(res.reason === 'started' ? 'started' : 'error'));
        return;
      }
      if (res.kind === 'waitlisted') showBanner(t('waitlistedNote'));
      else {
        showBanner(t('joined'));
        nav.navigate('Tabs', { screen: 'Tickets' });
      }
    } finally {
      setBusy(false);
    }
  }

  async function onCancel() {
    if (!user || !mine) return;
    const { promotedUid } = await cancelTicket(user.uid, mine.id);
    showBanner(t('cancelled'));
    if (promotedUid && promotedUid === user.uid) showBanner(t('promoted'));
  }

  async function send(kind: 'chat' | 'comment') {
    if (!user) return;
    try {
      await postMessage({
        activityId,
        userId: user.uid,
        text: draft,
        kind,
      });
      setDraft('');
    } catch (e) {
      showBanner(e instanceof Error ? e.message : t('error'), 'warn');
    }
  }

  const joinLabel = started
    ? t('started')
    : joined
      ? t('joined')
      : mine?.status === 'waitlisted'
        ? t('onWaitlist')
        : full
          ? t('waitlist')
          : t('join');

  const joinDisabled = started || joined || mine?.status === 'waitlisted';

  return (
    <Screen onBack={() => nav.goBack()}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Image source={{ uri: activity.photoUrl }} style={styles.hero} contentFit="cover" />
        <View style={styles.body}>
          <View style={styles.row}>
            <PriceText priceHkd={activity.priceHkd} />
            <Pressable
              onPress={() => {
                if (!user) return;
                void toggleSave(user.uid, activity.id);
              }}
            >
              <Text style={{ fontSize: 18 }}>{saved ? '♥' : '♡'}</Text>
            </Pressable>
          </View>
          <Text style={[type.title, { color: colors.ink, marginTop: 8 }]}>{activity.title}</Text>
          <Text style={[type.meta, { color: colors.muted, marginTop: 8 }]}>
            {districtLabel(activity.district, lang)} · {formatWhen(activity.startsAt, lang)}
          </Text>
          <Text style={[type.meta, { color: colors.muted, marginTop: 4 }]}>
            {t('capacity')} {activity.joinedCount}/{activity.capacity}
            {activity.status === 'hidden' ? ` · ${t('hidden')}` : ''}
          </Text>

          <View style={styles.actions}>
            <View style={{ flex: 1 }}>
              <Button
                label={joinLabel}
                onPress={() => void onJoin()}
                loading={busy}
                disabled={joinDisabled || activity.status === 'hidden'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                label={t('chat')}
                variant="ghost"
                onPress={() => {
                  if (!joined) showBanner(t('chatLocked'), 'warn');
                }}
              />
            </View>
          </View>
          {err ? (
            <Text style={[type.meta, { color: colors.danger, marginTop: 8 }]}>{err}</Text>
          ) : null}
          {mine?.status === 'waitlisted' ? (
            <Text style={[type.meta, { color: colors.muted, marginTop: 8 }]}>
              {t('waitlistedNote')} {pos ? `#${pos}` : ''}
            </Text>
          ) : null}
          {joined && !started ? (
            <View style={{ marginTop: 10 }}>
              <Button label={t('cancel')} variant="ghost" onPress={() => void onCancel()} />
            </View>
          ) : null}

          <Text style={[type.label, { color: colors.muted, marginTop: 24 }]}>{t('whatWeDo')}</Text>
          <Text style={[type.body, { color: colors.ink, marginTop: 8 }]}>{activity.summary}</Text>

          <Text style={[type.label, { color: colors.muted, marginTop: 20 }]}>{t('address')}</Text>
          <Text style={[type.body, { color: colors.ink, marginTop: 6 }]}>{activity.address}</Text>

          <Text style={[type.label, { color: colors.muted, marginTop: 20 }]}>{t('language')}</Text>
          <Text style={[type.body, { color: colors.ink, marginTop: 6 }]}>
            {activity.eventLanguage === 'mixed'
              ? t('mixed')
              : activity.eventLanguage === 'en'
                ? t('langEn')
                : activity.eventLanguage === 'zh-Hans'
                  ? t('langZhHans')
                  : t('langZhHant')}
          </Text>

          <Pressable
            onPress={() => nav.navigate('Organizer', { uid: activity.organizerId })}
            style={styles.host}
          >
            <Text style={[type.label, { color: colors.muted }]}>{t('host')}</Text>
            <Text style={[type.h2, { color: colors.ink, marginTop: 4 }]}>
              {host?.displayName ?? '—'}
            </Text>
            <Text style={[type.meta, { color: colors.pine, marginTop: 4 }]}>→</Text>
          </Pressable>

          {user && (user.uid === activity.organizerId || user.role === 'admin') ? (
            <View style={{ marginTop: 12 }}>
              <Button
                label={t('editEvent')}
                variant="ghost"
                onPress={() => nav.navigate('CreateActivity', { id: activity.id })}
              />
            </View>
          ) : null}

          <Pressable
            onPress={() => {
              if (!user) return;
              nav.navigate('Settings');
            }}
            style={{ marginTop: 16 }}
          >
            <ReportBox activityId={activity.id} hostId={activity.organizerId} />
          </Pressable>

          <Text style={[type.h2, { color: colors.ink, marginTop: 28 }]}>{t('chat')}</Text>
          {!joined ? (
            <Text style={[type.meta, { color: colors.muted, marginTop: 8 }]}>{t('chatLocked')}</Text>
          ) : (
            <Thread
              empty={t('noChat')}
              items={chats.map((m) => ({
                id: m.id,
                name: getUser(m.userId)?.displayName ?? '',
                text: m.text,
              }))}
            />
          )}

          <Text style={[type.h2, { color: colors.ink, marginTop: 28 }]}>{t('comments')}</Text>
          <Text style={[type.meta, { color: colors.muted, marginTop: 6 }]}>{t('commentHint')}</Text>
          {ended && joined ? (
            <Thread
              empty={t('noComments')}
              items={comments.map((m) => ({
                id: m.id,
                name: getUser(m.userId)?.displayName ?? '',
                text: m.text,
              }))}
            />
          ) : (
            <Text style={[type.meta, { color: colors.muted, marginTop: 8 }]}>
              {ended ? t('chatLocked') : t('commentHint')}
            </Text>
          )}

          {joined && (!ended || true) ? (
            <View style={{ marginTop: 16 }}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder={ended ? t('comments') : t('chat')}
                placeholderTextColor={colors.muted}
                style={styles.input}
              />
              <View style={{ marginTop: 8 }}>
                <Button
                  label={t('send')}
                  onPress={() => void send(ended ? 'comment' : 'chat')}
                />
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

function Thread({
  items,
  empty,
}: {
  items: { id: string; name: string; text: string }[];
  empty: string;
}) {
  if (!items.length) {
    return <Text style={[type.meta, { color: colors.muted, marginTop: 8 }]}>{empty}</Text>;
  }
  return (
    <View style={{ marginTop: 8, gap: 10 }}>
      {items.map((m) => (
        <View key={m.id} style={styles.msg}>
          <Text style={[type.meta, { color: colors.pine }]}>{m.name}</Text>
          <Text style={[type.body, { color: colors.ink }]}>{m.text}</Text>
        </View>
      ))}
    </View>
  );
}

function ReportBox({ activityId, hostId }: { activityId: string; hostId: string }) {
  const { t, user, showBanner } = useApp();
  const [reason, setReason] = useState('');
  const [open, setOpen] = useState(false);
  if (!user) return null;
  return (
    <View>
      <Pressable onPress={() => setOpen((v) => !v)}>
        <Text style={[type.meta, { color: colors.danger }]}>{t('report')}</Text>
      </Pressable>
      {open ? (
        <View style={{ marginTop: 8 }}>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder={t('reportReason')}
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <View style={{ marginTop: 8 }}>
            <Button
              label={t('report')}
              variant="danger"
              onPress={async () => {
                const { createReport } = await import('../../services/reports');
                await createReport({
                  reporterId: user.uid,
                  targetType: 'event',
                  targetId: activityId,
                  reason,
                });
                await createReport({
                  reporterId: user.uid,
                  targetType: 'host',
                  targetId: hostId,
                  reason,
                });
                showBanner(t('reportSent'));
                setOpen(false);
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', height: 240 },
  body: { padding: space.screen },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  host: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
  },
  msg: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
});
