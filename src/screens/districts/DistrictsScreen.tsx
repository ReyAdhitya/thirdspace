import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityRow, PhotoTile } from '../../components/ActivityCard';
import { EmptyState } from '../../components/EmptyState';
import { HongKongMap, type RegionId } from '../../components/HongKongMap';
import { Screen } from '../../components/Screen';
import { SearchField } from '../../components/SearchField';
import { SectionHead } from '../../components/SectionHead';
import { useApp } from '../../context/AppContext';
import { DISTRICTS, districtLabel } from '../../data/districts';
import type { RootNav } from '../../navigation/types';
import { listPublished } from '../../services/activities';
import { colors, radius, space, type } from '../../theme';

/** Which districts sit in which of the three regions on the map. */
const REGION_OF: Record<RegionId, string[]> = {
  island: ['central', 'sheung_wan', 'wan_chai', 'causeway_bay', 'tai_hang', 'eastern', 'southern'],
  kowloon: ['tst', 'mong_kok', 'sham_shui_po', 'kowloon_city', 'wong_tai_sin', 'kwun_tong'],
  nt: [
    'kwai_tsing',
    'tsuen_wan',
    'tuen_mun',
    'yuen_long',
    'north',
    'tai_po',
    'sha_tin',
    'sai_kung',
    'islands',
  ],
};

export function DistrictsScreen() {
  const nav = useNavigation<RootNav>();
  const { t, lang } = useApp();
  const [q, setQ] = useState('');
  const [region, setRegion] = useState<RegionId | null>(null);
  const [district, setDistrict] = useState<string | null>(null);

  const all = listPublished();

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of all) map.set(a.district, (map.get(a.district) ?? 0) + 1);
    return map;
  }, [all]);

  /** Districts with events, most active first — the board's photo tiles. */
  const popularDistricts = useMemo(
    () =>
      [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([id, count]) => ({
          id,
          count,
          photo: all.find((a) => a.district === id)?.photoUrl ?? '',
        })),
    [counts, all],
  );

  const indexRows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return DISTRICTS.filter((d) => {
      if (region && !REGION_OF[region].includes(d.id)) return false;
      if (!term) return true;
      return [d.en, d.zhHant, d.zhHans].join(' ').toLowerCase().includes(term);
    });
  }, [q, region]);

  const list = district ? all.filter((a) => a.district === district) : [];

  return (
    <Screen title="Districts" caption={t('districtsCaption')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <SearchField value={q} onChange={setQ} placeholder={t('searchDistricts')} />
        </View>

        <View style={[styles.gutter, styles.block]}>
          <HongKongMap
            active={region}
            onPick={(id) => {
              setRegion((cur) => (cur === id ? null : id));
              setDistrict(null);
            }}
            labels={{
              nt: t('regionNt'),
              kowloon: t('regionKowloon'),
              island: t('regionIsland'),
            }}
          />
        </View>

        <View style={[styles.gutter, styles.block]}>
          <SectionHead
            title={t('popularDistricts')}
            action={region ? t('clear') : undefined}
            onAction={region ? () => setRegion(null) : undefined}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tiles}
        >
          {popularDistricts.map((d) => (
            <PhotoTile
              key={d.id}
              photoUrl={d.photo}
              label={districtLabel(d.id, lang)}
              width={78}
              height={98}
              onPress={() => setDistrict((cur) => (cur === d.id ? null : d.id))}
            />
          ))}
        </ScrollView>

        <View style={[styles.gutter, styles.block]}>
          <View style={styles.index}>
            {indexRows.map((d) => {
              const count = counts.get(d.id) ?? 0;
              const on = district === d.id;
              return (
                <Pressable
                  key={d.id}
                  onPress={() => setDistrict(on ? null : d.id)}
                  style={[styles.row, on && styles.rowOn]}
                >
                  <Text
                    style={[
                      type.body,
                      { color: count ? colors.ink : colors.faint, flex: 1 },
                    ]}
                  >
                    {districtLabel(d.id, lang)}
                  </Text>
                  <Text
                    style={[
                      type.meta,
                      { color: count ? colors.pine : colors.faint },
                    ]}
                  >
                    {count}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {district ? (
          <View style={[styles.gutter, styles.block]}>
            <SectionHead title={districtLabel(district, lang)} />
            <View style={styles.results}>
              {list.length === 0 ? (
                <EmptyState title={t('empty')} icon="map-pin" />
              ) : (
                list.map((a) => (
                  <ActivityRow
                    key={a.id}
                    activity={a}
                    onPress={() => nav.navigate('Activity', { id: a.id })}
                  />
                ))
              )}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x10 },
  gutter: { paddingHorizontal: space.gutter },
  block: { marginTop: space.x6 },
  tiles: { gap: space.x2, paddingHorizontal: space.gutter, marginTop: space.x4 },
  index: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: space.x4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.x3,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  rowOn: { borderBottomColor: colors.pine },
  results: { marginTop: space.x4, gap: space.x3 },
});
