import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { Screen, StackHeader } from '../../components/Screen';
import { useApp } from '../../context/AppContext';
import { errorText } from '../../lib/errors';
import { activityTitle, userName } from '../../lib/localize';
import { hkParts } from '../../lib/time';
import type { RootNav, RootStackParamList } from '../../navigation/types';
import { getActivity } from '../../services/activities';
import { getUser } from '../../services/auth';
import { listMessages, postMessage } from '../../services/chat';
import { colors, radius, space, type } from '../../theme';

/** Ticket-holder thread: their bubbles on cream, yours on pine. */
export function ChatScreen() {
  const nav = useNavigation<RootNav>();
  const { activityId } = useRoute<RouteProp<RootStackParamList, 'Chat'>>().params;
  const { t, lang, user, showBanner } = useApp();
  const [draft, setDraft] = useState('');

  const activity = getActivity(activityId);
  const messages = listMessages(activityId, 'chat');

  if (!activity || !user) {
    return (
      <Screen onBack={() => nav.goBack()}>
        <EmptyState title={t('needLogin')} icon="message-circle" />
      </Screen>
    );
  }

  async function send() {
    if (!draft.trim()) return;
    try {
      await postMessage({
        activityId,
        userId: user!.uid,
        text: draft,
        kind: 'chat',
      });
      setDraft('');
    } catch (e) {
      showBanner(errorText(e, t), 'warn');
    }
  }

  return (
    <Screen bare>
      <StackHeader
        title={activityTitle(activity, lang)}
        caption={`${activity.joinedCount} ${t('participants')}`}
        onBack={() => nav.goBack()}
      />
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.thread}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <EmptyState title={t('noChat')} icon="message-circle" />
          ) : (
            messages.map((m) => {
              const mineMsg = m.userId === user.uid;
              const author = getUser(m.userId);
              const at = hkParts(m.createdAt);
              return (
                <View
                  key={m.id}
                  style={[styles.line, mineMsg && styles.lineMine]}
                >
                  {!mineMsg ? (
                    author?.photoUrl ? (
                      <Image
                        source={{ uri: author.photoUrl }}
                        style={styles.avatar}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={[styles.avatar, { backgroundColor: colors.paper }]} />
                    )
                  ) : null}
                  <View style={[styles.col, mineMsg && { alignItems: 'flex-end' }]}>
                    <View style={styles.metaRow}>
                      {!mineMsg ? (
                        <Text style={[type.small, { color: colors.muted }]}>
                          {userName(author, lang)}
                        </Text>
                      ) : null}
                      <Text style={[type.small, { color: colors.faint }]}>
                        {at.hour}:{at.minute}
                      </Text>
                    </View>
                    <View style={[styles.bubble, mineMsg ? styles.mine : styles.theirs]}>
                      <Text
                        style={[
                          type.body,
                          { color: mineMsg ? colors.white : colors.ink },
                        ]}
                      >
                        {m.text}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t('messagePlaceholder')}
            placeholderTextColor={colors.faint}
            style={styles.input}
            onSubmitEditing={() => void send()}
          />
          <Pressable onPress={() => void send()} style={styles.send}>
            <Icon name="send" size={17} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  thread: { padding: space.gutter, gap: space.x4 },
  line: { flexDirection: 'row', gap: space.x2, alignItems: 'flex-end' },
  lineMine: { justifyContent: 'flex-end' },
  avatar: { width: 32, height: 32, borderRadius: radius.pill },
  col: { flex: 1, gap: 3 },
  metaRow: { flexDirection: 'row', gap: space.x2, alignItems: 'center' },
  bubble: {
    maxWidth: '86%',
    borderRadius: radius.lg,
    paddingHorizontal: space.x3,
    paddingVertical: space.x2,
  },
  theirs: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderBottomLeftRadius: radius.xs,
  },
  mine: {
    backgroundColor: colors.pine,
    borderBottomRightRadius: radius.xs,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x2,
    paddingHorizontal: space.gutter,
    paddingTop: space.x3,
    paddingBottom: space.x6,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.stone,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.pill,
    paddingHorizontal: space.x4,
    height: 44,
    color: colors.ink,
    fontSize: 14,
    fontFamily: type.body.fontFamily as string,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.pine,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
