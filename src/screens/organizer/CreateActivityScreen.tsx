import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
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

import { Button } from '../../components/Button';
import { MoodPicker } from '../../components/MoodPicker';
import { Screen } from '../../components/Screen';
import { SectionHead } from '../../components/Text';
import { useApp } from '../../context/AppContext';
import { DISTRICTS, districtLabel } from '../../data/districts';
import { fromDatetimeLocalValue, hkIso, toDatetimeLocalValue } from '../../lib/time';
import type { RootNav, RootStackParamList } from '../../navigation/types';
import {
  createActivity,
  getActivity,
  updateActivity,
} from '../../services/activities';
import { STOCK_PHOTOS, pickPhoto } from '../../services/storage';
import type { EventLanguage, MoodId } from '../../types';
import { colors, radius, space, type } from '../../theme';

export function CreateActivityScreen() {
  const nav = useNavigation<RootNav>();
  const route = useRoute<RouteProp<RootStackParamList, 'CreateActivity'>>();
  const editing = route.params?.id;
  const existing = editing ? getActivity(editing) : undefined;
  const { t, user, lang, showBanner } = useApp();

  const [title, setTitle] = useState(existing?.title ?? '');
  const [summary, setSummary] = useState(existing?.summary ?? '');
  const [district, setDistrict] = useState(existing?.district ?? 'central');
  const [address, setAddress] = useState(existing?.address ?? '');
  const [price, setPrice] = useState(String(existing?.priceHkd ?? 0));
  const [capacity, setCapacity] = useState(String(existing?.capacity ?? 12));
  const [photoUrl, setPhotoUrl] = useState(existing?.photoUrl ?? STOCK_PHOTOS[0]);
  const [moods, setMoods] = useState<MoodId[]>(existing?.mood ?? ['quiet']);
  const [eventLanguage, setEventLanguage] = useState<EventLanguage>(
    existing?.eventLanguage ?? 'zh-Hant',
  );
  const [starts, setStarts] = useState(
    existing
      ? toDatetimeLocalValue(existing.startsAt)
      : toDatetimeLocalValue(hkIso(2026, 9, 5, 19, 0)),
  );
  const [ends, setEnds] = useState(
    existing
      ? toDatetimeLocalValue(existing.endsAt)
      : toDatetimeLocalValue(hkIso(2026, 9, 5, 21, 0)),
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const langs = useMemo(
    () =>
      [
        ['zh-Hant', t('langZhHant')],
        ['en', t('langEn')],
        ['zh-Hans', t('langZhHans')],
        ['mixed', t('mixed')],
      ] as const,
    [t],
  );

  if (!user) {
    return (
      <Screen onBack={() => nav.goBack()}>
        <Text style={[type.body, { color: colors.dim, padding: space.gutter }]}>
          {t('needLogin')}
        </Text>
      </Screen>
    );
  }

  const uid = user.uid;

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      if (!title.trim()) throw new Error(t('title'));
      const payload = {
        title: title.trim(),
        summary: summary.trim() || title.trim(),
        district,
        address: address.trim() || districtLabel(district, lang),
        photoUrl,
        startsAt: fromDatetimeLocalValue(starts),
        endsAt: fromDatetimeLocalValue(ends),
        priceHkd: Number(price) || 0,
        capacity: Math.max(1, Number(capacity) || 12),
        eventLanguage,
        mood: moods.length ? moods : (['quiet'] as MoodId[]),
        organizerId: existing?.organizerId ?? uid,
        featured: existing?.featured ?? false,
      };
      if (existing) {
        await updateActivity(existing.id, payload);
        showBanner(t('editEvent'));
        nav.goBack();
      } else {
        const row = await createActivity(payload);
        showBanner(t('createEvent'));
        nav.replace('Activity', { id: row.id });
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : t('error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen
      onBack={() => nav.goBack()}
      title={existing ? t('editEvent') : t('createEvent')}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.gutter}>
          <Image source={{ uri: photoUrl }} style={styles.photo} contentFit="cover" />
          <View style={styles.photoRow}>
            <Pressable
              onPress={async () => {
                const uri = await pickPhoto();
                if (uri) setPhotoUrl(uri);
              }}
              hitSlop={8}
            >
              <Text style={[type.label, { color: colors.ink }]}>{t('pickPhoto')}</Text>
            </Pressable>
            <View style={styles.thumbs}>
              {STOCK_PHOTOS.slice(0, 4).map((u) => (
                <Pressable key={u} onPress={() => setPhotoUrl(u)}>
                  <Image
                    source={{ uri: u }}
                    style={[
                      styles.thumb,
                      photoUrl === u && { borderColor: colors.accent },
                    ]}
                    contentFit="cover"
                  />
                </Pressable>
              ))}
            </View>
          </View>

          <Field label={t('title')} value={title} onChange={setTitle} />
          <Field label={t('summary')} value={summary} onChange={setSummary} multiline />

          <View style={styles.section}>
            <SectionHead label={t('district')} />
            <View style={styles.index}>
              {DISTRICTS.map((d) => {
                const on = district === d.id;
                return (
                  <Pressable
                    key={d.id}
                    onPress={() => setDistrict(d.id)}
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
                        type.bodySm,
                        { color: on ? colors.ink : colors.dim, flex: 1 },
                      ]}
                    >
                      {districtLabel(d.id, lang)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Field label={t('address')} value={address} onChange={setAddress} />
          <Field label={t('starts')} value={starts} onChange={setStarts} mono />
          <Field label={t('ends')} value={ends} onChange={setEnds} mono />
          <Field label={t('price')} value={price} onChange={setPrice} mono />
          <Field label={t('capacity')} value={capacity} onChange={setCapacity} mono />

          <View style={styles.section}>
            <SectionHead label={t('eventLang')} />
            <View style={styles.words}>
              {langs.map(([code, label]) => {
                const on = eventLanguage === code;
                return (
                  <Pressable key={code} onPress={() => setEventLanguage(code)} hitSlop={6}>
                    <Text
                      style={[type.bodyStrong, { color: on ? colors.ink : colors.dim }]}
                    >
                      {label}
                    </Text>
                    <View
                      style={[
                        styles.wordMark,
                        { backgroundColor: on ? colors.accent : 'transparent' },
                      ]}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <SectionHead label={t('interestsTitle')} />
            <View style={{ marginTop: space.x4 }}>
              <MoodPicker
                value={moods}
                wrap
                onChange={(id) =>
                  setMoods((cur) =>
                    cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
                  )
                }
              />
            </View>
          </View>

          {err ? (
            <Text style={[type.meta, { color: colors.accent, marginTop: space.x6 }]}>
              {err}
            </Text>
          ) : null}

          <View style={{ marginTop: space.x8 }}>
            <Button label={t('publish')} onPress={() => void save()} loading={busy} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  mono?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ marginTop: space.x6 }}>
      <Text style={[type.label, { color: colors.faint }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholderTextColor={colors.faint}
        style={[
          styles.input,
          mono && { fontFamily: type.data.fontFamily as string, fontSize: 15 },
          multiline && { minHeight: 88, textAlignVertical: 'top' },
          { borderBottomColor: focus ? colors.ink : colors.hairlineStrong },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: space.x4, paddingBottom: space.x16 },
  gutter: { paddingHorizontal: space.gutter },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: radius.xs,
    backgroundColor: colors.raised,
  },
  photoRow: {
    marginTop: space.x4,
    gap: space.x4,
  },
  thumbs: { flexDirection: 'row', gap: space.x2 },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  section: { marginTop: space.x12 },
  index: { marginTop: space.x2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    paddingVertical: space.x3,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  mark: { width: 2, height: 12 },
  words: { flexDirection: 'row', flexWrap: 'wrap', gap: space.x6, marginTop: space.x4 },
  wordMark: { height: 2, marginTop: space.x2 },
  input: {
    borderBottomWidth: 1,
    paddingVertical: space.x3,
    marginTop: space.x2,
    color: colors.ink,
    fontSize: 16,
    borderRadius: radius.none,
  },
});
