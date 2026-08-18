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
import { MoodChips } from '../../components/MoodChips';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { DISTRICTS, districtLabel } from '../../data/districts';
import { fromDatetimeLocalValue, hkIso, toDatetimeLocalValue } from '../../lib/time';
import type { RootNav, RootStackParamList } from '../../navigation/types';
import { createActivity, getActivity, updateActivity } from '../../services/activities';
import { pickPhoto, STOCK_PHOTOS } from '../../services/storage';
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
    existing ? toDatetimeLocalValue(existing.startsAt) : toDatetimeLocalValue(hkIso(2026, 9, 5, 19, 0)),
  );
  const [ends, setEnds] = useState(
    existing ? toDatetimeLocalValue(existing.endsAt) : toDatetimeLocalValue(hkIso(2026, 9, 5, 21, 0)),
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
        <Text style={{ padding: 20 }}>{t('needLogin')}</Text>
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
    <Screen onBack={() => nav.goBack()} title={existing ? t('editEvent') : t('createEvent')}>
      <ScrollView contentContainerStyle={{ padding: space.screen, paddingBottom: 48 }}>
        <Image source={{ uri: photoUrl }} style={styles.photo} contentFit="cover" />
        <View style={{ marginTop: 10, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Button
            label={t('pickPhoto')}
            variant="ghost"
            onPress={async () => {
              const uri = await pickPhoto();
              if (uri) setPhotoUrl(uri);
            }}
          />
          {STOCK_PHOTOS.slice(0, 4).map((u) => (
            <Pressable key={u} onPress={() => setPhotoUrl(u)}>
              <Image source={{ uri: u }} style={styles.thumb} contentFit="cover" />
            </Pressable>
          ))}
        </View>

        <Label text={t('title')} />
        <Field value={title} onChange={setTitle} />
        <Label text={t('summary')} />
        <Field value={summary} onChange={setSummary} multiline />
        <Label text={t('district')} />
        <View style={styles.wrap}>
          {DISTRICTS.map((d) => (
            <Pressable
              key={d.id}
              onPress={() => setDistrict(d.id)}
              style={[styles.chip, district === d.id && styles.on]}
            >
              <Text style={[type.meta, { color: district === d.id ? colors.paper : colors.ink }]}>
                {districtLabel(d.id, lang)}
              </Text>
            </Pressable>
          ))}
        </View>
        <Label text={t('address')} />
        <Field value={address} onChange={setAddress} />
        <Label text={t('starts')} />
        <Field value={starts} onChange={setStarts} />
        <Label text={t('ends')} />
        <Field value={ends} onChange={setEnds} />
        <Label text={t('price')} />
        <Field value={price} onChange={setPrice} />
        <Label text={t('capacity')} />
        <Field value={capacity} onChange={setCapacity} />
        <Label text={t('eventLang')} />
        <View style={styles.wrap}>
          {langs.map(([code, label]) => (
            <Pressable
              key={code}
              onPress={() => setEventLanguage(code)}
              style={[styles.chip, eventLanguage === code && styles.on]}
            >
              <Text
                style={[type.meta, { color: eventLanguage === code ? colors.paper : colors.ink }]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Label text={t('moodQuiet')} />
        <MoodChips
          value={moods}
          multi
          onChange={(id) =>
            setMoods((cur) =>
              cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
            )
          }
        />
        {err ? (
          <Text style={[type.meta, { color: colors.danger, marginVertical: 8 }]}>{err}</Text>
        ) : null}
        <View style={{ marginTop: 16 }}>
          <Button label={t('publish')} onPress={() => void save()} loading={busy} />
        </View>
      </ScrollView>
    </Screen>
  );
}

function Label({ text }: { text: string }) {
  return (
    <Text style={[type.label, { color: colors.muted, marginTop: 16, marginBottom: 6 }]}>
      {text}
    </Text>
  );
}

function Field({
  value,
  onChange,
  multiline,
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      multiline={multiline}
      style={[styles.input, multiline && { minHeight: 88, textAlignVertical: 'top' }]}
    />
  );
}

const styles = StyleSheet.create({
  photo: { width: '100%', height: 180, borderRadius: radius.md },
  thumb: { width: 48, height: 48, borderRadius: 8 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
    fontSize: 16,
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  on: { backgroundColor: colors.pine, borderColor: colors.pine },
});
