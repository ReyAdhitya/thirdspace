import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { SectionHead } from '../../components/Text';
import { useApp } from '../../context/AppContext';
import { DISTRICTS, districtLabel } from '../../data/districts';
import type { RootNav } from '../../navigation/types';
import { setLanguage, signOut, updateProfile } from '../../services/auth';
import type { AppLanguage } from '../../types';
import { colors, space, type } from '../../theme';

const LANGS: AppLanguage[] = ['zh-Hant', 'en', 'zh-Hans'];

export function SettingsScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, lang } = useApp();

  async function out() {
    await signOut();
  }

  return (
    <Screen onBack={() => nav.goBack()} title={t('settings')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          <SectionHead label={t('language')} />
          <View style={styles.list}>
            {LANGS.map((code) => {
              const on = lang === code;
              return (
                <Pressable
                  key={code}
                  onPress={() => user && void setLanguage(user.uid, code)}
                  style={styles.row}
                >
                  <View
                    style={[
                      styles.mark,
                      { backgroundColor: on ? colors.accent : 'transparent' },
                    ]}
                  />
                  <Text
                    style={[type.bodyStrong, { color: on ? colors.ink : colors.dim, flex: 1 }]}
                  >
                    {code === 'en'
                      ? t('langEn')
                      : code === 'zh-Hans'
                        ? t('langZhHans')
                        : t('langZhHant')}
                  </Text>
                  <Text style={[type.label, { color: colors.faint }]}>{code}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.section}>
            <SectionHead label={t('district')} />
            <View style={styles.list}>
              {DISTRICTS.slice(0, 10).map((d) => {
                const on = user?.homeDistrict === d.id;
                return (
                  <Pressable
                    key={d.id}
                    onPress={() =>
                      user && void updateProfile(user.uid, { homeDistrict: d.id })
                    }
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
                        type.bodyStrong,
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

          <View style={styles.section}>
            <SectionHead label={t('notifications')} />
            <Text style={[type.body, { color: colors.dim, marginTop: space.x4 }]}>
              {t('notificationsHint')}
            </Text>
          </View>

          <View style={styles.section}>
            <Button label={t('logout')} variant="destructive" onPress={() => void out()} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: space.x4, paddingBottom: space.x16 },
  gutter: { paddingHorizontal: space.gutter },
  list: { marginTop: space.x2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    paddingVertical: space.x4,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  mark: { width: 2, height: 14 },
  section: { marginTop: space.x12 },
});
