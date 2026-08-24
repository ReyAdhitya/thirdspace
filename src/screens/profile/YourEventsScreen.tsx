import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ActivityRow } from '../../components/ActivityCard';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import type { RootNav } from '../../navigation/types';
import { listByOrganizer } from '../../services/activities';
import { space } from '../../theme';

export function YourEventsScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user } = useApp();

  if (!user) {
    return (
      <Screen onBack={() => nav.goBack()} title={t('yourEvents')}>
        <EmptyState title={t('needLogin')} icon="calendar" />
      </Screen>
    );
  }

  const hosting = listByOrganizer(user.uid);
  const canCreate = user.role === 'organizer' || user.role === 'admin';

  return (
    <Screen onBack={() => nav.goBack()} title={t('yourEvents')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          {canCreate ? (
            <Button
              label={t('createEvent')}
              icon="plus"
              onPress={() => nav.navigate('CreateActivity', {})}
            />
          ) : null}

          <View style={[styles.list, canCreate && { marginTop: space.x5 }]}>
            {hosting.length === 0 ? (
              <EmptyState
                title={t('empty')}
                body={canCreate ? t('yourEventsEmptyHost') : t('yourEventsEmptyUser')}
                icon="calendar"
              />
            ) : (
              hosting.map((a) => (
                <ActivityRow
                  key={a.id}
                  activity={a}
                  trailing={`${a.joinedCount} / ${a.capacity}`}
                  onPress={() => nav.navigate('Activity', { id: a.id })}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x10, paddingTop: space.x2 },
  gutter: { paddingHorizontal: space.gutter },
  list: { gap: space.x3 },
});
