import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { Fact } from '../../components/Text';
import { useApp } from '../../context/AppContext';
import { formatWhen } from '../../lib/time';
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
        <View style={styles.gutter}>
          <EmptyState title={t('needLogin')} />
        </View>
      </Screen>
    );
  }

  const uid = user.uid;
  const activityKey = activity.id;

  async function pay() {
    setBusy(true);
    setErr(null);
    try {
      await simulateCheckout(card);
      const res = await joinActivity(uid, activityKey, {
        paid: true,
        allowWaitlist: true,
      });
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
        <Text style={[type.label, { color: colors.accent }]}>
          {stripeMode() === 'simulate' ? 'TEST MODE' : 'TEST KEY'}
        </Text>
        <Text style={[type.displaySm, { color: colors.ink, marginTop: space.x3 }]}>
          {activity.title}
        </Text>
        <Text style={[type.body, { color: colors.dim, marginTop: space.x3 }]}>
          {t('payHint')}
        </Text>

        <View style={styles.facts}>
          <Fact label={t('when')} value={formatWhen(activity.startsAt, lang)} mono />
          <Fact label={t('price')} value={`HK$${activity.priceHkd}`} mono />
        </View>

        <Text style={[type.label, { color: colors.faint, marginTop: space.x8 }]}>
          {t('cardNumber')}
        </Text>
        <TextInput
          value={card}
          onChangeText={setCard}
          keyboardType="number-pad"
          style={styles.input}
        />

        {err ? (
          <Text style={[type.meta, { color: colors.accent, marginTop: space.x4 }]}>
            {err}
          </Text>
        ) : null}

        <View style={{ marginTop: space.x8 }}>
          <Button
            label={t('payNow')}
            onPress={() => void pay()}
            loading={busy}
            trailing={`HK$${activity.priceHkd}`}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gutter: { paddingHorizontal: space.gutter, paddingTop: space.x4 },
  facts: { marginTop: space.x8, borderTopWidth: 1, borderTopColor: colors.hairline },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.hairlineStrong,
    paddingVertical: space.x3,
    marginTop: space.x2,
    color: colors.ink,
    fontSize: 18,
    letterSpacing: 2,
    borderRadius: radius.none,
    fontFamily: type.data.fontFamily as string,
  },
});
