import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { InAppBanner } from './src/components/Screen';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme';

function ensureWebChrome() {
  if (Platform.OS !== 'web') return;
  const doc = (globalThis as { document?: Document }).document;
  if (!doc || doc.getElementById('ts-chrome')) return;

  const link = doc.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+TC:wght@400;500;600&family=Noto+Serif+TC:wght@600&display=swap';
  doc.head.appendChild(link);

  const style = doc.createElement('style');
  style.id = 'ts-chrome';
  style.textContent = `
    html, body { background: ${colors.bg}; }
    ::selection { background: ${colors.accent}; color: ${colors.onAccent}; }
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: ${colors.bg}; }
    ::-webkit-scrollbar-thumb { background: ${colors.hairlineStrong}; }
    input, textarea { outline: none; }
    input:focus-visible, textarea:focus-visible { outline: none; }
  `;
  doc.head.appendChild(style);
}

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.ink,
    border: colors.hairline,
    primary: colors.accent,
  },
};

export default function App() {
  useEffect(() => {
    ensureWebChrome();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppProvider>
          <View style={[styles.root, Platform.OS === 'web' && styles.stage]}>
            <View style={[styles.phone, Platform.OS === 'web' && styles.phoneWeb]}>
              <NavigationContainer theme={navTheme}>
                <RootNavigator />
                <InAppBanner />
                <StatusBar style="light" />
              </NavigationContainer>
            </View>
          </View>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050504',
  },
  phone: { flex: 1, width: '100%' },
  phoneWeb: {
    flex: 1,
    width: '100%',
    maxWidth: 390,
    maxHeight: 844,
    height: '100%',
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.hairline,
    overflow: 'hidden',
  },
});
