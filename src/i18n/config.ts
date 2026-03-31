export const languages = {
  ja: '日本語',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'ja';

/** Extract lang from URL path */
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang === 'en') return 'en';
  return 'ja';
}

/** Get path with lang prefix */
export function localePath(path: string, lang: Lang): string {
  if (lang === 'ja') return path;
  return `/en${path}`;
}

/** Get the alternate lang URL */
export function alternateUrl(url: URL): string {
  const lang = getLangFromUrl(url);
  if (lang === 'en') {
    // Remove /en prefix
    return url.pathname.replace(/^\/en/, '') || '/';
  }
  // Add /en prefix
  return `/en${url.pathname}`;
}
