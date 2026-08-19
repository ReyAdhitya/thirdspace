import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { decodeJwtPayload } from '../lib/jwt';

/** Lets the web popup hand its result back to the app. */
WebBrowser.maybeCompleteAuthSession();

const DISCOVERY: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export type GoogleProfile = {
  email: string;
  name?: string;
  picture?: string;
};

function envId(key: string): string | undefined {
  const value = process.env[key];
  return value && value.length > 0 ? value : undefined;
}

/**
 * Google issues one client id per platform. Web is what the phone preview on
 * localhost uses; the iOS id is only needed once Lok builds for a device.
 */
export function googleClientId(): string | undefined {
  const web = envId('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID');
  if (Platform.OS === 'ios') {
    return envId('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID') ?? web;
  }
  if (Platform.OS === 'android') {
    return envId('EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID') ?? web;
  }
  return web;
}

export function googleConfigured(): boolean {
  return Boolean(googleClientId());
}

/** iOS clients redirect to the reversed client id; web returns to its origin. */
function redirectUri(clientId: string): string {
  if (Platform.OS === 'web') return AuthSession.makeRedirectUri();

  const reversed = clientId.endsWith('.apps.googleusercontent.com')
    ? clientId.replace('.apps.googleusercontent.com', '')
    : null;
  if (Platform.OS === 'ios' && reversed) {
    return AuthSession.makeRedirectUri({
      native: `com.googleusercontent.apps.${reversed}:/oauthredirect`,
    });
  }
  return AuthSession.makeRedirectUri({ scheme: 'thirdspace' });
}

async function nonce(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Opens the Google account picker and returns the chosen account's profile.
 * Implicit `id_token` flow, so no client secret ever ships in the app.
 */
export async function promptGoogleSignIn(): Promise<GoogleProfile> {
  const clientId = googleClientId();
  if (!clientId) throw new Error('google-missing');

  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri: redirectUri(clientId),
    responseType: AuthSession.ResponseType.IdToken,
    scopes: ['openid', 'profile', 'email'],
    usePKCE: false,
    extraParams: { nonce: await nonce(), prompt: 'select_account' },
  });

  const result = await request.promptAsync(DISCOVERY);

  if (result.type === 'dismiss' || result.type === 'cancel') {
    throw new Error('google-cancelled');
  }
  if (result.type !== 'success') throw new Error('google-failed');

  const idToken = result.params?.id_token;
  if (!idToken) throw new Error('google-failed');

  const claims = decodeJwtPayload<{
    email?: string;
    name?: string;
    picture?: string;
  }>(idToken);

  if (!claims.email) throw new Error('google-failed');
  return { email: claims.email, name: claims.name, picture: claims.picture };
}
