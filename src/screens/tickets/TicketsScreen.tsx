import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityRow } from '../../components/ActivityCard';
import { EmptyState } from '../../components/EmptyState';
import { MonthCalendar } from '../../components/MonthCalendar';
import { Screen } from '../../components/Screen';
import { SectionHead, Segments } from '../../components/SectionHead';
import { TicketCard } from '../../components/TicketCard';
import { useApp } from '../../context/AppContext';
import { formatWeekdayShort, hkDayKey, hkIso, hkParts, parseHkDayKey, shiftHkDayKey } from '../../lib/time';
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
  const [calOpen, setCalOpen] = useState(false);

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

  /** Five-day strip built from the next upcoming ticket — HK calendar dates. */
  const strip = useMemo(() => {
    const first = split.up
      .map((tk) => getActivity(tk.activityId))
      .filter(Boolean)
      .sort(
        (a, b) => new Date(a!.startsAt).getTime() - new Date(b!.startsAt).getTime(),
      )[0];
    const anchor = first ? first.startsAt : new Date().toISOString();
    const days: { key: string; day: string; wd: string; on: boolean }[] = [];
    for (let i = -4; i <= 0; i += 1) {
      const key = shiftHkDayKey(anchor, i);
      const { year, month, day: d } = parseHkDayKey(key);
      const iso = hkIso(year, month, d, 12, 0);
      days.push({
        key,
        day: String(d),
        wd: formatWeekdayShort(iso, lang),
        on: i === 0,
      });
    }
    return days;
  }, [split.up, lang]);

  const calOpenOn = useMemo(() => {
    const dates = shown
      .map((tk) => {
        const a = getActivity(tk.activityId);
        return a ? hkDayKey(a.startsAt) : null;
      })
      .filter((k): k is string => Boolean(k))
      .sort();
    if (dates.length === 0) return null;
    return tab === 'past' ? dates[dates.length - 1] : dates[0];
  }, [shown, tab]);

  const markedDays = useMemo(() => {
    const keys = new Set<string>();
    for (const tk of shown) {
      const a = getActivity(tk.activityId);
      if (!a) continue;
      keys.add(hkDayKey(a.startsAt));
    }
    return keys;
  }, [shown]);

  const filtered = day
    ? shown.filter((tk) => {
        const a = getActivity(tk.activityId);
        if (!a) return false;
        return hkDayKey(a.startsAt) === day;
      })
    : shown;

  function pickDay(key: string) {
    setDay(key);
    setCalOpen(false);
  }

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

        {user ? (
          <>
            <View style={[styles.gutter, styles.block]}>
              <SectionHead
                title={t('calendarPreview')}
                action={t('seeAllBoard')}
                onAction={() => setCalOpen(true)}
              />
              {day ? (
                <Pressable onPress={() => setDay(null)} hitSlop={8} style={styles.clearDay}>
                  <Text style={[type.meta, { color: colors.muted }]}>{t('clear')}</Text>
                </Pressable>
              ) : null}
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

            {tab === 'upcoming' && split.up.length > 0 ? (
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
            ) : null}
          </>
        ) : null}
      </ScrollView>

      <MonthCalendar
        visible={calOpen}
        selectedDay={day}
        openOn={calOpenOn}
        markedDays={markedDays}
        onSelectDay={pickDay}
        onClose={() => setCalOpen(false)}
        onClear={() => {
          setDay(null);
          setCalOpen(false);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x10 },
  gutter: { paddingHorizontal: space.gutter },
  list: { marginTop: space.x5, gap: space.x3 },
  block: { marginTop: space.x8 },
  clearDay: { alignSelf: 'flex-end', marginTop: space.x2 },
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
