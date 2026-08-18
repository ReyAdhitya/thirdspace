import type { Follow } from '../types';
import { getDb, mutate } from './store';

export function isFollowing(followerId: string, organizerId: string): boolean {
  return getDb().follows.some(
    (f) => f.followerId === followerId && f.organizerId === organizerId,
  );
}

export function followedOrganizerIds(followerId: string): string[] {
  return getDb()
    .follows.filter((f) => f.followerId === followerId)
    .map((f) => f.organizerId);
}

export async function toggleFollow(
  followerId: string,
  organizerId: string,
): Promise<boolean> {
  if (followerId === organizerId) return false;
  const id = `${followerId}_${organizerId}`;
  let on = false;
  await mutate((d) => {
    const idx = d.follows.findIndex((f) => f.id === id);
    if (idx >= 0) {
      d.follows.splice(idx, 1);
      on = false;
    } else {
      const row: Follow = {
        id,
        followerId,
        organizerId,
        createdAt: new Date().toISOString(),
      };
      d.follows.push(row);
      on = true;
    }
  });
  return on;
}
