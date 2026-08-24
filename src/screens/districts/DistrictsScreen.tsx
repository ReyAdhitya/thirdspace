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
import {
  DISTRICT_CENTER,
  districtIdFromSearch,
  districtLabel,
} from '../../data/districts';
import { activityTitle } from '../../lib/localize';
import { hkTerritoryUrl, osmPlaceUrl } from '../../lib/maps';
import type { RootNav } from '../../navigation/types';
import { listPublished } from '../../services/activities';
import type { Activity } from '../../types';
import { colors, space, type } from '../../theme';

function eventPoint(a: Activity): { lat: number; lng: number } | undefined {
  if (typeof a.lat === 'number' && typeof a.lng === 'number') {
    return { lat: a.lat, lng: a.lng };
  }
  return DISTRICT_CENTER[a.district];
}

/**
 * Map is *not* inside the event list ScrollView. Nested WebView +
 * ScrollView is why iOS pans the page instead of the map.
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
   * Recentre from coords we already have. OSM embed has no geocoder.
   * 1. Selected event. 2. Search string matches a district label.
   * 3. Search is on and the filtered list is non-empty → first event.
   * 4. Whole Hong Kong, no marker.
   */
  const { url, placeLabel } = useMemo(() => {
    if (selected) {
      const pt = eventPoint(selected);
      if (pt) {
        return {
          url: osmPlaceUrl(pt.lat, pt.lng),
          placeLabel: activityTitle(selected, lang),
        };
      }
    }

    const districtId = districtIdFromSearch(q);
    if (districtId && DISTRICT_CENTER[districtId]) {
      const pt = DISTRICT_CENTER[districtId];
      return {
        url: osmPlaceUrl(pt.lat, pt.lng),
        placeLabel: districtLabel(districtId, lang),
      };
    }

    if (term && events.length > 0) {
      const pt = eventPoint(events[0]);
      if (pt) {
        return {
          url: osmPlaceUrl(pt.lat, pt.lng),
          placeLabel: activityTitle(events[0], lang),
        };
      }
    }

    return { url: hkTerritoryUrl(), placeLabel: '' };
  }, [selected, q, term, events, lang]);

  function openEvent(a: Activity) {
    setSelected(a);
    nav.navigate('Activity', { id: a.id });
  }

  return (
    <Screen title={t('tabDistricts')} caption={t('districtsCaption')}>
      <View style={styles.body}>
        <View style={styles.gutter}>
          <SearchField
            value={q}
            onChange={(next) => {
              setQ(next);
              if (next.trim()) setSelected(null);
            }}
            placeholder={t('searchPlaces')}
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
            action={q || selected ? t('clear') : undefined}
            onAction={
              q || selected
                ? () => {
                    setQ('');
                    setSelected(null);
                  }
                : undefined
            }
          />
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gutter}>
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
              <View style={styles.rows}>
                {events.map((a) => (
                  <ActivityRow key={a.id} activity={a} onPress={() => openEvent(a)} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1 },
  gutter: { paddingHorizontal: space.gutter },
  mapBlock: { marginTop: space.x5 },
  listBlock: { marginTop: space.x6 },
  list: { flex: 1 },
  listContent: { paddingBottom: space.x10, paddingTop: space.x4 },
  rows: { gap: space.x3 },
});
