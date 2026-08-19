import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { districtLabel } from '../../data/districts';
import { formatDay, hkParts } from '../../lib/time';
import type { RootNav, RootStackParamList } from '../../navigation/types';
import { getActivity } from '../../services/activities';
import { simulateCheckout, stripeMode } from '../../services/stripe';
import { joinActivity } from '../../services/tickets';
import { colors, radius, space, type } from '../../theme';

export function CheckoutScreen() {
  const nav = useNavigation<RootNav>();
  const { activityId } = useRoute<RouteProp<RootStackParamList, 'Checkout'>>().params;
  const { t, user, lang, showBanner } = useApp();
  const activity = getActivity(activityId);
  const [card, setCard] = useState('4242 4242 4242 4242');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!activity || !user) {
    return (
      <Screen onBack={() => nav.goBack()} title={t('payTitle')}>
        <EmptyState title={t('needLogin')} icon="tag" />
      </Screen>
    );
  }

  const uid = user.uid;
  const key = activity.id;
  const start = hkParts(activity.startsAt);

  async function pay() {
    setBusy(true);
    setErr(null);
    try {
      await simulateCheckout(card);
      const res = await joinActivity(uid, key, { paid: true, allowWaitlist: true });
      if (!res.ok) {
        setErr(t('error'));
        return;
      }
      showBanner(res.kind === 'waitlisted' ? t('waitlistedNote') : t('paySuccess'));
      nav.navigate('Tabs', { screen: 'Tickets' });
    } catch (e) {
      setErr(e instanceof Error ? e.message : t('error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen onBack={() => nav.goBack()} title={t('payTitle')}>
      <View style={styles.gutter}>
        <View style={styles.summary}>
          <Image
            source={{ uri: activity.photoUrl }}
            style={styles.thumb}
            contentFit="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={[type.h3, { color: colors.ink }]} numberOfLines={2}>
              {activity.title}
            </Text>
            <Text style={[type.small, { color: colors.muted, marginTop: 3 }]}>
              {formatDay(activity.startsAt, lang)} {start.hour}:{start.minute}
            </Text>
            <Text style={[type.small, { color: colors.muted }]}>
              {districtLabel(activity.district, lang)}
            </Text>
          </View>
          <Text style={[type.numeralSm, { color: colors.ink }]}>
            HK${activity.priceHkd}
          </Text>
        </View>

        <View style={styles.testTag}>
          <Icon name="info" size={14} color={colors.pine} />
          <Text style={[type.small, { color: colors.pine, flex: 1 }]}>
            {stripeMode() === 'simulate' ? t('payHint') : t('payHint')}
          </Text>
        </View>

        <Text style={[type.small, { color: colors.muted, marginTop: space.x6 }]}>
          {t('cardNumber')}
        </Text>
        <TextInput
          value={card}
          onChangeText={setCard}
          keyboardType="number-pad"
          style={styles.input}
        />

        {err ? (
          <Text style={[type.meta, { color: colors.rose, marginTop: space.x3 }]}>
            {err}
          </Text>
        ) : null}

        <View style={{ marginTop: space.x8 }}>
          <Button label={t('payNow')} onPress={() => void pay()} loading={busy} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gutter: { paddingHorizontal: space.gutter },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    padding: space.x3,
  },
  thumb: { width: 56, height: 56, borderRadius: radius.sm },
  testTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x2,
    backgroundColor: colors.pineSoft,
    borderRadius: radius.sm,
    padding: space.x3,
    marginTop: space.x4,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: space.x3,
    height: 50,
    marginTop: space.x2,
    color: colors.ink,
    fontSize: 17,
    letterSpacing: 1.5,
    fontFamily: type.body.fontFamily as string,
  },
});
