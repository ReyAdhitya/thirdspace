import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
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
import { Icon } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { SectionHead } from '../../components/SectionHead';
import { useApp } from '../../context/AppContext';
import { districtLabel } from '../../data/districts';
import { formatDay, hkParts } from '../../lib/time';
import type { ActivityRoute, RootNav } from '../../navigation/types';
import { getActivity } from '../../services/activities';
import { getUser } from '../../services/auth';
import { listMessages, postMessage } from '../../services/chat';
import { isFollowing, toggleFollow } from '../../services/follows';
import { createReport } from '../../services/reports';
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
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  if (!activity) {
    return (
      <Screen onBack={() => nav.goBack()}>
        <EmptyState
          title={t('error')}
          action={t('back')}
          onAction={() => nav.goBack()}
          icon="info"
        />
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
  const following = user ? isFollowing(user.uid, activity.organizerId) : false;
  const pos = user ? waitlistPosition(user.uid, activityId) : null;
  const comments = listMessages(activityId, 'comment');
  const chatCount = listMessages(activityId, 'chat').length;

  const start = hkParts(activity.startsAt);
  const end = hkParts(activity.endsAt);
  const when = `${formatDay(activity.startsAt, lang)} ${start.hour}:${start.minute} - ${end.hour}:${end.minute}`;

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

  const joinLabel = started
    ? t('started')
    : joined
      ? t('joined')
      : mine?.status === 'waitlisted'
        ? t('onWaitlist')
        : full
          ? t('waitlist')
          : t('joinActivity');

  const joinDisabled =
    started || joined || mine?.status === 'waitlisted' || activity.status === 'hidden';

  return (
    <Screen bare>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: activity.photoUrl }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={220}
          />
          <LinearGradient
            colors={['rgba(16,18,16,0.45)', 'transparent']}
            style={styles.heroTopFade}
          />
          <View style={styles.heroBar}>
            <Round onPress={() => nav.goBack()} icon="chevron-left" />
            <View style={{ flex: 1 }} />
            <Round
              onPress={() => showBanner(t('appName'))}
              icon="share-2"
            />
            <Round
              onPress={() => {
                if (!user) {
                  showBanner(t('needLogin'), 'warn');
                  return;
                }
                void toggleSave(user.uid, activityId);
              }}
              icon="heart"
              tint={saved ? colors.rose : colors.ink}
            />
          </View>
        </View>

        <View style={styles.sheet}>
          <Text style={[type.h1, { color: colors.ink }]}>{activity.title}</Text>
          <Text style={[type.meta, { color: colors.muted, marginTop: space.x2 }]}>
            {activity.summary}
          </Text>

          <Pressable
            style={styles.hostRow}
            onPress={() => nav.navigate('Organizer', { uid: activity.organizerId })}
          >
            {host?.photoUrl ? (
              <Image source={{ uri: host.photoUrl }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={[styles.avatar, { backgroundColor: colors.paper }]} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={[type.bodyStrong, { color: colors.ink }]}>
                {host?.displayName ?? '—'}
              </Text>
              <Text style={[type.small, { color: colors.muted }]}>{t('organiser')}</Text>
            </View>
            {user && user.uid !== activity.organizerId ? (
              <Pressable
                onPress={async () => {
                  await toggleFollow(user.uid, activity.organizerId);
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
          </Pressable>

          <View style={styles.facts}>
            <FactRow icon="calendar" text={when} />
            <FactRow
              icon="map-pin"
              text={`${districtLabel(activity.district, lang)} · ${activity.address}`}
            />
            <FactRow
              icon="tag"
              text={activity.priceHkd <= 0 ? t('free') : `HK$${activity.priceHkd}`}
              strong
            />
          </View>

          <View style={styles.block}>
            <SectionHead title={t('aboutActivity')} />
            <Text style={[type.body, { color: colors.muted, marginTop: space.x3 }]}>
              {activity.summary}
            </Text>
          </View>

          <View style={styles.block}>
            <Text style={[type.bodyStrong, { color: colors.ink }]}>
              {t('attendingCount')} {activity.joinedCount} {t('people')}
            </Text>
            <View style={styles.stack}>
              {Array.from({ length: Math.min(5, activity.joinedCount) }).map((_, i) => (
                <View key={i} style={[styles.stackDot, { marginLeft: i === 0 ? 0 : -8 }]} />
              ))}
              {activity.joinedCount > 5 ? (
                <Text style={[type.small, { color: colors.muted, marginLeft: space.x2 }]}>
                  +{activity.joinedCount - 5}
                </Text>
              ) : null}
              <Text style={[type.small, { color: colors.faint, marginLeft: 'auto' }]}>
                {activity.joinedCount} / {activity.capacity}
              </Text>
            </View>
          </View>

          {joined ? (
            <Pressable
              style={styles.chatRow}
              onPress={() => nav.navigate('Chat', { activityId })}
            >
              <Icon name="message-circle" size={19} color={colors.pine} />
              <Text style={[type.bodyStrong, { color: colors.ink, flex: 1 }]}>
                {t('chat')}
              </Text>
              <Text style={[type.small, { color: colors.muted }]}>{chatCount}</Text>
              <Icon name="chevron-right" size={16} color={colors.faint} />
            </Pressable>
          ) : (
            <Text style={[type.small, { color: colors.faint, marginTop: space.x5 }]}>
              {t('chatLocked')}
            </Text>
          )}

          {ended ? (
            <View style={styles.block}>
              <SectionHead title={t('comments')} />
              {joined ? (
                <>
                  {comments.length === 0 ? (
                    <Text style={[type.meta, { color: colors.faint, marginTop: space.x3 }]}>
                      {t('noComments')}
                    </Text>
                  ) : (
                    comments.map((m) => (
                      <View key={m.id} style={styles.comment}>
                        <Text style={[type.small, { color: colors.muted }]}>
                          {getUser(m.userId)?.displayName ?? ''}
                        </Text>
                        <Text style={[type.body, { color: colors.ink, marginTop: 2 }]}>
                          {m.text}
                        </Text>
                      </View>
                    ))
                  )}
                  <View style={styles.composer}>
                    <TextInput
                      value={draft}
                      onChangeText={setDraft}
                      placeholder={t('comments')}
                      placeholderTextColor={colors.faint}
                      style={styles.input}
                    />
                    <Pressable
                      onPress={async () => {
                        try {
                          await postMessage({
                            activityId,
                            userId: user!.uid,
                            text: draft,
                            kind: 'comment',
                          });
                          setDraft('');
                        } catch (e) {
                          showBanner(
                            e instanceof Error ? e.message : t('error'),
                            'warn',
                          );
                        }
                      }}
                      style={styles.send}
                    >
                      <Icon name="send" size={17} color={colors.white} />
                    </Pressable>
                  </View>
                </>
              ) : (
                <Text style={[type.meta, { color: colors.faint, marginTop: space.x3 }]}>
                  {t('commentHint')}
                </Text>
              )}
            </View>
          ) : null}

          {err ? (
            <Text style={[type.meta, { color: colors.rose, marginTop: space.x4 }]}>
              {err}
            </Text>
          ) : null}
          {mine?.status === 'waitlisted' ? (
            <Text style={[type.meta, { color: colors.muted, marginTop: space.x4 }]}>
              {t('waitlistedNote')}
              {pos ? ` · ${pos}` : ''}
            </Text>
          ) : null}

          {user && (user.uid === activity.organizerId || user.role === 'admin') ? (
            <View style={styles.block}>
              <Button
                label={t('editEvent')}
                variant="white"
                icon="edit-3"
                onPress={() => nav.navigate('CreateActivity', { id: activityId })}
              />
            </View>
          ) : null}

          <ReportBlock activityId={activityId} hostId={activity.organizerId} />
        </View>
      </ScrollView>

      <View style={styles.cta}>
        <Button
          label={joinLabel}
          onPress={() => void onJoin()}
          loading={busy}
          disabled={joinDisabled}
        />
        {joined && !started ? (
          <Pressable onPress={() => void onCancel()} hitSlop={8}>
            <Text style={[type.small, styles.cancel]}>{t('cancel')}</Text>
          </Pressable>
        ) : null}
      </View>
    </Screen>
  );
}

function Round({
  icon,
  onPress,
  tint = colors.ink,
}: {
  icon: 'chevron-left' | 'share-2' | 'heart';
  onPress: () => void;
  tint?: string;
}) {
  return (
    <Pressable onPress={onPress} style={styles.round} hitSlop={6}>
      <Icon name={icon} size={18} color={tint} />
    </Pressable>
  );
}

function FactRow({
  icon,
  text,
  strong,
}: {
  icon: 'calendar' | 'map-pin' | 'tag';
  text: string;
  strong?: boolean;
}) {
  return (
    <View style={styles.fact}>
      <Icon name={icon} size={17} color={colors.harbor} />
      <Text
        style={[strong ? type.bodyStrong : type.body, { color: colors.ink, flex: 1 }]}
      >
        {text}
      </Text>
    </View>
  );
}

function ReportBlock({ activityId, hostId }: { activityId: string; hostId: string }) {
  const { t, user, showBanner } = useApp();
  const [reason, setReason] = useState('');
  const [open, setOpen] = useState(false);
  if (!user) return null;

  return (
    <View style={styles.report}>
      <Pressable onPress={() => setOpen((v) => !v)} hitSlop={8}>
        <Text style={[type.small, { color: colors.faint }]}>{t('report')}</Text>
      </Pressable>
      {open ? (
        <View style={{ marginTop: space.x3 }}>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder={t('reportReason')}
            placeholderTextColor={colors.faint}
            style={styles.input}
          />
          <View style={{ marginTop: space.x3 }}>
            <Button
              label={t('report')}
              variant="outline"
              danger
              compact
              onPress={async () => {
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
                setReason('');
              }}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 140 },
  heroWrap: { height: 300, backgroundColor: colors.paper },
  heroTopFade: { position: 'absolute', left: 0, right: 0, top: 0, height: 110 },
  heroBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x2,
    paddingHorizontal: space.x4,
    paddingTop: space.x3,
  },
  round: {
    width: 36,
    height: 36,
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
    paddingTop: space.x6,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    marginTop: space.x5,
  },
  avatar: { width: 40, height: 40, borderRadius: radius.pill },
  followBtn: {
    borderWidth: 1,
    borderColor: colors.pine,
    borderRadius: radius.sm,
    paddingHorizontal: space.x3,
    paddingVertical: 6,
  },
  followOn: { borderColor: colors.hairline, backgroundColor: colors.white },
  facts: { marginTop: space.x5, gap: space.x3 },
  fact: { flexDirection: 'row', alignItems: 'center', gap: space.x3 },
  block: { marginTop: space.x6 },
  stack: { flexDirection: 'row', alignItems: 'center', marginTop: space.x3 },
  stackDot: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    borderWidth: 2,
    borderColor: colors.stone,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: space.x4,
    marginTop: space.x5,
  },
  comment: {
    marginTop: space.x3,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: space.x3,
  },
  composer: { flexDirection: 'row', alignItems: 'center', gap: space.x2, marginTop: space.x4 },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: space.x3,
    height: 44,
    color: colors.ink,
    fontSize: 14,
    fontFamily: type.body.fontFamily as string,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.pine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  report: { marginTop: space.x8, alignItems: 'center' },
  cta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space.gutter,
    paddingTop: space.x3,
    paddingBottom: space.x6,
    backgroundColor: colors.stone,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  cancel: { color: colors.muted, textAlign: 'center', paddingTop: space.x3 },
});
