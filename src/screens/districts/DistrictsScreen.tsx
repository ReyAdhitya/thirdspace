import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityCard } from '../../components/ActivityCard';
import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { SectionHead } from '../../components/Text';
import { useApp } from '../../context/AppContext';
import { DISTRICTS, districtLabel } from '../../data/districts';
import type { RootNav } from '../../navigation/types';
import { listPublished } from '../../services/activities';
import { colors, space, type } from '../../theme';

/** A directory, not a chip cloud: districts as an index with counts. */
export function DistrictsScreen() {
  const nav = useNavigation<RootNav>();
  const { t, lang } = useApp();
  const [picked, setPicked] = useState<string | null>(null);

  const all = listPublished();
  const list = picked ? all.filter((a) => a.district === picked) : [];
  const rows = DISTRICTS.map((d) => ({
    id: d.id,
    label: districtLabel(d.id, lang),
    count: all.filter((a) => a.district === d.id).length,
  }));

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <Text style={[type.h1, { color: colors.ink }]}>{t('districtsTitle')}</Text>

          <View style={styles.index}>
            {rows.map((row) => {
              const on = picked === row.id;
              const none = row.count === 0;
              return (
                <Pressable
                  key={row.id}
                  onPress={() => setPicked(on ? null : row.id)}
                  style={styles.row}
                >
                  <View
                    style={[
                      styles.mark,
                      { backgroundColor: on ? colors.accent : 'transparent' },
                    ]}
                  />
                  <Text
                    style={[
                      type.bodyStrong,
                      { color: none ? colors.faint : on ? colors.ink : colors.dim, flex: 1 },
                    ]}
                  >
                    {row.label}
                  </Text>
                  <Text style={[type.data, { color: none ? colors.faint : colors.dim }]}>
                    {String(row.count).padStart(2, '0')}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {picked ? (
            <View style={styles.results}>
              <SectionHead label={districtLabel(picked, lang)} />
              {list.length === 0 ? (
                <EmptyState title={t('empty')} body={t('ticketsEmpty')} />
              ) : (
                <View style={{ marginTop: space.x6 }}>
                  {list.map((a) => (
                    <ActivityCard
                      key={a.id}
                      activity={a}
                      variant="stack"
                      onPress={() => nav.navigate('Activity', { id: a.id })}
                    />
                  ))}
                </View>
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: space.x6, paddingBottom: space.x16 },
  gutter: { paddingHorizontal: space.gutter },
  index: {
    marginTop: space.x8,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    paddingVertical: space.x3,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  mark: { width: 2, height: 14 },
  results: { marginTop: space.x12 },
});
