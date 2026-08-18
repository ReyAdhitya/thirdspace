import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/Button';
import { MoodChips } from '../../components/MoodChips';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { updateProfile } from '../../services/auth';
import type { MoodId } from '../../types';
import { colors, space, type } from '../../theme';

export function InterestsScreen() {
  const { t, user, showBanner } = useApp();
  const [picked, setPicked] = useState<MoodId[]>(user?.interests ?? []);

  function toggle(id: MoodId) {
    setPicked((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  }

  async function save(list: MoodId[]) {
    if (!user) return;
    await updateProfile(user.uid, { interests: list, onboarded: true });
    showBanner(t('continue'));
  }

  return (
    <Screen>
      <View style={styles.pad}>
        <Text style={[type.greeting, { color: colors.ink, fontSize: 32 }]}>
          {t('interestsTitle')}
        </Text>
        <Text style={[type.body, { color: colors.muted, marginTop: 12 }]}>
          {t('interestsHint')}
        </Text>
        <View style={{ marginTop: 24 }}>
          <MoodChips value={picked} onChange={toggle} multi />
        </View>
        <View style={{ marginTop: 32, gap: 10 }}>
          <Button
            label={t('continue')}
            onPress={() => void save(picked.length ? picked : (['quiet'] as MoodId[]))}
          />
          <Button label={t('skip')} variant="ghost" onPress={() => void save([])} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { padding: space.screen, flex: 1 },
});
