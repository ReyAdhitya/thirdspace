import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { InAppBanner } from './src/components/Screen';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme';

function ensureWebFonts() {
  if (Platform.OS !== 'web') return;
  const doc = (globalThis as { document?: Document }).document;
  if (!doc || doc.getElementById('ts-fonts')) return;
  const link = doc.createElement('link');
  link.id = 'ts-fonts';
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=Noto+Sans+TC:wght@400;500;600;700&family=Noto+Serif+TC:wght@600;700&display=swap';
  doc.head.appendChild(link);
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.paper,
    card: colors.paper,
    text: colors.ink,
    border: colors.line,
    primary: colors.pine,
  },
};

function Shell({ children }: { children: React.ReactNode }) {
  const web = Platform.OS === 'web';
  return (
    <View style={[styles.stage, web && styles.stageWeb]}>
      <View style={[styles.phone, web && styles.phoneWeb]}>{children}</View>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    ensureWebFonts();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <Shell>
            <NavigationContainer theme={navTheme}>
              <RootNavigator />
              <InAppBanner />
              <StatusBar style="dark" />
            </NavigationContainer>
          </Shell>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, backgroundColor: colors.paper },
  stageWeb: { backgroundColor: colors.webStage, alignItems: 'center' },
  phone: { flex: 1, width: '100%' },
  phoneWeb: {
    maxWidth: 430,
    width: '100%',
    backgroundColor: colors.paper,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
  },
});
