import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityCard } from '../../components/ActivityCard';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { DISTRICTS, districtLabel } from '../../data/districts';
import type { RootNav } from '../../navigation/types';
import { listPublished } from '../../services/activities';
import { colors, radius, space, type } from '../../theme';

export function DistrictsScreen() {
  const nav = useNavigation<RootNav>();
  const { t, lang } = useApp();
  const [picked, setPicked] = useState<string | null>(null);
  const all = listPublished();
  const list = picked ? all.filter((a) => a.district === picked) : [];

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.screen, paddingBottom: 40 }}>
        <Text style={[type.title, { color: colors.ink }]}>{t('districtsTitle')}</Text>
        <View style={styles.wrap}>
          {DISTRICTS.map((d) => {
            const count = all.filter((a) => a.district === d.id).length;
            const on = picked === d.id;
            return (
              <Pressable
                key={d.id}
                onPress={() => setPicked(on ? null : d.id)}
                style={[styles.chip, on && styles.on]}
              >
                <Text style={[type.meta, { color: on ? colors.paper : colors.ink }]}>
                  {districtLabel(d.id, lang)}
                </Text>
                <Text style={[type.meta, { color: on ? colors.pineSoft : colors.muted }]}>
                  {count}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {picked && list.length === 0 ? (
          <EmptyState title={t('empty')} />
        ) : (
          <View style={{ marginTop: 16 }}>
            {list.map((a) => (
              <View key={a.id} style={{ marginBottom: 16 }}>
                <ActivityCard
                  activity={a}
                  variant="wide"
                  onPress={() => nav.navigate('Activity', { id: a.id })}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 20 },
  chip: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  on: { backgroundColor: colors.pine, borderColor: colors.pine },
});
