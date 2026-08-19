import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityRow } from '../../components/ActivityCard';
import { EmptyState } from '../../components/EmptyState';
import { MapCard } from '../../components/MapCard';
import { Screen } from '../../components/Screen';
import { SearchField } from '../../components/SearchField';
import { SectionHead } from '../../components/SectionHead';
import { useApp } from '../../context/AppContext';
import { DISTRICT_CENTER, districtLabel } from '../../data/districts';
import { activityTitle } from '../../lib/localize';
import {
  HK_DEFAULT_ZOOM,
  HONG_KONG,
  PLACE_ZOOM,
  activityMapQuery,
  mapsEmbedUrl,
  placeQuery,
} from '../../lib/maps';
import type { RootNav } from '../../navigation/types';
import { listPublished } from '../../services/activities';
import type { Activity } from '../../types';
import { colors, space, type } from '../../theme';

/**
 * One job: a real Google map of Hong Kong and the events that actually
 * exist. No region chrome, no empty-district index.
 */
export function DistrictsScreen() {
  const nav = useNavigation<RootNav>();
  const { t, lang } = useApp();
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Activity | null>(null);

  const all = listPublished();
  const term = q.trim().toLowerCase();

  const events = useMemo(() => {
    if (!term) return all;
    return all.filter((a) =>
      [
        a.title,
        a.titleEn ?? '',
        a.summary,
        a.summaryEn ?? '',
        a.address,
        a.addressEn ?? '',
        districtLabel(a.district, 'en'),
        districtLabel(a.district, 'zh-Hant'),
        districtLabel(a.district, 'zh-Hans'),
      ]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [all, term]);

  /**
   * Search wins over selection: typing a place recenters there, otherwise
   * the chosen event centres the map, otherwise the whole territory.
   */
  const { mapQuery, mapZoom, placeLabel } = useMemo(() => {
    if (term) {
      return {
        mapQuery: placeQuery(q),
        mapZoom: PLACE_ZOOM,
        placeLabel: q.trim(),
      };
    }
    if (selected) {
      return {
        mapQuery: activityMapQuery({
          lat: selected.lat ?? DISTRICT_CENTER[selected.district]?.lat,
          lng: selected.lng ?? DISTRICT_CENTER[selected.district]?.lng,
          address: selected.address,
          addressEn: selected.addressEn,
        }),
        mapZoom: PLACE_ZOOM,
        placeLabel: activityTitle(selected, lang),
      };
    }
    return {
      mapQuery: HONG_KONG,
      mapZoom: HK_DEFAULT_ZOOM,
      placeLabel: '',
    };
  }, [term, q, selected, lang]);

  const url = mapsEmbedUrl({ query: mapQuery, lang, zoom: mapZoom });

  function openEvent(a: Activity) {
    setSelected(a);
    nav.navigate('Activity', { id: a.id });
  }

  return (
    <Screen title={t('tabDistricts')} caption={t('districtsCaption')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <SearchField
            value={q}
            onChange={(next) => {
              setQ(next);
              if (next.trim()) setSelected(null);
            }}
            placeholder={t('searchPlaces')}
            onFilter={
              q || selected
                ? () => {
                    setQ('');
                    setSelected(null);
                  }
                : undefined
            }
          />
        </View>

        <View style={[styles.gutter, styles.mapBlock]}>
          <MapCard url={url} height={300} />
          {placeLabel ? (
            <Text style={[type.meta, { color: colors.muted, marginTop: space.x3 }]}>
              {placeLabel}
            </Text>
          ) : null}
        </View>

        <View style={[styles.gutter, styles.listBlock]}>
          <SectionHead
            title={t('eventsNearby')}
            caption={`${events.length} ${t('eventsCount')}`}
          />
        </View>

        <View style={[styles.gutter, styles.rows]}>
          {events.length === 0 ? (
            <EmptyState
              title={t('empty')}
              body={t('noPlaceResults')}
              action={t('clear')}
              onAction={() => {
                setQ('');
                setSelected(null);
              }}
              icon="map-pin"
            />
          ) : (
            events.map((a) => (
              <ActivityRow key={a.id} activity={a} onPress={() => openEvent(a)} />
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x10 },
  gutter: { paddingHorizontal: space.gutter },
  mapBlock: { marginTop: space.x5 },
  listBlock: { marginTop: space.x8 },
  rows: { marginTop: space.x4, gap: space.x3 },
});
