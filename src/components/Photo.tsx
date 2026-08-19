import { Image as ExpoImage } from 'expo-image';
import React from 'react';
import {
  Image as RnImage,
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
} from 'react-native';

import { DEMO_PHOTO_MODULES, resolveDemoId } from '../data/photos';
import { colors } from '../theme';

/**
 * Bundled demo jpgs go through React Native Image. expo-image on web
 * does not paint Metro `require()` assets — Popular cards stayed grey.
 * Remote / camera URIs still use expo-image.
 */
export function Photo({
  uri,
  style,
  contentFit = 'cover',
  transition,
}: {
  uri?: string | null;
  style?: StyleProp<ImageStyle>;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  transition?: number;
}) {
  const demo = resolveDemoId(uri);
  const resizeMode = contentFit === 'contain' ? 'contain' : 'cover';

  if (demo) {
    return (
      <RnImage
        source={DEMO_PHOTO_MODULES[demo]}
        style={[styles.fallback, style]}
        resizeMode={resizeMode}
      />
    );
  }

  if (uri && /^https?:\/\//i.test(uri)) {
    return (
      <ExpoImage
        source={{ uri }}
        style={[styles.fallback, style]}
        contentFit={contentFit}
        transition={transition}
      />
    );
  }

  return <View style={[styles.fallback, style]} />;
}

const styles = StyleSheet.create({
  fallback: { backgroundColor: colors.pineSoft },
});
