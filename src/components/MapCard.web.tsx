import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius } from '../theme';

/**
 * Web: a real Google Maps iframe. Rendered with createElement because the
 * project's JSX namespace is React Native's, which has no DOM elements.
 */
export function MapCard({ url, height = 300 }: { url: string; height?: number }) {
  const iframe = React.createElement('iframe', {
    src: url,
    title: 'Google Map',
    width: '100%',
    height: '100%',
    loading: 'lazy',
    referrerPolicy: 'no-referrer-when-downgrade',
    allowFullScreen: false,
    style: { border: 0, display: 'block' },
  });

  return (
    <View style={[styles.card, { height }]}>
      {iframe as unknown as React.ReactNode}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.pineSoft,
  },
});
