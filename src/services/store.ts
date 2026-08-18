import AsyncStorage from '@react-native-async-storage/async-storage';

import { createSeed, type SeedDb } from '../data/seed';

const KEY = 'thirdspace.db.v1';

let db: SeedDb = createSeed();
let ready = false;
const listeners = new Set<() => void>();

export function getDb(): SeedDb {
  return db;
}

export function isReady(): boolean {
  return ready;
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function emit() {
  listeners.forEach((fn) => fn());
}

export async function persist(): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(db));
  emit();
}

export async function initStore(): Promise<void> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as SeedDb;
      if (parsed.schemaVersion === 1 && Array.isArray(parsed.activities)) {
        db = parsed;
      } else {
        db = createSeed();
        await AsyncStorage.setItem(KEY, JSON.stringify(db));
      }
    } catch {
      db = createSeed();
      await AsyncStorage.setItem(KEY, JSON.stringify(db));
    }
  } else {
    db = createSeed();
    await AsyncStorage.setItem(KEY, JSON.stringify(db));
  }
  ready = true;
  emit();
}

export async function mutate(fn: (draft: SeedDb) => void): Promise<void> {
  fn(db);
  await persist();
}

export function nid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function resetStore(): Promise<void> {
  db = createSeed();
  await persist();
}
