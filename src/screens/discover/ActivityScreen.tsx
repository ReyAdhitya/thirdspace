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
import { Fact, SectionHead } from '../../components/Text';
import { useApp } from '../../context/AppContext';
import { districtLabel } from '../../data/districts';
import { formatWhen } from '../../lib/time';
import type { ActivityRoute, RootNav } from '../../navigation/types';
import { getActivity } from '../../services/activities';
import { getUser } from '../../services/auth';
import { listMessages, postMessage } from '../../services/chat';
import { createReport } from '../../services/reports';
import { isSaved, toggleSave } from '../../services/saves';
import {
  cancelTicket,
  hasJoinedTicket,
  joinActivity,
  ticketFor,
  waitlistPosition,
} from '../../services/tickets';
import { colors, radius, space, type, useShell } from '../../theme';

export function ActivityScreen() {
  const nav = useNavigation<RootNav>();
  const { id } = useRoute<ActivityRoute>().params;
  const { t, user, lang, showBanner } = useApp();
  const { isDesktop } = useShell();
  const activity = getActivity(id);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!activity) {
    return (
      <Screen onBack={() => nav.goBack()} title={t('error')}>
        <View style={styles.gutter}>
          <EmptyState
            title={t('error')}
            body={t('empty')}
            action={t('back')}
            onAction={() => nav.goBack()}
          />
        </View>
      </Screen>
    );
  }

  const activityId = activity.id;
  const host = getUser(activity.organizerId);
  const now = Date.now();
  const started = now >= new Date(activity.startsAt).getTime();
  const ended = now >= new Date(activity.endsAt).getTime();
  const mine = user ? ticketFor(user.uid, activityId) : undefined;
  const joined = user ? hasJoinedTicket(user.uid, activityId) : false;
  const full = activity.joinedCount >= activity.capacity && !joined;
  const saved = user ? isSaved(user.uid, activityId) : false;
  const chats = listMessages(activityId, 'chat');
  const comments = listMessages(activityId, 'comment');
  const pos = user ? waitlistPosition(user.uid, activityId) : null;

  const eventLangLabel =
    activity.eventLanguage === 'mixed'
      ? t('mixed')
      : activity.eventLanguage === 'en'
        ? t('langEn')
        : activity.eventLanguage === 'zh-Hans'
          ? t('langZhHans')
          : t('langZhHant');

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
      if (!res.ok) {
        setErr(
          res.reason === 'full'
            ? t('full')
            : res.reason === 'started'
              ? t('started')
              : t('error'),
        );
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
      await postMessage({ activityId, userId: user.uid, text: draft, kind });
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

  const joinDisabled =
    started || joined || mine?.status === 'waitlisted' || activity.status === 'hidden';

  return (
    <Screen
      onBack={() => nav.goBack()}
      action={
        user
          ? {
              label: saved ? t('savedOn') : t('save'),
              onPress: () => void toggleSave(user.uid, activityId),
            }
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: activity.photoUrl }}
          style={[styles.hero, isDesktop && { height: 360 }]}
          contentFit="cover"
          transition={240}
        />

        <View style={styles.gutter}>
          <Text style={[type.label, { color: colors.dim, marginTop: space.x6 }]}>
            {districtLabel(activity.district, lang)}
          </Text>
          <Text style={[type.display, { color: colors.ink, marginTop: space.x3 }]}>
            {activity.title}
          </Text>

          <View style={styles.priceRow}>
            <PriceText priceHkd={activity.priceHkd} size="lg" />
            <Text style={[type.data, { color: colors.dim }]}>
              {activity.joinedCount}/{activity.capacity}
            </Text>
            {activity.status === 'hidden' ? (
              <Text style={[type.label, { color: colors.accent }]}>{t('hidden')}</Text>
            ) : null}
          </View>

          <View style={styles.cta}>
            <Button
              label={joinLabel}
              onPress={() => void onJoin()}
              loading={busy}
              disabled={joinDisabled}
              trailing={
                !joinDisabled && activity.priceHkd > 0 ? `HK$${activity.priceHkd}` : undefined
              }
            />
            {joined && !started ? (
              <Pressable onPress={() => void onCancel()} hitSlop={8}>
                <Text
                  style={[
                    type.data,
                    { color: colors.dim, textAlign: 'center', marginTop: space.x4 },
                  ]}
                >
                  {t('cancel')}
                </Text>
              </Pressable>
            ) : null}
          </View>

          {err ? (
            <Text style={[type.meta, { color: colors.accent, marginTop: space.x4 }]}>
              {err}
            </Text>
          ) : null}
          {mine?.status === 'waitlisted' ? (
            <Text style={[type.meta, { color: colors.dim, marginTop: space.x4 }]}>
              {t('waitlistedNote')}
              {pos ? ` · ${pos}` : ''}
            </Text>
          ) : null}

          <Text style={[type.body, { color: colors.ink, marginTop: space.x8 }]}>
            {activity.summary}
          </Text>

          <View style={styles.facts}>
            <Fact label={t('when')} value={formatWhen(activity.startsAt, lang)} mono />
            <Fact label={t('address')} value={activity.address} />
            <Fact label={t('language')} value={eventLangLabel} />
          </View>

          <Pressable
            onPress={() => nav.navigate('Organizer', { uid: activity.organizerId })}
            style={styles.host}
          >
            <View style={{ flex: 1 }}>
              <Text style={[type.label, { color: colors.faint }]}>{t('host')}</Text>
              <Text style={[type.h2, { color: colors.ink, marginTop: space.x2 }]}>
                {host?.displayName ?? '—'}
              </Text>
            </View>
            <Text style={[type.label, { color: colors.dim }]}>{t('hostEvents')}</Text>
          </Pressable>

          {user && (user.uid === activity.organizerId || user.role === 'admin') ? (
            <View style={{ marginTop: space.x6 }}>
              <Button
                label={t('editEvent')}
                variant="quiet"
                onPress={() => nav.navigate('CreateActivity', { id: activityId })}
              />
            </View>
          ) : null}

          <View style={styles.section}>
            <SectionHead label={t('chat')} />
            {!joined ? (
              <Text style={[type.meta, { color: colors.faint, marginTop: space.x4 }]}>
                {t('chatLocked')}
              </Text>
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
          </View>

          <View style={styles.section}>
            <SectionHead label={t('comments')} />
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
              <Text style={[type.meta, { color: colors.faint, marginTop: space.x4 }]}>
                {t('commentHint')}
              </Text>
            )}
          </View>

          {joined ? (
            <View style={styles.composer}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder={ended ? t('comments') : t('chat')}
                placeholderTextColor={colors.faint}
                style={styles.input}
              />
              <Pressable
                onPress={() => void send(ended ? 'comment' : 'chat')}
                hitSlop={8}
                style={styles.send}
              >
                <Text style={[type.label, { color: colors.ink }]}>{t('send')}</Text>
              </Pressable>
            </View>
          ) : null}

          <ReportBlock activityId={activityId} hostId={activity.organizerId} />
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
    return (
      <Text style={[type.meta, { color: colors.faint, marginTop: space.x4 }]}>
        {empty}
      </Text>
    );
  }
  return (
    <View>
      {items.map((m) => (
        <View key={m.id} style={styles.msg}>
          <Text style={[type.label, { color: colors.faint }]}>{m.name}</Text>
          <Text style={[type.body, { color: colors.ink, marginTop: space.x2 }]}>
            {m.text}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ReportBlock({
  activityId,
  hostId,
}: {
  activityId: string;
  hostId: string;
}) {
  const { t, user, showBanner } = useApp();
  const [reason, setReason] = useState('');
  const [open, setOpen] = useState(false);
  if (!user) return null;

  async function submit() {
    await createReport({
      reporterId: user!.uid,
      targetType: 'event',
      targetId: activityId,
      reason,
    });
    await createReport({
      reporterId: user!.uid,
      targetType: 'host',
      targetId: hostId,
      reason,
    });
    showBanner(t('reportSent'));
    setOpen(false);
    setReason('');
  }

  return (
    <View style={styles.report}>
      <Pressable onPress={() => setOpen((v) => !v)} hitSlop={8}>
        <Text style={[type.label, { color: colors.faint }]}>{t('report')}</Text>
      </Pressable>
      {open ? (
        <View style={{ marginTop: space.x4 }}>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder={t('reportReason')}
            placeholderTextColor={colors.faint}
            style={styles.input}
          />
          <View style={{ marginTop: space.x4 }}>
            <Button
              label={t('report')}
              variant="destructive"
              onPress={() => void submit()}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x16 },
  gutter: { paddingHorizontal: space.gutter },
  hero: {
    width: '100%',
    height: 280,
    backgroundColor: colors.raised,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space.x6,
    marginTop: space.x4,
  },
  cta: { marginTop: space.x8 },
  facts: { marginTop: space.x8, borderTopWidth: 1, borderTopColor: colors.hairline },
  host: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.x6,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  section: { marginTop: space.x12 },
  msg: {
    paddingVertical: space.x4,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  composer: { marginTop: space.x6 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.hairlineStrong,
    paddingVertical: space.x3,
    color: colors.ink,
    fontSize: 16,
    borderRadius: radius.none,
  },
  send: { marginTop: space.x4, alignSelf: 'flex-start' },
  report: {
    marginTop: space.x16,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: space.x6,
  },
});
