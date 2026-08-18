import type { AppLanguage } from '../types';
import { en } from './en';
import { zhHans } from './zh-Hans';
import { zhHant, type Dict } from './zh-Hant';

const tables: Record<AppLanguage, Dict> = {
  'zh-Hant': zhHant,
  en,
  'zh-Hans': zhHans,
};

export function t(lang: AppLanguage, key: string): string {
  return tables[lang][key] ?? tables['zh-Hant'][key] ?? key;
}

export { en, zhHans, zhHant };
export type { Dict };
