import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { ArchMark } from '../../components/Logo';
import { MenuRow } from '../../components/MenuRow';
import { Photo } from '../../components/Photo';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { districtLabel } from '../../data/districts';
import { userName } from '../../lib/localize';
import type { RootNav } from '../../navigation/types';
import { setLanguage, updateProfile } from '../../services/auth';
import type { AppLanguage, Role } from '../../types';
import { PHONE_MAX_WIDTH, colors, radius, space, type } from '../../theme';

const LANGS: AppLanguage[] = ['zh-Hant', 'en', 'zh-Hans'];

function roleKey(role: Role): string {
  if (role === 'admin') return 'admin';
  if (role === 'organizer') return 'organiser';
  return 'roleUser';
}

export function ProfileScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, lang, showBanner } = useApp();
  const [openLang, setOpenLang] = useState(false);
  const [askHost, setAskHost] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (openLang) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [openLang]);

  if (!user) {
    return (
      <Screen title={t('tabProfile')}>
        <EmptyState title={t('needLogin')} icon="user" />
      </Screen>
    );
  }

  const name = userName(user, lang);
  const uid = user.uid;
  const langLabel =
    lang === 'en' ? t('langEn') : lang === 'zh-Hans' ? t('langZhHans') : t('langZhHant');

  function confirmHost() {
    void updateProfile(uid, { role: 'organizer' }).then(() => {
      setAskHost(false);
      showBanner(t('becomeOrganizerDone'));
    });
  }

  return (
    <Screen title={t('tabProfile')}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.scroll, openLang && styles.scrollRoom]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.gutter}>
          <View style={styles.card}>
            <View style={styles.grid} pointerEvents="none">
              {Array.from({ length: 5 }, (_, i) => (
                <View key={`h${i}`} style={[styles.gridH, { top: 28 + i * 32 }]} />
              ))}
              {Array.from({ length: 7 }, (_, i) => (
                <View key={`v${i}`} style={[styles.gridV, { left: 36 + i * 44 }]} />
              ))}
            </View>
            <View style={styles.cardTop}>
              <ArchMark size={40} color={colors.paper} />
              {user.photoUrl ? (
                <Photo uri={user.photoUrl} style={styles.face} />
              ) : (
                <View style={[styles.face, styles.faceEmpty]}>
                  <Icon name="user" size={22} color={colors.harbor} />
                </View>
              )}
            </View>
            <Text style={[type.h1, styles.cardName]} numberOfLines={1}>
              {name}
            </Text>
            <Text style={[type.meta, styles.cardMeta]} numberOfLines={1}>
              {t(roleKey(user.role))} · {districtLabel(user.homeDistrict, lang)} · Hong Kong
            </Text>
          </View>

          <View style={styles.menu}>
            <MenuRow
              icon="edit-3"
              label={t('editProfile')}
              onPress={() => nav.navigate('EditProfile')}
            />
            <MenuRow
              icon="clock"
              label={t('history')}
              onPress={() => nav.navigate('History')}
            />
            <MenuRow
              icon="calendar"
              label={t('yourEvents')}
              onPress={() => nav.navigate('YourEvents')}
            />
            <MenuRow
              icon="heart"
              label={t('saved')}
              onPress={() => nav.navigate('Saved')}
            />
            <MenuRow
              icon="users"
              label={t('following')}
              onPress={() => nav.navigate('Following')}
            />
            {user.role === 'user' ? (
              <MenuRow
                icon="user-plus"
                label={t('becomeOrganizer')}
                onPress={() => setAskHost(true)}
              />
            ) : null}
            {user.role === 'admin' ? (
              <MenuRow
                icon="shield"
                label={t('reportsTitle')}
                onPress={() => nav.navigate('Admin')}
              />
            ) : null}
            <MenuRow
              icon="globe"
              label={t('rowLanguage')}
              trailing={langLabel}
              onPress={() => setOpenLang((v) => !v)}
            />
            {openLang ? (
              <View style={styles.langs}>
                {LANGS.map((code) => {
                  const on = lang === code;
                  const label =
                    code === 'en'
                      ? t('langEn')
                      : code === 'zh-Hans'
                        ? t('langZhHans')
                        : t('langZhHant');
                  return (
                    <Pressable
                      key={code}
                      onPress={() => {
                        void setLanguage(user.uid, code);
                        setOpenLang(false);
                      }}
                      style={styles.langOpt}
                    >
                      <Text
                        style={[
                          on ? type.bodyStrong : type.body,
                          { color: on ? colors.pine : colors.ink, flex: 1 },
                        ]}
                      >
                        {label}
                      </Text>
                      {on ? <Icon name="check" size={16} color={colors.pine} /> : null}
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
            <MenuRow
              icon="settings"
              label={t('settings')}
              onPress={() => nav.navigate('Settings')}
            />
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={askHost}
        transparent
        animationType="slide"
        onRequestClose={() => setAskHost(false)}
      >
        <View style={styles.door}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setAskHost(false)} />
          <View style={styles.sheet}>
            <Text style={[type.h3, { color: colors.ink }]}>{t('becomeOrganizer')}</Text>
            <Text style={[type.meta, { color: colors.muted, marginTop: space.x2 }]}>
              {t('becomeOrganizerHint')}
            </Text>
            <View style={styles.confirmBtns}>
              <View style={{ flex: 1 }}>
                <Button
                  label={t('notNow')}
                  variant="paper"
                  compact
                  onPress={() => setAskHost(false)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button label={t('confirm')} compact onPress={confirmHost} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x10 },
  scrollRoom: { paddingBottom: 132 },
  gutter: { paddingHorizontal: space.gutter },
  card: {
    backgroundColor: colors.pine,
    borderRadius: radius.xxl,
    padding: space.x5,
    minHeight: 168,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  grid: { ...StyleSheet.absoluteFillObject },
  gridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(237,234,216,0.14)',
  },
  gridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(237,234,216,0.14)',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: space.x8,
  },
  face: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: 'rgba(237,234,216,0.55)',
  },
  faceEmpty: {
    backgroundColor: colors.pinePressed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: { color: colors.white, letterSpacing: -0.4 },
  cardMeta: { color: 'rgba(237,234,216,0.82)', marginTop: 4 },
  menu: { marginTop: space.x6, gap: space.x3 },
  door: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.scrim,
  },
  sheet: {
    width: '100%',
    maxWidth: PHONE_MAX_WIDTH,
    backgroundColor: colors.stone,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: space.gutter,
    paddingTop: space.x5,
    paddingBottom: space.x10,
  },
  confirmBtns: { flexDirection: 'row', gap: space.x3, marginTop: space.x4 },
  langs: {
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: space.x4,
    paddingVertical: space.x2,
  },
  langOpt: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.x3,
    minHeight: 44,
  },
});
