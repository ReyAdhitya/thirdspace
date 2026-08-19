import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { InAppBanner } from './src/components/Screen';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { PHONE_MAX_WIDTH, colors, useShell } from './src/theme';

function ensureWebChrome() {
  if (Platform.OS !== 'web') return;
  const doc = (globalThis as { document?: Document }).document;
  if (!doc || doc.getElementById('ts-chrome')) return;

  const link = doc.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&family=Noto+Sans+TC:wght@400;500;600&display=swap';
  doc.head.appendChild(link);

  const style = doc.createElement('style');
  style.id = 'ts-chrome';
  style.textContent = `
    html, body { background: ${colors.stage}; }
    ::selection { background: ${colors.pine}; color: #fff; }
    ::-webkit-scrollbar { width: 0; height: 0; }
    input, textarea { outline: none; }
  `;
  doc.head.appendChild(style);
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.stone,
    card: colors.stone,
    text: colors.ink,
    border: colors.hairline,
    primary: colors.pine,
  },
};

/** In a browser the app sits inside a phone-width frame, never full bleed. */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { isFramed } = useShell();
  return (
    <View style={[styles.stage, isFramed && styles.stageFramed]}>
      <View style={[styles.phone, isFramed && styles.phoneFramed]}>{children}</View>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    ensureWebChrome();
  }, []);

  return (
    <GestureHandlerRootView style={styles.stage}>
      <SafeAreaProvider>
        <AppProvider>
          <PhoneFrame>
            <NavigationContainer theme={navTheme}>
              <RootNavigator />
              <InAppBanner />
              <StatusBar style="dark" />
            </NavigationContainer>
          </PhoneFrame>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, backgroundColor: colors.stone },
  stageFramed: {
    backgroundColor: colors.stage,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  phone: { flex: 1, width: '100%', backgroundColor: colors.stone },
  phoneFramed: {
    maxWidth: PHONE_MAX_WIDTH,
    width: PHONE_MAX_WIDTH,
    maxHeight: 844,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.18,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 10 },
  },
});
