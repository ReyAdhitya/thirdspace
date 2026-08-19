import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { colors, radius } from '../theme';

/** Native: the OpenStreetMap embed URL inside a WebView. */
export function MapCard({ url, height = 300 }: { url: string; height?: number }) {
  return (
    <View style={[styles.card, { height }]}>
      <WebView
        source={{ uri: url }}
        style={styles.web}
        originWhitelist={['https://*']}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        setSupportMultipleWindows={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.pineSoft,
  },
  web: { flex: 1, backgroundColor: colors.pineSoft },
});
