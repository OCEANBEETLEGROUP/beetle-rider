import ja from './ja';
import en from './en';
import type { Lang } from './config';

const translations = { ja, en } as const;

type TranslationKey = keyof typeof ja;

/** Get a translated string by key */
export function t(lang: Lang, key: TranslationKey): string | string[] {
  return (translations[lang] as any)[key] ?? (translations['ja'] as any)[key] ?? key;
}

/** Create a bound translator for a specific language */
export function useTranslations(lang: Lang) {
  return (key: TranslationKey) => t(lang, key);
}

export type { TranslationKey };
