import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ActivityCard } from '../../components/ActivityCard';
import { EmptyState } from '../../components/EmptyState';
import { MoodPicker } from '../../components/MoodPicker';
import { Screen } from '../../components/Screen';
import { SectionHead } from '../../components/Text';
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
import { colors, radius, space, type, useShell } from '../../theme';

export function DiscoverScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, lang, showBanner } = useApp();
  const { isDesktop } = useShell();
  const [q, setQ] = useState('');
  const [mood, setMood] = useState<MoodId | null>(null);
  const [searchFocus, setSearchFocus] = useState(false);

  const hour = hkHour();
  const greet =
    hour < 12
      ? t('greetingMorning')
      : hour < 18
        ? t('greetingAfternoon')
        : t('greetingEvening');

  const all = listPublished();
  const featured = featuredActivity();
  const popular = popularActivities().slice(0, 6);
  const followed = user ? followedOrganizerIds(user.uid) : [];
  const filtering = Boolean(q.trim() || mood);

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

  async function save(id: string) {
    if (!user) {
      showBanner(t('needLogin'), 'warn');
      return;
    }
    const on = await toggleSave(user.uid, id);
    showBanner(on ? t('savedOn') : t('save'));
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <Text style={[type.display, { color: colors.ink }]}>{greet}</Text>
          <Text
            style={[type.body, { color: colors.dim, marginTop: space.x3, maxWidth: 320 }]}
          >
            {t('greetingAsk')}
          </Text>

          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={colors.faint}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            style={[
              styles.search,
              { borderBottomColor: searchFocus ? colors.ink : colors.hairlineStrong },
            ]}
          />

          <View style={{ marginTop: space.x6 }}>
            <MoodPicker
              value={mood}
              onChange={(id) => setMood((cur) => (cur === id ? null : id))}
              wrap
            />
          </View>
        </View>

        {filtering ? null : (
          <>
            <View style={[styles.gutter, styles.section]}>
              <SectionHead label={t('popular')} />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
            >
              {popular.map((a) => (
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
                style={[styles.gutter, styles.featureWrap]}
              >
                <Image
                  source={{ uri: featured.photoUrl }}
                  style={[styles.featureImg, isDesktop && { height: 320 }]}
                  contentFit="cover"
                  transition={240}
                />
                <View style={styles.featureCopy}>
                  <Text style={[type.label, { color: colors.accent }]}>
                    {t('featured')}
                  </Text>
                  <Text
                    style={[type.displaySm, { color: colors.ink, marginTop: space.x2 }]}
                    numberOfLines={2}
                  >
                    {featured.title}
                  </Text>
                  <Text style={[type.data, { color: colors.dim, marginTop: space.x2 }]}>
                    {districtLabel(featured.district, lang)} ·{' '}
                    {formatDay(featured.startsAt, lang)}
                  </Text>
                </View>
              </Pressable>
            ) : null}
          </>
        )}

        <View style={[styles.gutter, styles.section]}>
          <SectionHead
            label={filtering ? t('results') : t('recommended')}
            action={filtering ? t('clear') : undefined}
            onAction={
              filtering
                ? () => {
                    setQ('');
                    setMood(null);
                  }
                : undefined
            }
          />
          {!filtering && followed.length > 0 ? (
            <Text style={[type.meta, { color: colors.faint, marginTop: space.x3 }]}>
              {t('followingHosts')}
            </Text>
          ) : null}
        </View>

        <View style={styles.gutter}>
          {recommended.length === 0 ? (
            <EmptyState
              title={t('empty')}
              body={t('greetingAsk')}
              action={t('clear')}
              onAction={() => {
                setQ('');
                setMood(null);
              }}
            />
          ) : (
            <View style={isDesktop ? styles.grid : undefined}>
              {recommended.map((a) => (
                <View key={a.id} style={isDesktop ? styles.gridItem : undefined}>
                  <ActivityCard
                    activity={a}
                    variant="stack"
                    saved={user ? isSaved(user.uid, a.id) : false}
                    onSave={() => void save(a.id)}
                    onPress={() => nav.navigate('Activity', { id: a.id })}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: space.x6, paddingBottom: space.x16 },
  gutter: { paddingHorizontal: space.gutter },
  section: { marginTop: space.x12, marginBottom: space.x6 },
  search: {
    marginTop: space.x8,
    borderBottomWidth: 1,
    paddingVertical: space.x3,
    color: colors.ink,
    fontSize: 16,
    borderRadius: radius.none,
  },
  rail: { paddingHorizontal: space.gutter },
  featureWrap: { marginTop: space.x12 },
  featureImg: {
    width: '100%',
    height: 260,
    borderRadius: radius.xs,
    backgroundColor: colors.raised,
  },
  featureCopy: { marginTop: space.x4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: { width: '48%' },
});
