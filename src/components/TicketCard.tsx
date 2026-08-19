import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { districtLabel } from '../data/districts';
import { hkParts } from '../lib/time';
import { getActivity } from '../services/activities';
import type { Ticket } from '../types';
import { colors, radius, space, type } from '../theme';

/** Cream stub with the day set large on the left and a faint photo behind. */
export function TicketCard({ ticket }: { ticket: Ticket }) {
  const { t, lang } = useApp();
  const a = getActivity(ticket.activityId);
  if (!a) return null;

  const parts = hkParts(a.startsAt);
  const end = hkParts(a.endsAt);
  const monthLabel = lang === 'en' ? `${parts.month}月`.replace('月', '') : `${Number(parts.month)}月`;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: a.photoUrl }}
        style={styles.ghost}
        contentFit="cover"
        transition={160}
      />
      <View style={styles.date}>
        <Text style={[type.meta, { color: colors.muted }]}>
          {lang === 'en' ? parts.month : monthLabel}
        </Text>
        <Text style={[type.numeral, { color: colors.ink }]}>{parts.day}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.body}>
        <Text style={[type.h3, { color: colors.ink }]} numberOfLines={1}>
          {a.title}
        </Text>
        <Text style={[type.meta, { color: colors.muted, marginTop: space.x2 }]}>
          {parts.hour}:{parts.minute} - {end.hour}:{end.minute}
        </Text>
        <Text style={[type.meta, { color: colors.muted, marginTop: 2 }]} numberOfLines={1}>
          {districtLabel(a.district, lang)} · {a.address}
        </Text>
        <Text style={[type.metaStrong, { color: colors.ink, marginTop: space.x2 }]}>
          {a.priceHkd <= 0 ? t('free') : `HK$${a.priceHkd}`}
        </Text>
        {ticket.status !== 'joined' ? (
          <Text style={[type.small, { color: colors.rose, marginTop: space.x2 }]}>
            {ticket.status === 'waitlisted' ? t('onWaitlist') : t('cancelled')}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.paper,
    borderRadius: radius.xl,
    padding: space.x4,
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  ghost: {
    position: 'absolute',
    right: -18,
    top: -10,
    width: 150,
    height: 150,
    opacity: 0.14,
  },
  date: { width: 54, alignItems: 'center', paddingTop: 2 },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.hairlineOnPaper,
    marginHorizontal: space.x4,
  },
  body: { flex: 1 },
});
