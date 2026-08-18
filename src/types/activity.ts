import type { AppLanguage, MoodId } from './user';

export type ActivityStatus = 'published' | 'hidden';
export type EventLanguage = AppLanguage | 'mixed';

export type Activity = {
  id: string;
  title: string;
  photoUrl: string;
  district: string;
  address: string;
  startsAt: string;
  endsAt: string;
  priceHkd: number;
  summary: string;
  capacity: number;
  joinedCount: number;
  eventLanguage: EventLanguage;
  mood: MoodId[];
  organizerId: string;
  status: ActivityStatus;
  featured: boolean;
  createdAt: string;
};
