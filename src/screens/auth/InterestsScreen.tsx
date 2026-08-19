import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/Button';
import { ArchMark } from '../../components/Logo';
import { MoodPicker } from '../../components/MoodPicker';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { updateProfile } from '../../services/auth';
import type { MoodId } from '../../types';
import { colors, space, type } from '../../theme';

export function InterestsScreen() {
  const { t, user, showBanner } = useApp();
  const [picked, setPicked] = useState<MoodId[]>(user?.interests ?? []);

  function toggle(id: MoodId) {
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  async function save(list: MoodId[]) {
    if (!user) return;
    await updateProfile(user.uid, { interests: list, onboarded: true });
    showBanner(t('continue'));
  }

  return (
    <Screen bare>
      <View style={styles.pad}>
        <ArchMark size={44} />
        <Text style={[type.h1, { color: colors.ink, marginTop: space.x6 }]}>
          {t('interestsTitle')}
        </Text>
        <Text style={[type.body, { color: colors.muted, marginTop: space.x2 }]}>
          {t('interestsHint')}
        </Text>

        <View style={styles.picker}>
          <MoodPicker value={picked} onChange={toggle} />
        </View>

        <View style={styles.actions}>
          <Button
            label={t('continue')}
            onPress={() => void save(picked.length ? picked : (['quiet'] as MoodId[]))}
          />
          <Pressable onPress={() => void save([])} hitSlop={8}>
            <Text style={[type.meta, styles.skip]}>{t('skip')}</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { flex: 1, padding: space.x6, justifyContent: 'center' },
  picker: { marginTop: space.x8 },
  actions: { marginTop: space.x10 },
  skip: { color: colors.muted, textAlign: 'center', paddingTop: space.x4 },
});
