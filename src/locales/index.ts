import type { SupportedLanguage, LocaleStrings } from '../types';

// Export all locale files
export { default as en } from './en';
export { default as pl } from './pl';
export { default as da } from './da';
export { default as sv } from './sv';
export { default as no } from './no';

// Export type for extensibility
export type { LocaleStrings };

// Registry for custom locales
const customLocales: Record<string, LocaleStrings> = {};

/**
 * Register a custom locale
 */
export function registerLocale(languageCode: string, locale: LocaleStrings): void {
  customLocales[languageCode] = locale;
}

/**
 * Get a locale by language code, including custom ones
 */
export function getLocale(languageCode: SupportedLanguage | string): LocaleStrings {
  // First check custom locales
  if (customLocales[languageCode]) {
    return customLocales[languageCode];
  }

  // Then check built-in locales
  switch (languageCode) {
    case 'EN':
      return require('./en').default;
    case 'PL':
      return require('./pl').default;
    case 'DA':
      return require('./da').default;
    case 'SV':
      return require('./sv').default;
    case 'NO':
      return require('./no').default;
    default:
      return require('./en').default; // Fallback to English
  }
}

/**
 * Get all available locale codes
 */
export function getAvailableLocaleCodes(): string[] {
  return ['EN', 'PL', 'DA', 'SV', 'NO', ...Object.keys(customLocales)];
}
