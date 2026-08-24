import { useNavigation } from '@react-navigation/native';
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
import { Photo } from '../../components/Photo';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { DISTRICTS, districtLabel } from '../../data/districts';
import { errorText } from '../../lib/errors';
import { userBio, userName } from '../../lib/localize';
import type { RootNav } from '../../navigation/types';
import { updateProfile } from '../../services/auth';
import { pickPhoto } from '../../services/storage';
import { colors, radius, space, type } from '../../theme';

export function EditProfileScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, lang, showBanner } = useApp();

  const [name, setName] = useState(user ? userName(user, lang) : '');
  const [bio, setBio] = useState(user ? userBio(user, lang) : '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl ?? '');
  const [district, setDistrict] = useState(user?.homeDistrict ?? 'central');
  const [pickDistrict, setPickDistrict] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!user) {
    return (
      <Screen onBack={() => nav.goBack()} title={t('editProfile')}>
        <Text style={[type.body, { color: colors.muted, padding: space.gutter }]}>
          {t('needLogin')}
        </Text>
      </Screen>
    );
  }

  const uid = user.uid;
  const fallbackName = user.displayName;

  async function save() {
    setBusy(true);
    try {
      const trimmed = name.trim() || fallbackName;
      const patch =
        lang === 'en'
          ? { displayNameEn: trimmed, bioEn: bio.trim(), photoUrl, homeDistrict: district }
          : { displayName: trimmed, bio: bio.trim(), photoUrl, homeDistrict: district };
      await updateProfile(uid, patch);
      showBanner(t('save'));
      nav.goBack();
    } catch (e) {
      showBanner(errorText(e, t), 'warn');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen onBack={() => nav.goBack()} title={t('editProfile')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <Pressable
            style={styles.photoHit}
            onPress={async () => {
              try {
                const uri = await pickPhoto();
                if (uri) setPhotoUrl(uri);
              } catch (e) {
                showBanner(errorText(e, t), 'warn');
              }
            }}
          >
            {photoUrl ? (
              <Photo uri={photoUrl} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarEmpty]}>
                <Icon name="camera" size={22} color={colors.harbor} />
              </View>
            )}
            <Text style={[type.meta, { color: colors.pine, marginTop: space.x2 }]}>
              {t('pickPhoto')}
            </Text>
          </Pressable>

          <Label text={t('displayName')} />
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor={colors.faint}
          />

          <Label text={t('bio')} />
          <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            style={[styles.input, styles.inputTall]}
            placeholderTextColor={colors.faint}
          />

          <Label text={t('district')} />
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

          <View style={{ marginTop: space.x8 }}>
            <Button label={t('save')} onPress={() => void save()} loading={busy} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Label({ text }: { text: string }) {
  return (
    <Text style={[type.small, { color: colors.muted, marginTop: space.x5, marginBottom: space.x2 }]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x12 },
  gutter: { paddingHorizontal: space.gutter },
  photoHit: { alignItems: 'center', marginTop: space.x2 },
  avatar: { width: 88, height: 88, borderRadius: radius.pill },
  avatarEmpty: {
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: space.x3,
    minHeight: 46,
    color: colors.ink,
    fontSize: 15,
    fontFamily: type.body.fontFamily as string,
  },
  inputTall: { minHeight: 96, paddingTop: space.x3, textAlignVertical: 'top' },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: space.x3,
    minHeight: 46,
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
});
