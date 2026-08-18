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
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { Rule } from '../../components/Text';
import { useApp } from '../../context/AppContext';
import * as auth from '../../services/auth';
import { colors, radius, space, type, useShell } from '../../theme';

const DEMOS = [
  ['demo@thirdspace.hk', '阿樂'],
  ['host@thirdspace.hk', '林岸'],
  ['admin@thirdspace.hk', 'Admin'],
] as const;

export function LoginScreen() {
  const { t, showBanner } = useApp();
  const { isDesktop } = useShell();
  const [email, setEmail] = useState('demo@thirdspace.hk');
  const [password, setPassword] = useState('thirdspace');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    setBusy(true);
    setErr(null);
    try {
      await (mode === 'in'
        ? auth.signInWithEmail(email, password)
        : auth.signUpWithEmail({ email, password, displayName: name }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('error');
      setErr(msg === 'banned' ? t('banned') : msg);
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    try {
      await auth.signInWithGoogle();
    } catch {
      showBanner(t('googleMissing'), 'warn');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, isDesktop && styles.scrollDesktop]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.column, isDesktop && styles.columnDesktop]}>
            <View style={styles.mark} />
            <Text style={[type.label, { color: colors.dim, marginTop: space.x4 }]}>
              {t('loginBanner')}
            </Text>
            <Text style={[type.display, { color: colors.ink, marginTop: space.x4 }]}>
              {t('appName')}
            </Text>
            <Text
              style={[
                type.body,
                { color: colors.dim, marginTop: space.x3, maxWidth: 340 },
              ]}
            >
              {t('loginIntro')}
            </Text>

            <View style={styles.form}>
              {mode === 'up' ? (
                <Field label={t('name')} value={name} onChange={setName} />
              ) : null}
              <Field
                label={t('email')}
                value={email}
                onChange={setEmail}
                autoCap="none"
              />
              <Field
                label={t('password')}
                value={password}
                onChange={setPassword}
                secure
              />

              {err ? (
                <Text style={[type.meta, { color: colors.accent, marginBottom: space.x4 }]}>
                  {err}
                </Text>
              ) : null}

              <Button
                label={mode === 'in' ? t('signIn') : t('signUp')}
                onPress={() => void go()}
                loading={busy}
              />
              <View style={{ height: space.x2 }} />
              <Button label={t('google')} variant="quiet" onPress={() => void google()} />

              <Pressable onPress={() => setMode(mode === 'in' ? 'up' : 'in')} hitSlop={8}>
                <Text
                  style={[
                    type.data,
                    { color: colors.dim, marginTop: space.x6, textAlign: 'center' },
                  ]}
                >
                  {mode === 'in' ? t('signUp') : t('signIn')}
                </Text>
              </Pressable>
            </View>

            <View style={styles.demoBlock}>
              <Rule />
              <Text style={[type.label, { color: colors.faint, marginTop: space.x4 }]}>
                {t('demoHint').split('　')[0]}
              </Text>
              <View style={styles.demoRow}>
                {DEMOS.map(([em, label]) => (
                  <Pressable
                    key={em}
                    hitSlop={6}
                    onPress={() => {
                      setEmail(em);
                      setPassword('thirdspace');
                      setMode('in');
                      setErr(null);
                    }}
                  >
                    <Text style={[type.bodyStrong, { color: colors.ink }]}>{label}</Text>
                    <Text style={[type.meta, { color: colors.faint }]}>
                      {em.split('@')[0]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChange,
  secure,
  autoCap,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  secure?: boolean;
  autoCap?: 'none' | 'sentences';
}) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ marginBottom: space.x6 }}>
      <Text style={[type.label, { color: colors.faint }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        autoCapitalize={autoCap ?? 'sentences'}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholderTextColor={colors.faint}
        style={[
          styles.input,
          { borderBottomColor: focus ? colors.ink : colors.hairlineStrong },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  fill: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: space.gutter },
  scrollDesktop: { alignItems: 'center' },
  column: { width: '100%' },
  columnDesktop: { maxWidth: 420 },
  mark: { width: 28, height: 2, backgroundColor: colors.accent },
  form: { marginTop: space.x12 },
  input: {
    borderBottomWidth: 1,
    paddingVertical: space.x3,
    paddingHorizontal: 0,
    marginTop: space.x2,
    color: colors.ink,
    fontSize: 16,
    borderRadius: radius.none,
  },
  demoBlock: { marginTop: space.x12 },
  demoRow: {
    flexDirection: 'row',
    gap: space.x8,
    marginTop: space.x4,
    flexWrap: 'wrap',
  },
});
