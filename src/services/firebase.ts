/**
 * Firebase adapter seam.
 * Screens never import this for data. Services in this folder are the API.
 *
 * To point at a real project later:
 * 1. Create a Firebase web app.
 * 2. Put keys in `.env` (never commit):
 *    EXPO_PUBLIC_FIREBASE_API_KEY=
 *    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
 *    EXPO_PUBLIC_FIREBASE_PROJECT_ID=
 *    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
 * 3. Swap implementations in auth.ts / activities.ts / tickets.ts
 *    to Firestore + Auth. Keep function signatures.
 *
 * Google Sign-In does not depend on this file — see `google.ts`.
 */
export type FirebaseConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
};

export function readFirebaseEnv(): FirebaseConfig {
  return {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  };
}

export function firebaseConfigured(): boolean {
  const c = readFirebaseEnv();
  return Boolean(c.apiKey && c.projectId);
}
