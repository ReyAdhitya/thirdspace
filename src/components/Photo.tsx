import { Image, type ImageProps } from 'expo-image';
import React from 'react';
import { StyleSheet } from 'react-native';

import { photoSource } from '../data/photos';
import { colors } from '../theme';

type Props = Omit<ImageProps, 'source'> & {
  uri?: string | null;
};

/**
 * One image path for the whole app. Seed photos are bundled keys
 * (`jazz`, `portraitAlex`, …); camera / Google still pass a real URI.
 */
export function Photo({ uri, style, contentFit = 'cover', ...rest }: Props) {
  return (
    <Image
      source={photoSource(uri)}
      style={[styles.fallback, style]}
      contentFit={contentFit}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  fallback: { backgroundColor: colors.pineSoft },
});
