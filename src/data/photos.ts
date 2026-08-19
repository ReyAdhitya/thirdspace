/**
 * Bundled demo photos. The app never fetches Unsplash at runtime.
 *
 * Attribution (unsplash.com photo ids, not live URLs):
 *   jazz           photo-1493225457124-a3eb161ffa5f
 *   library        photo-1521587760476-6c12a4b040da
 *   film           photo-1452587925148-ce544e77e70d
 *   hike           photo-1501785888041-af3ef285b470
 *   clay           photo-1565193566173-7a0ee3dbe261
 *   roof           photo-1514525253161-7a46d19cd819
 *   market         photo-1555396273-367ea4eb4db5
 *   sketch         photo-1460661419201-fd4cecdf8a8b
 *   portraitLin    photo-1531123897727-8f129e1688ce
 *   portraitChen   photo-1524504388940-b1c1722653e1
 *   portraitAlex   photo-1506794778202-cad84cf45f1d
 *   portraitAdmin  photo-1519085360753-af0119f7cbe7
 *   loginDoor      photo-1509644851169-2acc08aa25b5
 */
export const DEMO_PHOTO_MODULES = {
  jazz: require('../../assets/demo/jazz.jpg'),
  library: require('../../assets/demo/library.jpg'),
  film: require('../../assets/demo/film.jpg'),
  hike: require('../../assets/demo/hike.jpg'),
  clay: require('../../assets/demo/clay.jpg'),
  roof: require('../../assets/demo/roof.jpg'),
  market: require('../../assets/demo/market.jpg'),
  sketch: require('../../assets/demo/sketch.jpg'),
  portraitLin: require('../../assets/demo/portraitLin.jpg'),
  portraitChen: require('../../assets/demo/portraitChen.jpg'),
  portraitAlex: require('../../assets/demo/portraitAlex.jpg'),
  portraitAdmin: require('../../assets/demo/portraitAdmin.jpg'),
  loginDoor: require('../../assets/demo/loginDoor.jpg'),
} as const;

export type DemoPhotoId = keyof typeof DEMO_PHOTO_MODULES;

export const STOCK_PHOTOS: DemoPhotoId[] = [
  'jazz',
  'library',
  'film',
  'hike',
  'clay',
  'roof',
  'market',
  'sketch',
];

export function isDemoPhotoId(value: string): value is DemoPhotoId {
  return Object.prototype.hasOwnProperty.call(DEMO_PHOTO_MODULES, value);
}

/**
 * Old AsyncStorage still holds dead Unsplash URLs. Map those ids (and the
 * working replacements) onto bundled files so Chrome does not sit on 404s.
 */
const UNSPLASH_TO_DEMO: Record<string, DemoPhotoId> = {
  '1511192336575-5a79af67a986': 'jazz',
  '1493225457124-a3eb161ffa5f': 'jazz',
  '1521587760476-6c12a4b040da': 'library',
  '1452587925148-ce544e77e70d': 'film',
  '1501785888041-af3ef285b470': 'hike',
  '1565193566173-7a0ee3dbe261': 'clay',
  '1514525253161-7a46d19cd819': 'roof',
  '1555396273-367ea4eb4db5': 'market',
  '1513364776144-60967b0f8002': 'sketch',
  '1460661419201-fd4cecdf8a8b': 'sketch',
  '1531123897727-8f129e1688ce': 'portraitLin',
  '1524504388940-b1c1722653e1': 'portraitChen',
  '1506794778202-cad84cf45f1d': 'portraitAlex',
  '1519085360753-af0119f7cbe7': 'portraitAdmin',
  '1509644851169-2acc08aa25b5': 'loginDoor',
};

export function resolveDemoId(idOrUrl?: string | null): DemoPhotoId | undefined {
  if (!idOrUrl) return undefined;
  if (isDemoPhotoId(idOrUrl)) return idOrUrl;
  for (const [photoId, key] of Object.entries(UNSPLASH_TO_DEMO)) {
    if (idOrUrl.includes(photoId)) return key;
  }
  return undefined;
}

/** expo-image `source` for remote / camera URIs only. Bundled files use RN Image. */
export function photoSource(idOrUrl?: string | null) {
  if (!idOrUrl) return undefined;
  const demo = resolveDemoId(idOrUrl);
  if (demo) return DEMO_PHOTO_MODULES[demo];
  return { uri: idOrUrl };
}
