import type { AppLanguage, User } from '../types';
import { googleConfigured, promptGoogleSignIn } from './google';
import { getDb, mutate, nid } from './store';

function publicUser(u: User & { password?: string }): User {
  const { password: _p, ...rest } = u as User & { password?: string };
  return rest;
}

export function currentUser(): User | null {
  const db = getDb();
  if (!db.sessionUid) return null;
  const u = db.users.find((x) => x.uid === db.sessionUid);
  if (!u || u.banned) return null;
  return publicUser(u);
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<User> {
  const db = getDb();
  const u = db.users.find(
    (x) => x.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!u || u.password !== password) {
    throw new Error('bad-credentials');
  }
  if (u.banned) throw new Error('banned');
  await mutate((d) => {
    d.sessionUid = u.uid;
  });
  return publicUser(u);
}

export async function signUpWithEmail(input: {
  email: string;
  password: string;
  displayName: string;
}): Promise<User> {
  const email = input.email.trim().toLowerCase();
  if (!email.includes('@')) throw new Error('bad-email');
  if (input.password.length < 6) throw new Error('weak-password');
  const db = getDb();
  if (db.users.some((x) => x.email.toLowerCase() === email)) {
    throw new Error('email-taken');
  }
  const uid = nid('u');
  const user: User & { password: string } = {
    uid,
    email,
    password: input.password,
    displayName: input.displayName.trim() || email.split('@')[0],
    role: 'user',
    interests: [],
    language: 'en',
    homeDistrict: 'central',
    createdAt: new Date().toISOString(),
    onboarded: false,
  };
  await mutate((d) => {
    d.users.push(user);
    d.sessionUid = uid;
  });
  return publicUser(user);
}

export async function signOut(): Promise<void> {
  await mutate((d) => {
    d.sessionUid = null;
  });
}

/**
 * Real Google OAuth. An existing account signs straight in; a new Gmail gets
 * the same `user` role an email sign-up would. Local store only for now —
 * swapping in Firebase Auth later keeps this signature.
 */
export async function signInWithGoogle(): Promise<User> {
  if (!googleConfigured()) throw new Error('google-missing');

  const profile = await promptGoogleSignIn();
  const email = profile.email.trim().toLowerCase();

  const existing = getDb().users.find((x) => x.email.toLowerCase() === email);
  if (existing) {
    if (existing.banned) throw new Error('banned');
    await mutate((d) => {
      const u = d.users.find((x) => x.uid === existing.uid);
      if (u && profile.picture && !u.photoUrl) u.photoUrl = profile.picture;
      d.sessionUid = existing.uid;
    });
    return publicUser(existing);
  }

  const uid = nid('u');
  const user: User & { password: string } = {
    uid,
    email,
    /** Unusable local password: this account signs in through Google. */
    password: nid('google'),
    displayName: profile.name?.trim() || email.split('@')[0],
    photoUrl: profile.picture,
    role: 'user',
    interests: [],
    language: 'en',
    homeDistrict: 'central',
    createdAt: new Date().toISOString(),
    onboarded: false,
  };
  await mutate((d) => {
    d.users.push(user);
    d.sessionUid = uid;
  });
  return publicUser(user);
}

export async function updateProfile(
  uid: string,
  patch: Partial<
    Pick<
      User,
      | 'displayName'
      | 'bio'
      | 'photoUrl'
      | 'interests'
      | 'language'
      | 'homeDistrict'
      | 'role'
      | 'onboarded'
    >
  >,
): Promise<User> {
  let next: User | null = null;
  await mutate((d) => {
    const u = d.users.find((x) => x.uid === uid);
    if (!u) throw new Error('not-found');
    Object.assign(u, patch);
    next = publicUser(u);
  });
  if (!next) throw new Error('not-found');
  return next;
}

export async function setLanguage(uid: string, language: AppLanguage) {
  return updateProfile(uid, { language });
}

export function getUser(uid: string): User | undefined {
  const u = getDb().users.find((x) => x.uid === uid);
  return u ? publicUser(u) : undefined;
}

export function listUsers(): User[] {
  return getDb().users.map(publicUser);
}

export async function setBanned(uid: string, banned: boolean): Promise<void> {
  await mutate((d) => {
    const u = d.users.find((x) => x.uid === uid);
    if (!u) throw new Error('not-found');
    u.banned = banned;
    if (banned && d.sessionUid === uid) d.sessionUid = null;
  });
}
