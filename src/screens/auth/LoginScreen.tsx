import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { useApp } from '../../context/AppContext';
import * as auth from '../../services/auth';
import { colors, space, type } from '../../theme';

export function LoginScreen() {
  const { t, showBanner } = useApp();
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
        : auth.signUpWithEmail({
            email,
            password,
            displayName: name,
          }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('error');
      if (msg === 'banned') setErr(t('banned'));
      else setErr(msg);
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
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.banner}>
          <Text style={[type.label, { color: colors.pineSoft }]}>{t('loginBanner')}</Text>
          <Text style={[type.greeting, { color: colors.paper, marginTop: 12 }]}>
            {t('appName')}
          </Text>
          <Text style={[type.body, { color: colors.pineSoft, marginTop: 12 }]}>
            {t('loginIntro')}
          </Text>
        </View>
        <View style={styles.sheet}>
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
            <Text style={[type.meta, { color: colors.danger, marginBottom: 12 }]}>
              {err}
            </Text>
          ) : null}
          <Button
            label={mode === 'in' ? t('signIn') : t('signUp')}
            onPress={() => void go()}
            loading={busy}
          />
          <View style={{ height: 10 }} />
          <Button label={t('google')} variant="ghost" onPress={() => void google()} />
          <Pressable
            onPress={() => setMode(mode === 'in' ? 'up' : 'in')}
            style={{ marginTop: 18 }}
          >
            <Text style={[type.body, { color: colors.pine, textAlign: 'center' }]}>
              {mode === 'in' ? t('signUp') : t('signIn')}
            </Text>
          </Pressable>
          <Text style={[type.meta, { color: colors.muted, marginTop: 20 }]}>
            {t('demoHint')}
          </Text>
          <View style={styles.demos}>
            {[
              ['demo@thirdspace.hk', '阿樂'],
              ['host@thirdspace.hk', '林岸'],
              ['admin@thirdspace.hk', 'Admin'],
            ].map(([em, label]) => (
              <Pressable
                key={em}
                onPress={() => {
                  setEmail(em);
                  setPassword('thirdspace');
                  setMode('in');
                }}
                style={styles.demoChip}
              >
                <Text style={[type.meta, { color: colors.ink }]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
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
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[type.label, { color: colors.muted, marginBottom: 6 }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        autoCapitalize={autoCap ?? 'sentences'}
        style={styles.input}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  banner: {
    backgroundColor: colors.ink,
    paddingHorizontal: space.screen,
    paddingTop: 28,
    paddingBottom: 36,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.paper,
    padding: space.screen,
    marginTop: -18,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.ink,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  demos: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  demoChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
