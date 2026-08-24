import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { Photo } from '../../components/Photo';
import { Screen } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { userName } from '../../lib/localize';
import type { RootNav } from '../../navigation/types';
import { getUser } from '../../services/auth';
import { followedOrganizerIds } from '../../services/follows';
import { colors, radius, space, type } from '../../theme';

export function FollowingScreen() {
  const nav = useNavigation<RootNav>();
  const { t, user, lang } = useApp();

  if (!user) {
    return (
      <Screen onBack={() => nav.goBack()} title={t('following')}>
        <EmptyState title={t('needLogin')} icon="users" />
      </Screen>
    );
  }

  const follows = followedOrganizerIds(user.uid);

  return (
    <Screen onBack={() => nav.goBack()} title={t('following')}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gutter}>
          {follows.length === 0 ? (
            <EmptyState title={t('noFollowing')} icon="users" />
          ) : (
            <View style={styles.rows}>
              {follows.map((uid) => {
                const h = getUser(uid);
                return (
                  <Pressable
                    key={uid}
                    onPress={() => nav.navigate('Organizer', { uid })}
                    style={styles.hostRow}
                  >
                    {h?.photoUrl ? (
                      <Photo uri={h.photoUrl} style={styles.hostAvatar} />
                    ) : (
                      <View style={[styles.hostAvatar, { backgroundColor: colors.paper }]} />
                    )}
                    <Text style={[type.bodyStrong, { color: colors.ink, flex: 1 }]}>
                      {userName(h, lang) || uid}
                    </Text>
                    <Icon name="chevron-right" size={16} color={colors.faint} />
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.x10, paddingTop: space.x2 },
  gutter: { paddingHorizontal: space.gutter },
  rows: { gap: space.x3 },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: space.x3,
  },
  hostAvatar: { width: 36, height: 36, borderRadius: radius.pill },
});
