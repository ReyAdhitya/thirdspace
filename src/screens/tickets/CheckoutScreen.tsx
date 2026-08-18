import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import type { RootNav, RootStackParamList } from '../../navigation/types';
import { getActivity } from '../../services/activities';
import { stripeMode, simulateCheckout } from '../../services/stripe';
import { joinActivity } from '../../services/tickets';
import { colors, space, type } from '../../theme';

export function CheckoutScreen() {
  const nav = useNavigation<RootNav>();
  const { activityId } =
    useRoute<RouteProp<RootStackParamList, 'Checkout'>>().params;
  const { t, user, showBanner } = useApp();
  const activity = getActivity(activityId);
  const [card, setCard] = useState('4242 4242 4242 4242');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!activity || !user) {
    return (
      <Screen onBack={() => nav.goBack()} title={t('payTitle')}>
        <EmptyState title={t('needLogin')} />
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
      showBanner(
        res.kind === 'waitlisted' ? t('waitlistedNote') : t('paySuccess'),
      );
      nav.navigate('Tabs');
    } catch (e) {
      setErr(e instanceof Error ? e.message : t('error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen onBack={() => nav.goBack()} title={t('payTitle')}>
      <View style={styles.pad}>
        <Text style={[type.h2, { color: colors.ink }]}>{activity.title}</Text>
        <Text style={[type.body, { color: colors.pine, marginTop: 8 }]}>
          HK${activity.priceHkd} · {stripeMode() === 'simulate' ? t('payHint') : t('payHint')}
        </Text>
        <Text style={[type.label, { color: colors.muted, marginTop: 24 }]}>
          {t('cardNumber')}
        </Text>
        <TextInput
          value={card}
          onChangeText={setCard}
          keyboardType="number-pad"
          style={styles.input}
        />
        {err ? (
          <Text style={[type.meta, { color: colors.danger, marginTop: 8 }]}>{err}</Text>
        ) : null}
        <View style={{ marginTop: 20 }}>
          <Button label={t('payNow')} onPress={() => void pay()} loading={busy} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { padding: space.screen },
  input: {
    marginTop: 8,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
    fontSize: 16,
    letterSpacing: 1,
  },
});
