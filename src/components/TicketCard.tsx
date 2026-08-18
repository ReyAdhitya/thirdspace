import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { districtLabel } from '../data/districts';
import { formatWhen } from '../lib/time';
import { getActivity } from '../services/activities';
import type { Ticket } from '../types';
import { colors, space, type } from '../theme';
import { PriceText } from './PriceText';

/** The pass. Legible at arm's length, held up to a door person. No QR. */
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
      <View style={styles.statusRow}>
        <Text
          style={[
            type.label,
            { color: ticket.status === 'joined' ? colors.ink : colors.dim },
          ]}
        >
          {status}
        </Text>
        <PriceText priceHkd={a.priceHkd} tone="dim" />
      </View>

      <Text style={[type.displaySm, { color: colors.ink }]}>{a.title}</Text>

      <Text style={[type.dataLg, { color: colors.ink, marginTop: space.x4 }]}>
        {formatWhen(a.startsAt, lang)}
      </Text>
      <Text style={[type.bodySm, { color: colors.dim, marginTop: space.x2 }]}>
        {districtLabel(a.district, lang)} · {a.address}
      </Text>

      <Text style={[type.meta, { color: colors.faint, marginTop: space.x6 }]}>
        {t('ticketPass')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: space.x6,
    borderTopWidth: 1,
    borderTopColor: colors.hairlineStrong,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: space.x4,
  },
});
