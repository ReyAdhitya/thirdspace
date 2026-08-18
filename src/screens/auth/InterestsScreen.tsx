import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/Button';
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
    <Screen>
      <View style={styles.pad}>
        <View style={styles.mark} />
        <Text style={[type.display, { color: colors.ink, marginTop: space.x6 }]}>
          {t('interestsTitle')}
        </Text>
        <Text style={[type.body, { color: colors.dim, marginTop: space.x3, maxWidth: 340 }]}>
          {t('interestsHint')}
        </Text>

        <View style={styles.picker}>
          <MoodPicker value={picked} onChange={toggle} wrap />
        </View>

        <View style={styles.actions}>
          <Button
            label={t('continue')}
            onPress={() => void save(picked.length ? picked : (['quiet'] as MoodId[]))}
          />
          <Pressable onPress={() => void save([])} hitSlop={8}>
            <Text
              style={[
                type.data,
                { color: colors.dim, textAlign: 'center', marginTop: space.x6 },
              ]}
            >
              {t('skip')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { padding: space.gutter, flex: 1, justifyContent: 'center' },
  mark: { width: 28, height: 2, backgroundColor: colors.accent },
  picker: { marginTop: space.x12 },
  actions: { marginTop: space.x16 },
});
