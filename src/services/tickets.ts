import type { Ticket } from '../types';
import { getActivity } from './activities';
import { getDb, mutate, nid } from './store';

export type JoinResult =
  | { ok: true; ticket: Ticket; kind: 'joined' | 'waitlisted' }
  | { ok: false; reason: 'full' | 'started' | 'hidden' | 'exists' | 'need-pay' | 'banned' | 'missing' };

export function ticketsForUser(uid: string): Ticket[] {
  return getDb()
    .tickets.filter((t) => t.userId === uid)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function ticketFor(uid: string, activityId: string): Ticket | undefined {
  return getDb().tickets.find(
    (t) =>
      t.userId === uid &&
      t.activityId === activityId &&
      t.status !== 'cancelled',
  );
}

export function hasJoinedTicket(uid: string, activityId: string): boolean {
  return getDb().tickets.some(
    (t) => t.userId === uid && t.activityId === activityId && t.status === 'joined',
  );
}

async function promoteWaitlist(activityId: string): Promise<string | null> {
  const db = getDb();
  const next = db.tickets
    .filter((t) => t.activityId === activityId && t.status === 'waitlisted')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
  if (!next) return null;
  await mutate((d) => {
    const t = d.tickets.find((x) => x.id === next.id);
    const a = d.activities.find((x) => x.id === activityId);
    if (!t || !a) return;
    t.status = 'joined';
    a.joinedCount = d.tickets.filter(
      (x) => x.activityId === activityId && x.status === 'joined',
    ).length;
  });
  return next.userId;
}

export async function joinActivity(
  uid: string,
  activityId: string,
  opts?: { paid?: boolean; allowWaitlist?: boolean },
): Promise<JoinResult> {
  const user = getDb().users.find((u) => u.uid === uid);
  if (!user) return { ok: false, reason: 'missing' };
  if (user.banned) return { ok: false, reason: 'banned' };

  const activity = getActivity(activityId);
  if (!activity) return { ok: false, reason: 'missing' };
  if (activity.status === 'hidden') return { ok: false, reason: 'hidden' };

  const existing = ticketFor(uid, activityId);
  if (existing?.status === 'joined') return { ok: false, reason: 'exists' };
  if (existing?.status === 'waitlisted') {
    return { ok: true, ticket: existing, kind: 'waitlisted' };
  }

  const now = Date.now();
  if (now >= new Date(activity.startsAt).getTime()) {
    return { ok: false, reason: 'started' };
  }

  const needsPay = activity.priceHkd > 0 && !opts?.paid;
  if (needsPay) return { ok: false, reason: 'need-pay' };

  const joined = getDb().tickets.filter(
    (t) => t.activityId === activityId && t.status === 'joined',
  ).length;
  const full = joined >= activity.capacity;

  if (full && !opts?.allowWaitlist) return { ok: false, reason: 'full' };

  const ticket: Ticket = {
    id: nid('t'),
    userId: uid,
    activityId,
    status: full ? 'waitlisted' : 'joined',
    paid: activity.priceHkd === 0 || Boolean(opts?.paid),
    createdAt: new Date().toISOString(),
  };

  await mutate((d) => {
    d.tickets.push(ticket);
    const a = d.activities.find((x) => x.id === activityId);
    if (a) {
      a.joinedCount = d.tickets.filter(
        (x) => x.activityId === activityId && x.status === 'joined',
      ).length;
    }
  });

  return {
    ok: true,
    ticket,
    kind: ticket.status === 'waitlisted' ? 'waitlisted' : 'joined',
  };
}

export async function cancelTicket(
  uid: string,
  ticketId: string,
): Promise<{ promotedUid: string | null }> {
  const row = getDb().tickets.find((t) => t.id === ticketId && t.userId === uid);
  if (!row) throw new Error('not-found');
  const activityId = row.activityId;
  const wasJoined = row.status === 'joined';
  await mutate((d) => {
    const t = d.tickets.find((x) => x.id === ticketId);
    const a = d.activities.find((x) => x.id === activityId);
    if (!t) return;
    t.status = 'cancelled';
    if (a) {
      a.joinedCount = d.tickets.filter(
        (x) => x.activityId === activityId && x.status === 'joined',
      ).length;
    }
  });
  let promotedUid: string | null = null;
  if (wasJoined) promotedUid = await promoteWaitlist(activityId);
  return { promotedUid };
}

export function waitlistPosition(uid: string, activityId: string): number | null {
  const list = getDb()
    .tickets.filter((t) => t.activityId === activityId && t.status === 'waitlisted')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const idx = list.findIndex((t) => t.userId === uid);
  return idx >= 0 ? idx + 1 : null;
}
