export type TicketStatus = 'joined' | 'cancelled' | 'waitlisted';

export type Ticket = {
  id: string;
  userId: string;
  activityId: string;
  status: TicketStatus;
  paid: boolean;
  createdAt: string;
};

export type MessageKind = 'chat' | 'comment';

export type Message = {
  id: string;
  activityId: string;
  userId: string;
  text: string;
  createdAt: string;
  kind: MessageKind;
};

export type Follow = {
  id: string;
  followerId: string;
  organizerId: string;
  createdAt: string;
};

export type ReportTarget = 'user' | 'host' | 'event';
export type ReportStatus = 'open' | 'resolved';

export type Report = {
  id: string;
  reporterId: string;
  targetType: ReportTarget;
  targetId: string;
  reason: string;
  createdAt: string;
  status: ReportStatus;
};

export type Save = {
  userId: string;
  activityId: string;
};
