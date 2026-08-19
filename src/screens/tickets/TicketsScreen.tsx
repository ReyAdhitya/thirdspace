import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityRow } from '../../components/ActivityCard';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { SectionHead, Segments } from '../../components/SectionHead';
import { TicketCard } from '../../components/TicketCard';
import { useApp } from '../../context/AppContext';
import { formatWeekdayShort, hkParts } from '../../lib/time';
import type { RootNav } from '../../navigation/types';
import { getActivity } from '../../services/activities';
import { ticketsForUser } from '../../services/tickets';
import { colors, radius, space, type } from '../../theme';

type Tab = 'upcoming' | 'past';

export function TicketsScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, lang } = useApp();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [day, setDay] = useState<string | null>(null);

  const tickets = user ? ticketsForUser(user.uid) : [];
  const active = tickets.filter((x) => x.status !== 'cancelled');

  const split = useMemo(() => {
    const now = Date.now();
    const up: typeof active = [];
    const past: typeof active = [];
    for (const tk of active) {
      const a = getActivity(tk.activityId);
      if (!a) continue;
      if (new Date(a.endsAt).getTime() >= now) up.push(tk);
      else past.push(tk);
    }
    return { up, past };
  }, [active]);

  const shown = tab === 'upcoming' ? split.up : split.past;

  /** Five-day strip built from the next upcoming ticket. */
  const strip = useMemo(() => {
    const first = split.up
      .map((tk) => getActivity(tk.activityId))
      .filter(Boolean)
      .sort(
        (a, b) => new Date(a!.startsAt).getTime() - new Date(b!.startsAt).getTime(),
      )[0];
    const anchor = first ? new Date(first.startsAt) : new Date();
    const days: { key: string; day: string; wd: string; on: boolean }[] = [];
    for (let i = -4; i <= 0; i += 1) {
      const d = new Date(anchor);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString();
      const p = hkParts(iso);
      days.push({
        key: `${p.year}-${p.month}-${p.day}`,
        day: p.day,
        wd: formatWeekdayShort(iso, lang),
        on: i === 0,
      });
    }
    return days;
  }, [split.up, lang]);

  const filtered = day
    ? shown.filter((tk) => {
        const a = getActivity(tk.activityId);
        if (!a) return false;
        const p = hkParts(a.startsAt);
        return `${p.year}-${p.month}-${p.day}` === day;
      })
    : shown;

  return (
    <Screen title={t('tabTickets')} caption={t('ticketsCaption')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <Segments
            value={tab}
            onChange={(next) => {
              setTab(next);
              setDay(null);
            }}
            items={[
              { id: 'upcoming', label: t('upcomingTab') },
              { id: 'past', label: t('pastTab') },
            ]}
          />
        </View>

        <View style={[styles.gutter, styles.list]}>
          {!user ? (
            <EmptyState title={t('needLogin')} icon="tag" />
          ) : filtered.length === 0 ? (
            <EmptyState
              title={t('empty')}
              body={t('ticketsEmpty')}
              action={t('tabDiscover')}
              onAction={() => nav.navigate('Tabs', { screen: 'Discover' })}
              icon="tag"
            />
          ) : (
            filtered.map((tk) => (
              <Pressable
                key={tk.id}
                onPress={() => nav.navigate('Activity', { id: tk.activityId })}
              >
                <TicketCard ticket={tk} />
              </Pressable>
            ))
          )}
        </View>

        {tab === 'upcoming' && split.up.length > 0 ? (
          <>
            <View style={[styles.gutter, styles.block]}>
              <SectionHead
                title={t('calendarPreview')}
                action={day ? t('clear') : undefined}
                onAction={day ? () => setDay(null) : undefined}
              />
            </View>
            <View style={[styles.gutter, styles.strip]}>
              {strip.map((d) => {
                const on = day === d.key || (!day && d.on);
                return (
                  <Pressable
                    key={d.key}
                    onPress={() => setDay(day === d.key ? null : d.key)}
                    style={[styles.dayCell, on && styles.dayOn]}
                  >
                    <Text
                      style={[
                        type.metaStrong,
                        { color: on ? colors.white : colors.ink },
                      ]}
                    >
                      {d.day}
                    </Text>
                    <Text
                      style={[
                        type.small,
                        { color: on ? 'rgba(255,255,255,0.8)' : colors.faint },
                      ]}
                    >
                      {d.wd}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={[styles.gutter, styles.upNext]}>
              {split.up.slice(0, 3).map((tk) => {
                const a = getActivity(tk.activityId);
                if (!a) return null;
                const p = hkParts(a.startsAt);
                const e = hkParts(a.endsAt);
                return (
                  <ActivityRow
                    key={tk.id}
                    activity={a}
                    trailing={`${p.hour}:${p.minute}–${e.hour}:${e.minute}`}
                    onPress={() => nav.navigate('Activity', { id: a.id })}
                  />
                );
              })}
            </View>
          </>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x10 },
  gutter: { paddingHorizontal: space.gutter },
  list: { marginTop: space.x5, gap: space.x3 },
  block: { marginTop: space.x8 },
  strip: { flexDirection: 'row', gap: space.x2, marginTop: space.x4 },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: space.x3,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  dayOn: { backgroundColor: colors.pine, borderColor: colors.pine },
  upNext: { marginTop: space.x4, gap: space.x3 },
});
