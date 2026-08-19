import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
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

import { Button } from '../../components/Button';
import { GoogleMark } from '../../components/GoogleMark';
import { ArchMark } from '../../components/Logo';
import { useApp } from '../../context/AppContext';
import { errorText } from '../../lib/errors';
import * as auth from '../../services/auth';
import { colors, radius, space, type } from '../../theme';

const DOOR =
  'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=1000&q=80';

/** Demo accounts, named in the active locale so the chip matches the chrome. */
const DEMOS = [
  { email: 'demo@thirdspace.hk', en: 'Alex', zh: '阿樂', role: 'demo' },
  { email: 'host@thirdspace.hk', en: 'Lin', zh: '林岸', role: 'host' },
  { email: 'admin@thirdspace.hk', en: 'Admin', zh: 'Admin', role: 'admin' },
] as const;

export function LoginScreen() {
  const { t, lang, showBanner } = useApp();
  const [email, setEmail] = useState('demo@thirdspace.hk');
  const [password, setPassword] = useState('thirdspace');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [form, setForm] = useState(false);
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
      setErr(errorText(e, t));
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
    <View style={styles.root}>
      <View style={styles.cover}>
        <Image source={{ uri: DOOR }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient
          colors={['rgba(31,61,52,0.18)', 'rgba(246,244,241,0.65)', colors.stone]}
          locations={[0, 0.72, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <ArchMark size={52} />
            <Text style={[type.meta, { color: colors.muted, marginTop: space.x4 }]}>
              {t('welcomeTo')}
            </Text>
            <Text style={[type.wordmark, { color: colors.ink }]}>{t('appName')}</Text>
            <Text
              style={[
                type.meta,
                { color: colors.muted, marginTop: space.x2, textAlign: 'center' },
              ]}
            >
              {t('tagline')}
            </Text>
          </View>

          {form ? (
            <View style={styles.form}>
              {mode === 'up' ? (
                <Field label={t('name')} value={name} onChange={setName} />
              ) : null}
              <Field label={t('email')} value={email} onChange={setEmail} autoCap="none" />
              <Field label={t('password')} value={password} onChange={setPassword} secure />
              {err ? (
                <Text style={[type.meta, { color: colors.rose, marginBottom: space.x3 }]}>
                  {err}
                </Text>
              ) : null}
              <Button
                label={mode === 'in' ? t('signIn') : t('signUp')}
                onPress={() => void go()}
                loading={busy}
              />
            </View>
          ) : (
            <View style={styles.form}>
              <Button label={t('loginEmail')} icon="mail" onPress={() => setForm(true)} />
              <View style={{ height: space.x3 }} />
              <GoogleButton label={t('loginGoogle')} onPress={() => void google()} />
            </View>
          )}

          <Pressable
            onPress={() => {
              setForm(true);
              setMode(mode === 'in' ? 'up' : 'in');
              setErr(null);
            }}
            hitSlop={8}
          >
            <Text style={[type.meta, styles.link]}>
              {mode === 'in' ? t('createAccount') : t('signIn')}
            </Text>
          </Pressable>

          <View style={styles.demos}>
            {DEMOS.map((d) => (
              <Pressable
                key={d.email}
                style={styles.demo}
                onPress={() => {
                  setEmail(d.email);
                  setPassword('thirdspace');
                  setMode('in');
                  setForm(true);
                  setErr(null);
                }}
              >
                <Text style={[type.metaStrong, { color: colors.ink }]}>
                  {lang === 'en' ? d.en : d.zh}
                </Text>
                <Text style={[type.small, { color: colors.faint }]}>{d.role}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function GoogleButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.google,
        { backgroundColor: pressed ? colors.stone : colors.white },
      ]}
    >
      <GoogleMark size={18} />
      <Text style={[type.button, { color: colors.ink }]}>{label}</Text>
    </Pressable>
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
    <View style={{ marginBottom: space.x3 }}>
      <Text style={[type.small, { color: colors.muted, marginBottom: space.x1 }]}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        autoCapitalize={autoCap ?? 'sentences'}
        placeholderTextColor={colors.faint}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.stone },
  fill: { flex: 1 },
  cover: { position: 'absolute', left: 0, right: 0, top: 0, height: '46%' },
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: space.x6,
    paddingBottom: space.x10,
  },
  brand: { alignItems: 'center', marginBottom: space.x8 },
  form: { marginBottom: space.x4 },
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
  google: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.x2,
  },
  link: { color: colors.pine, textAlign: 'center', paddingVertical: space.x2 },
  demos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: space.x3,
    marginTop: space.x4,
  },
  demo: {
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
    paddingHorizontal: space.x3,
    paddingVertical: space.x2,
    alignItems: 'center',
  },
});
