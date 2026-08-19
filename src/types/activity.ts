import type { AppLanguage, MoodId } from './user';

export type ActivityStatus = 'published' | 'hidden';
export type EventLanguage = AppLanguage | 'mixed';

export type Activity = {
  id: string;
  title: string;
  /** English copy for the same event, so a card never mixes languages. */
  titleEn?: string;
  summaryEn?: string;
  addressEn?: string;
  photoUrl: string;
  district: string;
  address: string;
  /** WGS84, used to centre the Google Embed map on this event. */
  lat?: number;
  lng?: number;
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
