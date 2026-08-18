import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { TicketCard } from '../../components/TicketCard';
import { useApp } from '../../context/AppContext';
import { formatDay } from '../../lib/time';
import type { RootNav } from '../../navigation/types';
import { getActivity } from '../../services/activities';
import { ticketsForUser } from '../../services/tickets';
import { colors, radius, space, type } from '../../theme';

export function TicketsScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, lang } = useApp();
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
  const [filterDay, setFilterDay] = useState<string | null>(null);

  const shown = active.filter((tk) => {
    if (!filterDay) return true;
    const a = getActivity(tk.activityId);
    return a?.startsAt.slice(0, 10) === filterDay;
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.screen, paddingBottom: 40 }}>
        <Text style={[type.title, { color: colors.ink }]}>{t('tabTickets')}</Text>
        <Text style={[type.label, { color: colors.muted, marginTop: 16 }]}>{t('calendar')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {days.length === 0 ? (
              <Text style={[type.meta, { color: colors.muted }]}>—</Text>
            ) : (
              days.map((iso) => {
                const key = iso.slice(0, 10);
                const on = filterDay === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setFilterDay(on ? null : key)}
                    style={[styles.day, on && styles.dayOn]}
                  >
                    <Text style={[type.meta, { color: on ? colors.paper : colors.ink }]}>
                      {formatDay(iso, lang)}
                    </Text>
                  </Pressable>
                );
              })
            )}
          </View>
        </ScrollView>

        <View style={{ marginTop: 20 }}>
          {!user ? (
            <EmptyState title={t('needLogin')} />
          ) : shown.length === 0 ? (
            <EmptyState
              title={t('empty')}
              body={t('ticketsEmpty')}
              action={t('tabDiscover')}
              onAction={() => nav.navigate('Tabs')}
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
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  day: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  dayOn: { backgroundColor: colors.pine, borderColor: colors.pine },
});
