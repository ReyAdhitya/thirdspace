import { NEARBY_OF, districtLabel } from '../data/districts';
import { isWeekendHk } from '../lib/time';
import type { Activity, MoodId } from '../types';
import { getDb, mutate, nid } from './store';

export function listPublished(opts?: { includeHidden?: boolean }): Activity[] {
  const rows = getDb().activities;
  const filtered = opts?.includeHidden
    ? rows
    : rows.filter((a) => a.status === 'published');
  return [...filtered].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

export function getActivity(id: string): Activity | undefined {
  return getDb().activities.find((a) => a.id === id);
}

export function listByOrganizer(organizerId: string): Activity[] {
  return listPublished({ includeHidden: true }).filter(
    (a) => a.organizerId === organizerId,
  );
}

export function searchActivities(q: string): Activity[] {
  const s = q.trim().toLowerCase();
  if (!s) return listPublished();
  return listPublished().filter((a) =>
    [
      a.title,
      a.titleEn ?? '',
      a.summary,
      a.summaryEn ?? '',
      a.address,
      a.addressEn ?? '',
      a.district,
      districtLabel(a.district, 'en'),
      districtLabel(a.district, 'zh-Hant'),
      districtLabel(a.district, 'zh-Hans'),
    ]
      .join(' ')
      .toLowerCase()
      .includes(s),
  );
}

export function filterByMood(
  mood: MoodId,
  homeDistrict: string,
): Activity[] {
  const all = listPublished();
  if (mood === 'weekend') return all.filter((a) => isWeekendHk(a.startsAt));
  if (mood === 'nearby') {
    const near = NEARBY_OF[homeDistrict] ?? [homeDistrict];
    return all.filter((a) => near.includes(a.district) || a.district === homeDistrict);
  }
  return all.filter((a) => a.mood.includes(mood));
}

export function featuredActivity(): Activity | undefined {
  return listPublished().find((a) => a.featured);
}

export function popularActivities(): Activity[] {
  return [...listPublished()].sort((a, b) => b.joinedCount - a.joinedCount);
}

export async function createActivity(
  input: Omit<Activity, 'id' | 'joinedCount' | 'createdAt' | 'status'> & {
    status?: Activity['status'];
  },
): Promise<Activity> {
  const row: Activity = {
    ...input,
    id: nid('a'),
    joinedCount: 0,
    createdAt: new Date().toISOString(),
    status: input.status ?? 'published',
  };
  await mutate((d) => {
    d.activities.push(row);
    const host = d.users.find((u) => u.uid === input.organizerId);
    if (host && host.role === 'user') host.role = 'organizer';
  });
  return row;
}

export async function updateActivity(
  id: string,
  patch: Partial<Activity>,
): Promise<Activity> {
  let next: Activity | undefined;
  await mutate((d) => {
    const a = d.activities.find((x) => x.id === id);
    if (!a) throw new Error('not-found');
    Object.assign(a, patch, { id: a.id, joinedCount: a.joinedCount });
    next = a;
  });
  return next as Activity;
}

export async function setActivityStatus(
  id: string,
  status: Activity['status'],
): Promise<void> {
  await updateActivity(id, { status });
}

export async function setFeatured(id: string, featured: boolean): Promise<void> {
  await updateActivity(id, { featured });
}

export function recountJoined(activityId: string): number {
  return getDb().tickets.filter(
    (t) => t.activityId === activityId && t.status === 'joined',
  ).length;
}
