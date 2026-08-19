import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { MoodPicker } from '../../components/MoodPicker';
import { Photo } from '../../components/Photo';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { DISTRICTS, districtLabel } from '../../data/districts';
import { errorText } from '../../lib/errors';
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
  const [paid, setPaid] = useState((existing?.priceHkd ?? 0) > 0);
  const [price, setPrice] = useState(String(existing?.priceHkd ?? 0));
  const [capacity, setCapacity] = useState(existing?.capacity ?? 20);
  const [photoUrl, setPhotoUrl] = useState(existing?.photoUrl ?? '');
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
  const [pickDistrict, setPickDistrict] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!user) {
    return (
      <Screen onClose={() => nav.goBack()} title={t('createTitle')}>
        <Text style={[type.body, { color: colors.muted, padding: space.gutter }]}>
          {t('needLogin')}
        </Text>
      </Screen>
    );
  }

  const uid = user.uid;
  const [startDate, startTime] = starts.split('T');
  const [, endTime] = ends.split('T');

  function setStartDate(v: string) {
    setStarts(`${v}T${startTime}`);
    setEnds(`${v}T${endTime}`);
  }

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      if (!title.trim()) throw new Error('title-required');
      const payload = {
        title: title.trim(),
        summary: summary.trim() || title.trim(),
        district,
        address: address.trim() || districtLabel(district, lang),
        photoUrl: photoUrl || STOCK_PHOTOS[0],
        startsAt: fromDatetimeLocalValue(starts),
        endsAt: fromDatetimeLocalValue(ends),
        priceHkd: paid ? Number(price) || 0 : 0,
        capacity: Math.max(1, capacity),
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
      setErr(errorText(e, t));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen
      onClose={() => nav.goBack()}
      title={existing ? t('editEvent') : t('createTitle')}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <Pressable
            style={styles.upload}
            onPress={async () => {
              const uri = await pickPhoto();
              if (uri) setPhotoUrl(uri);
            }}
          >
            {photoUrl ? (
              <Photo uri={photoUrl} style={StyleSheet.absoluteFill} />
            ) : (
              <>
                <Icon name="camera" size={24} color={colors.harbor} />
                <Text style={[type.meta, { color: colors.muted, marginTop: space.x2 }]}>
                  {t('addPhoto')}
                </Text>
              </>
            )}
          </Pressable>
          <View style={styles.stockRow}>
            {STOCK_PHOTOS.slice(0, 5).map((u) => (
              <Pressable key={u} onPress={() => setPhotoUrl(u)}>
                <Photo
                  uri={u}
                  style={[styles.stock, photoUrl === u && styles.stockOn]}
                />
              </Pressable>
            ))}
          </View>

          <Field label={t('eventName')} value={title} onChange={setTitle} />
          <Field
            label={t('aboutActivity')}
            value={summary}
            onChange={setSummary}
            multiline
          />

          <Label text={t('locationLabel')} />
          <Pressable style={styles.select} onPress={() => setPickDistrict((v) => !v)}>
            <Text style={[type.body, { color: colors.ink, flex: 1 }]}>
              {districtLabel(district, lang)}
            </Text>
            <Icon name="chevron-right" size={16} color={colors.faint} />
          </Pressable>
          {pickDistrict ? (
            <View style={styles.options}>
              {DISTRICTS.map((d) => (
                <Pressable
                  key={d.id}
                  onPress={() => {
                    setDistrict(d.id);
                    setPickDistrict(false);
                  }}
                  style={styles.option}
                >
                  <Text
                    style={[
                      type.body,
                      { color: district === d.id ? colors.pine : colors.ink, flex: 1 },
                    ]}
                  >
                    {districtLabel(d.id, lang)}
                  </Text>
                  {district === d.id ? (
                    <Icon name="check" size={16} color={colors.pine} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}
          <View style={{ height: space.x3 }} />
          <Field label={t('address')} value={address} onChange={setAddress} />

          <View style={styles.split}>
            <View style={{ flex: 1 }}>
              <Field label={t('dateLabel')} value={startDate} onChange={setStartDate} />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label={t('timeLabel')}
                value={startTime}
                onChange={(v) => setStarts(`${startDate}T${v}`)}
              />
            </View>
          </View>

          <Label text={t('feeLabel')} />
          <View style={styles.toggleRow}>
            <Pressable
              onPress={() => setPaid(false)}
              style={[styles.toggle, !paid && styles.toggleOn]}
            >
              <Text
                style={[type.metaStrong, { color: !paid ? colors.white : colors.muted }]}
              >
                {t('freeOption')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setPaid(true)}
              style={[styles.toggle, paid && styles.toggleOn]}
            >
              <Text
                style={[type.metaStrong, { color: paid ? colors.white : colors.muted }]}
              >
                {t('paidOption')}
              </Text>
            </Pressable>
          </View>
          {paid ? (
            <View style={{ marginTop: space.x3 }}>
              <Field label="HK$" value={price} onChange={setPrice} />
            </View>
          ) : null}

          <Label text={t('quotaLabel')} />
          <View style={styles.stepper}>
            <Pressable
              onPress={() => setCapacity((c) => Math.max(1, c - 1))}
              style={styles.step}
            >
              <Icon name="minus" size={16} color={colors.ink} />
            </Pressable>
            <Text style={[type.bodyStrong, { color: colors.ink }]}>{capacity}</Text>
            <Pressable onPress={() => setCapacity((c) => c + 1)} style={styles.step}>
              <Icon name="plus" size={16} color={colors.ink} />
            </Pressable>
          </View>

          <Label text={t('moodSection')} />
          <View style={{ marginTop: space.x1 }}>
            <MoodPicker
              value={moods}
              onChange={(id) =>
                setMoods((cur) =>
                  cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
                )
              }
            />
          </View>

          <Label text={t('eventLang')} />
          <View style={styles.toggleRow}>
            {(
              [
                ['zh-Hant', t('langZhHant')],
                ['en', t('langEn')],
                ['mixed', t('mixed')],
              ] as const
            ).map(([code, label]) => {
              const on = eventLanguage === code;
              return (
                <Pressable
                  key={code}
                  onPress={() => setEventLanguage(code)}
                  style={[styles.toggle, on && styles.toggleOn]}
                >
                  <Text
                    style={[type.metaStrong, { color: on ? colors.white : colors.muted }]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {err ? (
            <Text style={[type.meta, { color: colors.rose, marginTop: space.x4 }]}>
              {err}
            </Text>
          ) : null}

          <View style={{ marginTop: space.x8 }}>
            <Button
              label={existing ? t('publish') : t('createTitle')}
              onPress={() => void save()}
              loading={busy}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Label({ text }: { text: string }) {
  return (
    <Text style={[type.small, { color: colors.muted, marginTop: space.x5 }]}>
      {text}
    </Text>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <View style={{ marginTop: space.x5 }}>
      <Text style={[type.small, { color: colors.muted, marginBottom: space.x2 }]}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        placeholderTextColor={colors.faint}
        style={[styles.input, multiline && styles.inputTall]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x12 },
  gutter: { paddingHorizontal: space.gutter },
  upload: {
    height: 150,
    borderRadius: radius.lg,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.hairlineOnPaper,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  stockRow: { flexDirection: 'row', gap: space.x2, marginTop: space.x2 },
  stock: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.pineSoft,
    overflow: 'hidden',
  },
  stockOn: { borderColor: colors.pine },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: space.x3,
    height: 46,
    color: colors.ink,
    fontSize: 15,
    fontFamily: type.body.fontFamily as string,
  },
  inputTall: { height: 92, paddingTop: space.x3, textAlignVertical: 'top' },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: space.x3,
    height: 46,
    marginTop: space.x2,
  },
  options: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: space.x3,
    marginTop: space.x2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.x3,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  split: { flexDirection: 'row', gap: space.x3 },
  toggleRow: { flexDirection: 'row', gap: space.x2, marginTop: space.x2 },
  toggle: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: space.x3,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  toggleOn: { backgroundColor: colors.pine, borderColor: colors.pine },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: space.x3,
    height: 46,
    marginTop: space.x2,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.stone,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
