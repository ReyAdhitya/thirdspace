import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { SectionHead } from '../../components/Text';
import { TicketCard } from '../../components/TicketCard';
import { useApp } from '../../context/AppContext';
import { formatDay } from '../../lib/time';
import type { RootNav } from '../../navigation/types';
import { getActivity } from '../../services/activities';
import { ticketsForUser } from '../../services/tickets';
import { colors, space, type } from '../../theme';

export function TicketsScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, lang } = useApp();
  const [filterDay, setFilterDay] = useState<string | null>(null);

  const tickets = user ? ticketsForUser(user.uid) : [];
  const active = tickets.filter((x) => x.status !== 'cancelled');

  const days = useMemo(() => {
    const map = new Map<string, string>();
    for (const tk of active) {
      const a = getActivity(tk.activityId);
      if (!a) continue;
      if (new Date(a.startsAt).getTime() < Date.now()) continue;
      map.set(a.startsAt.slice(0, 10), a.startsAt);
    }
    return [...map.values()].sort();
  }, [active]);

  const shown = active.filter((tk) => {
    if (!filterDay) return true;
    const a = getActivity(tk.activityId);
    return a?.startsAt.slice(0, 10) === filterDay;
  });

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <Text style={[type.h1, { color: colors.ink }]}>{t('tabTickets')}</Text>

          {days.length > 0 ? (
            <View style={styles.calendar}>
              <SectionHead label={t('calendar')} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.dayRow}>
                  {days.map((iso) => {
                    const key = iso.slice(0, 10);
                    const on = filterDay === key;
                    return (
                      <Pressable
                        key={key}
                        onPress={() => setFilterDay(on ? null : key)}
                        hitSlop={6}
                      >
                        <Text
                          style={[type.data, { color: on ? colors.ink : colors.dim }]}
                        >
                          {formatDay(iso, lang)}
                        </Text>
                        <View
                          style={[
                            styles.dayMark,
                            { backgroundColor: on ? colors.accent : 'transparent' },
                          ]}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          ) : null}

          <View style={{ marginTop: space.x8 }}>
            {!user ? (
              <EmptyState title={t('needLogin')} />
            ) : shown.length === 0 ? (
              <EmptyState
                title={t('empty')}
                body={t('ticketsEmpty')}
                action={t('tabDiscover')}
                onAction={() => nav.navigate('Tabs', { screen: 'Discover' })}
              />
            ) : (
              shown.map((tk) => (
                <Pressable
                  key={tk.id}
                  onPress={() => nav.navigate('Activity', { id: tk.activityId })}
                >
                  <TicketCard ticket={tk} />
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: space.x6, paddingBottom: space.x16 },
  gutter: { paddingHorizontal: space.gutter },
  calendar: { marginTop: space.x8 },
  dayRow: { flexDirection: 'row', gap: space.x6, paddingTop: space.x4 },
  dayMark: { height: 2, marginTop: space.x2 },
});
