import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';

import { ActivityCard } from '../../components/ActivityCard';
import { EmptyState } from '../../components/EmptyState';
import { MoodChips } from '../../components/MoodChips';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { districtLabel } from '../../data/districts';
import { formatDay, hkHour } from '../../lib/time';
import type { RootNav } from '../../navigation/types';
import {
  featuredActivity,
  filterByMood,
  listPublished,
  popularActivities,
  searchActivities,
} from '../../services/activities';
import { followedOrganizerIds } from '../../services/follows';
import { isSaved, toggleSave } from '../../services/saves';
import type { MoodId } from '../../types';
import { colors, radius, space, type } from '../../theme';

export function DiscoverScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, lang, showBanner } = useApp();
  const [q, setQ] = useState('');
  const [mood, setMood] = useState<MoodId | null>(null);
  const [seeAll, setSeeAll] = useState(false);
  const hour = hkHour();
  const greet =
    hour < 12 ? t('greetingMorning') : hour < 18 ? t('greetingAfternoon') : t('greetingEvening');

  const all = listPublished();
  const featured = featuredActivity();
  const popular = popularActivities().slice(0, 6);
  const followed = user ? followedOrganizerIds(user.uid) : [];

  const recommended = useMemo(() => {
    if (q.trim()) return searchActivities(q);
    if (mood) return filterByMood(mood, user?.homeDistrict ?? 'central');
    const interests = user?.interests ?? [];
    let pool = all;
    if (interests.length) {
      const hit = all.filter((a) => a.mood.some((m) => interests.includes(m)));
      if (hit.length) pool = hit;
    }
    const fromFollow = all.filter((a) => followed.includes(a.organizerId));
    const rest = pool.filter((a) => !fromFollow.some((f) => f.id === a.id));
    return [...fromFollow, ...rest];
  }, [q, mood, all, user, followed]);

  async function heart(id: string) {
    if (!user) {
      showBanner(t('needLogin'), 'warn');
      return;
    }
    const on = await toggleSave(user.uid, id);
    showBanner(on ? t('savedOn') : t('save'));
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View style={styles.searchRow}>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={colors.muted}
            style={styles.search}
          />
          <Pressable onPress={() => nav.navigate('Settings')} style={styles.gear}>
            <Text style={{ fontSize: 16, color: colors.ink }}>⚙</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: space.screen, marginTop: 8 }}>
          <Text style={[type.greeting, { color: colors.ink }]}>{greet}</Text>
          <Text style={[type.body, { color: colors.muted, marginTop: 6 }]}>
            {t('greetingAsk')}
          </Text>
          <MoodChips
            value={mood}
            onChange={(id) => setMood((cur) => (cur === id ? null : id))}
          />
        </View>

        {followed.length > 0 && !q && !mood ? (
          <View style={{ paddingHorizontal: space.screen, marginBottom: 8 }}>
            <Text style={[type.meta, { color: colors.pine }]}>{t('followingHosts')}</Text>
          </View>
        ) : null}

        <View style={styles.sectionHead}>
          <Text style={[type.h2, { color: colors.ink }]}>{t('popular')}</Text>
          <Pressable onPress={() => setSeeAll((v) => !v)}>
            <Text style={[type.meta, { color: colors.pine }]}>{t('seeAll')}</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {(seeAll ? all : popular).map((a) => (
            <ActivityCard
              key={a.id}
              activity={a}
              onPress={() => nav.navigate('Activity', { id: a.id })}
            />
          ))}
        </ScrollView>

        {featured ? (
          <Pressable
            onPress={() => nav.navigate('Activity', { id: featured.id })}
            style={styles.feature}
          >
            <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
              <Text style={[type.meta, { color: colors.pineSoft }]}>{t('featuredKicker')}</Text>
              <Text style={[type.h2, { color: colors.paper, marginTop: 8 }]}>{t('featured')}</Text>
              <Text style={[type.meta, { color: colors.pineSoft, marginTop: 8 }]} numberOfLines={2}>
                {featured.title} · {districtLabel(featured.district, lang)} ·{' '}
                {formatDay(featured.startsAt, lang)}
              </Text>
            </View>
            <Image source={{ uri: featured.photoUrl }} style={styles.featureImg} contentFit="cover" />
          </Pressable>
        ) : null}

        <View style={styles.sectionHead}>
          <Text style={[type.h2, { color: colors.ink }]}>{t('recommended')}</Text>
        </View>
        {recommended.length === 0 ? (
          <EmptyState title={t('empty')} body={t('empty')} />
        ) : (
          <View style={styles.grid}>
            {recommended.map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                variant="grid"
                saved={user ? isSaved(user.uid, a.id) : false}
                onHeart={() => void heart(a.id)}
                onPress={() => nav.navigate('Activity', { id: a.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: space.screen,
    paddingTop: 4,
    alignItems: 'center',
  },
  search: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
  },
  gear: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  sectionHead: {
    paddingHorizontal: space.screen,
    marginTop: 22,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hScroll: { paddingHorizontal: space.screen },
  feature: {
    marginHorizontal: space.screen,
    marginTop: 8,
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 132,
  },
  featureImg: { width: 140, height: '100%' },
  grid: {
    paddingHorizontal: space.screen,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
