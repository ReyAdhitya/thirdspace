import type { AppLanguage } from '../types';
import { t as translate } from '../i18n';

export function stampKeys(joinCount: number): string[] {
  const keys: string[] = [];
  if (joinCount >= 1) keys.push('stamp1');
  if (joinCount >= 3) keys.push('stamp3');
  if (joinCount >= 5) keys.push('stamp5');
  if (joinCount >= 8) keys.push('stamp8');
  return keys;
}

export function tt(lang: AppLanguage, key: string): string {
  return translate(lang, key);
}
