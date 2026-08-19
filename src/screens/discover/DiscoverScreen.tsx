import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityHeroCard, ActivityRow } from '../../components/ActivityCard';
import { EmptyState } from '../../components/EmptyState';
import { MoodPicker } from '../../components/MoodPicker';
import { Screen } from '../../components/Screen';
import { SearchField } from '../../components/SearchField';
import { SectionHead } from '../../components/SectionHead';
import { useApp } from '../../context/AppContext';
import type { RootNav } from '../../navigation/types';
import {
  filterByMood,
  listPublished,
  popularActivities,
  searchActivities,
} from '../../services/activities';
import { followedOrganizerIds } from '../../services/follows';
import { isSaved, toggleSave } from '../../services/saves';
import type { MoodId } from '../../types';
import { colors, space } from '../../theme';

export function DiscoverScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, showBanner } = useApp();
  const [q, setQ] = useState('');
  const [mood, setMood] = useState<MoodId | null>(null);
  const [seeAllPopular, setSeeAllPopular] = useState(false);

  const all = listPublished();
  const popular = popularActivities();
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

  const heroes = seeAllPopular ? popular : popular.slice(0, 2);

  return (
    <Screen title={t('tabDiscover')} caption={t('discoverCaption')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          {/* Mood tiles below are the filter; no separate filter control. */}
          <SearchField
            value={q}
            onChange={setQ}
            placeholder={t('searchActivities')}
          />
        </View>

        <View style={[styles.gutter, styles.block]}>
          {/* No See all: every mood is already on the row below. */}
          <SectionHead title={t('moodSection')} caption={t('moodCaption')} />
        </View>
        <View style={styles.moodRow}>
          <MoodPicker
            value={mood}
            onChange={(id) => setMood((cur) => (cur === id ? null : id))}
          />
        </View>

        {filtering ? null : (
          <>
            <View style={[styles.gutter, styles.block]}>
              <SectionHead
                title={t('popularSection')}
                action={t('seeAllBoard')}
                onAction={() => setSeeAllPopular((v) => !v)}
              />
            </View>
            <View style={[styles.gutter, styles.heroStack]}>
              {heroes.map((a) => (
                <ActivityHeroCard
                  key={a.id}
                  activity={a}
                  saved={user ? isSaved(user.uid, a.id) : false}
                  onSave={() => void save(a.id)}
                  onPress={() => nav.navigate('Activity', { id: a.id })}
                />
              ))}
            </View>
          </>
        )}

        <View style={[styles.gutter, styles.block]}>
          <SectionHead
            title={filtering ? t('results') : t('recommended')}
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
            <Text style={styles.note}>{t('followingHosts')}</Text>
          ) : null}
        </View>

        <View style={[styles.gutter, styles.rows]}>
          {recommended.length === 0 ? (
            <EmptyState
              title={t('empty')}
              body={t('ticketsEmpty')}
              action={t('clear')}
              onAction={() => {
                setQ('');
                setMood(null);
              }}
            />
          ) : (
            recommended.map((a) => (
              <ActivityRow
                key={a.id}
                activity={a}
                onPress={() => nav.navigate('Activity', { id: a.id })}
              />
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
  block: { marginTop: space.x6 },
  moodRow: { paddingLeft: space.gutter, marginTop: space.x4 },
  heroStack: { marginTop: space.x4, gap: space.x3 },
  rows: { marginTop: space.x4, gap: space.x3 },
  note: {
    fontSize: 12,
    color: colors.harbor,
    marginTop: space.x2,
  },
});
