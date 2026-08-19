import type { Message, MessageKind } from '../types';
import { getDb, mutate, nid } from './store';
import { hasJoinedTicket } from './tickets';

export function listMessages(activityId: string, kind: MessageKind): Message[] {
  return getDb()
    .messages.filter((m) => m.activityId === activityId && m.kind === kind)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function postMessage(input: {
  activityId: string;
  userId: string;
  text: string;
  kind: MessageKind;
}): Promise<Message> {
  const text = input.text.trim();
  if (!text) throw new Error('empty-text');
  if (!hasJoinedTicket(input.userId, input.activityId)) {
    throw new Error('not-holder');
  }
  const row: Message = {
    id: nid('m'),
    activityId: input.activityId,
    userId: input.userId,
    text,
    createdAt: new Date().toISOString(),
    kind: input.kind,
  };
  await mutate((d) => {
    d.messages.push(row);
  });
  return row;
}
