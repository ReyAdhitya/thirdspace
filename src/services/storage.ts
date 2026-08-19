import * as ImagePicker from 'expo-image-picker';

import { STOCK_PHOTOS } from '../data/photos';

export async function pickPhoto(): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (perm.granted === false && perm.status !== 'granted') {
    return STOCK_PHOTOS[0];
  }
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
  });
  if (res.canceled || !res.assets[0]) return null;
  return res.assets[0].uri;
}

export { STOCK_PHOTOS };
