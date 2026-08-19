import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/Button';
import { Icon, type IconName } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { DISTRICTS, districtLabel } from '../../data/districts';
import type { RootNav } from '../../navigation/types';
import { setLanguage, signOut, updateProfile } from '../../services/auth';
import type { AppLanguage } from '../../types';
import { colors, radius, space, type } from '../../theme';

const LANGS: AppLanguage[] = ['zh-Hant', 'en', 'zh-Hans'];

export function SettingsScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, lang, showBanner } = useApp();
  const [openLang, setOpenLang] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);

  const langLabel =
    lang === 'en' ? t('langEn') : lang === 'zh-Hans' ? t('langZhHans') : t('langZhHant');

  return (
    <Screen onBack={() => nav.goBack()} title={t('settingsTitle')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <View style={styles.card}>
            <Row
              icon="globe"
              label={t('rowLanguage')}
              value={langLabel}
              onPress={() => setOpenLang((v) => !v)}
            />
            {openLang ? (
              <View style={styles.expand}>
                {LANGS.map((code) => (
                  <Pressable
                    key={code}
                    onPress={() => {
                      if (user) void setLanguage(user.uid, code);
                      setOpenLang(false);
                    }}
                    style={styles.option}
                  >
                    <Text
                      style={[
                        type.body,
                        { color: lang === code ? colors.pine : colors.ink, flex: 1 },
                      ]}
                    >
                      {code === 'en'
                        ? t('langEn')
                        : code === 'zh-Hans'
                          ? t('langZhHans')
                          : t('langZhHant')}
                    </Text>
                    {lang === code ? (
                      <Icon name="check" size={16} color={colors.pine} />
                    ) : null}
                  </Pressable>
                ))}
              </View>
            ) : null}

            <Row
              icon="map-pin"
              label={t('district')}
              value={user ? districtLabel(user.homeDistrict, lang) : ''}
              onPress={() => setOpenDistrict((v) => !v)}
            />
            {openDistrict ? (
              <View style={styles.expand}>
                {DISTRICTS.slice(0, 10).map((d) => (
                  <Pressable
                    key={d.id}
                    onPress={() => {
                      if (user) void updateProfile(user.uid, { homeDistrict: d.id });
                      setOpenDistrict(false);
                    }}
                    style={styles.option}
                  >
                    <Text
                      style={[
                        type.body,
                        {
                          color:
                            user?.homeDistrict === d.id ? colors.pine : colors.ink,
                          flex: 1,
                        },
                      ]}
                    >
                      {districtLabel(d.id, lang)}
                    </Text>
                    {user?.homeDistrict === d.id ? (
                      <Icon name="check" size={16} color={colors.pine} />
                    ) : null}
                  </Pressable>
                ))}
              </View>
            ) : null}

            <Row
              icon="bell"
              label={t('rowNotifications')}
              onPress={() => showBanner(t('notificationsHint'))}
            />
            <Row
              icon="lock"
              label={t('rowSecurity')}
              onPress={() => showBanner(t('soon'))}
            />
            <Row
              icon="shield"
              label={t('rowPrivacy')}
              onPress={() => showBanner(t('soon'))}
            />
            <Row
              icon="file-text"
              label={t('rowTerms')}
              onPress={() => showBanner(t('soon'))}
            />
            <Row
              icon="info"
              label={t('rowAbout')}
              onPress={() => showBanner(t('tagline'))}
              last
            />
          </View>

          <View style={styles.logout}>
            <Button
              label={t('logoutBtn')}
              variant="paper"
              onPress={() => void signOut()}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
  last,
}: {
  icon: IconName;
  label: string;
  value?: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !last && styles.rowLine,
        pressed && { backgroundColor: colors.stone },
      ]}
    >
      <Icon name={icon} size={19} color={colors.pine} />
      <Text style={[type.body, { color: colors.ink, flex: 1 }]}>{label}</Text>
      {value ? (
        <Text style={[type.meta, { color: colors.muted }]}>{value}</Text>
      ) : null}
      <Icon name="chevron-right" size={16} color={colors.faint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x10 },
  gutter: { paddingHorizontal: space.gutter },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    paddingHorizontal: space.x4,
    paddingVertical: space.x4,
  },
  rowLine: { borderBottomWidth: 1, borderBottomColor: colors.hairline },
  expand: { backgroundColor: colors.stone, paddingHorizontal: space.x4 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.x3,
  },
  logout: { marginTop: space.x8 },
});
