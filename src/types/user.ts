export type Role = 'user' | 'organizer' | 'admin';
export type AppLanguage = 'zh-Hant' | 'en' | 'zh-Hans';
export type MoodId = 'quiet' | 'create' | 'meet' | 'weekend' | 'nearby';

export type User = {
  uid: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  bio?: string;
  role: Role;
  interests: MoodId[];
  language: AppLanguage;
  homeDistrict: string;
  createdAt: string;
  banned?: boolean;
  onboarded?: boolean;
};
