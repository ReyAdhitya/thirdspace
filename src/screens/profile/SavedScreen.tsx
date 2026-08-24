import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ActivityRow } from '../../components/ActivityCard';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import type { RootNav } from '../../navigation/types';
import { getActivity } from '../../services/activities';
import { savedIds } from '../../services/saves';
import { space } from '../../theme';

export function SavedScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user } = useApp();

  if (!user) {
    return (
      <Screen onBack={() => nav.goBack()} title={t('saved')}>
        <EmptyState title={t('needLogin')} icon="heart" />
      </Screen>
    );
  }

  const saved = savedIds(user.uid)
    .map((id) => getActivity(id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <Screen onBack={() => nav.goBack()} title={t('saved')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          {saved.length === 0 ? (
            <EmptyState title={t('noSaved')} icon="heart" />
          ) : (
            <View style={styles.rows}>
              {saved.map((a) => (
                <ActivityRow
                  key={a.id}
                  activity={a}
                  onPress={() => nav.navigate('Activity', { id: a.id })}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x10, paddingTop: space.x2 },
  gutter: { paddingHorizontal: space.gutter },
  rows: { gap: space.x3 },
});
