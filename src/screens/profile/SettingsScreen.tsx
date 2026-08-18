import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import type { RootNav } from '../../navigation/types';
import { setLanguage, signOut, updateProfile } from '../../services/auth';
import { DISTRICTS, districtLabel } from '../../data/districts';
import type { AppLanguage } from '../../types';
import { colors, space, type } from '../../theme';

const LANGS: AppLanguage[] = ['zh-Hant', 'en', 'zh-Hans'];

export function SettingsScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, lang } = useApp();

  async function out() {
    await signOut();
    nav.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  return (
    <Screen onBack={() => nav.goBack()} title={t('settings')}>
      <View style={styles.pad}>
        <Text style={[type.label, { color: colors.muted }]}>{t('language')}</Text>
        <View style={{ gap: 8, marginTop: 10 }}>
          {LANGS.map((code) => (
            <Pressable
              key={code}
              onPress={() => user && void setLanguage(user.uid, code)}
              style={[styles.row, lang === code && styles.on]}
            >
              <Text style={[type.body, { color: colors.ink }]}>
                {code === 'en' ? t('langEn') : code === 'zh-Hans' ? t('langZhHans') : t('langZhHant')}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[type.label, { color: colors.muted, marginTop: 24 }]}>{t('district')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {DISTRICTS.slice(0, 8).map((d) => (
            <Pressable
              key={d.id}
              onPress={() => user && void updateProfile(user.uid, { homeDistrict: d.id })}
              style={[styles.chip, user?.homeDistrict === d.id && styles.on]}
            >
              <Text style={[type.meta, { color: colors.ink }]}>{districtLabel(d.id, lang)}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[type.h2, { color: colors.ink, marginTop: 28 }]}>{t('notifications')}</Text>
        <Text style={[type.body, { color: colors.muted, marginTop: 8 }]}>
          {t('notificationsHint')}
        </Text>

        <View style={{ marginTop: 32 }}>
          <Button label={t('logout')} variant="danger" onPress={() => void out()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { padding: space.screen },
  row: {
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  on: { borderColor: colors.pine, backgroundColor: colors.pineSoft },
});
