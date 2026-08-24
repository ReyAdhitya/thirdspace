import * as ImagePicker from 'expo-image-picker';

import { STOCK_PHOTOS } from '../data/photos';

/**
 * Library picker only. Denied permission is not a photo — never return
 * a stock cover, or QA cannot tell Deny from a real pick.
 */
export async function pickPhoto(): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    throw new Error('photos-denied');
  }
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
  });
  if (res.canceled || !res.assets[0]) return null;
  return res.assets[0].uri;
}

export { STOCK_PHOTOS };
