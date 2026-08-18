import { getDb, mutate } from './store';

export function savedIds(userId: string): string[] {
  return getDb()
    .saves.filter((s) => s.userId === userId)
    .map((s) => s.activityId);
}

export function isSaved(userId: string, activityId: string): boolean {
  return getDb().saves.some((s) => s.userId === userId && s.activityId === activityId);
}

export async function toggleSave(userId: string, activityId: string): Promise<boolean> {
  let on = false;
  await mutate((d) => {
    const idx = d.saves.findIndex(
      (s) => s.userId === userId && s.activityId === activityId,
    );
    if (idx >= 0) {
      d.saves.splice(idx, 1);
      on = false;
    } else {
      d.saves.push({ userId, activityId });
      on = true;
    }
  });
  return on;
}
