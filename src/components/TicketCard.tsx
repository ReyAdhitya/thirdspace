import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { districtLabel } from '../data/districts';
import { formatWhen } from '../lib/time';
import { getActivity } from '../services/activities';
import type { Ticket } from '../types';
import { colors, radius, space, type } from '../theme';
import { PriceText } from './PriceText';

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const { t, lang } = useApp();
  const a = getActivity(ticket.activityId);
  if (!a) return null;
  const status =
    ticket.status === 'joined'
      ? t('joined')
      : ticket.status === 'waitlisted'
        ? t('onWaitlist')
        : t('cancelled');
  return (
    <View style={styles.card}>
      <View style={styles.stub} />
      <View style={{ flex: 1, padding: space.lg }}>
        <Text style={[type.label, { color: colors.pine }]}>{status}</Text>
        <Text style={[type.h2, { color: colors.ink, marginTop: 6 }]}>{a.title}</Text>
        <Text style={[type.meta, { color: colors.muted, marginTop: 8 }]}>
          {formatWhen(a.startsAt, lang)}
        </Text>
        <Text style={[type.meta, { color: colors.muted, marginTop: 4 }]}>
          {districtLabel(a.district, lang)} · {a.address}
        </Text>
        <View style={{ marginTop: 10 }}>
          <PriceText priceHkd={a.priceHkd} />
        </View>
        <Text style={[type.meta, { color: colors.muted, marginTop: 12 }]}>
          {t('ticketPass')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: space.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  stub: {
    width: 10,
    backgroundColor: colors.pine,
  },
});
