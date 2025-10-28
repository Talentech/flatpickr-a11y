import type { LanguageManager, SupportedLanguage, FlatpickrInstance, LocaleStrings } from '../types';
import { en, pl, da, sv, no } from '../locales';

const BUILT_IN_LOCALES: Record<SupportedLanguage, LocaleStrings> = {
  EN: en,
  PL: pl,
  DA: da,
  SV: sv,
  NO: no
};

/**
 * Language manager for handling internationalization
 */
export class LanguageManagerImpl implements LanguageManager {
  private static instance: LanguageManagerImpl;
  private currentLanguage: SupportedLanguage | null = null;

  private constructor() {}

  public static getInstance(): LanguageManagerImpl {
    if (!LanguageManagerImpl.instance) {
      LanguageManagerImpl.instance = new LanguageManagerImpl();
    }
    return LanguageManagerImpl.instance;
  }

  /**
   * Get current language from flatpickr locale or fallback
   */
  public getCurrentLanguage(instance: FlatpickrInstance | null = null): SupportedLanguage {
    // First priority: explicitly set language (check both window and globalThis)
    const globalAccessibleFlatpickrLanguage =
      (typeof window !== 'undefined' && (window as any).accessibleFlatpickrLanguage) ||
      (globalThis as any).accessibleFlatpickrLanguage;

    if (globalAccessibleFlatpickrLanguage) {
      return globalAccessibleFlatpickrLanguage as SupportedLanguage;
    }

    // Second priority: detect from flatpickr locale
    const flatpickrLocale = this.detectFlatpickrLocale(instance);
    if (flatpickrLocale) {
      return flatpickrLocale;
    }

    // Fallback to English
    return 'EN';
  }

  /**
   * Detect flatpickr's current locale from a specific instance
   */
  public detectFlatpickrLocale(instance: FlatpickrInstance | null = null): SupportedLanguage | null {
    // If we have a specific instance, get locale from it
    if (instance && instance.l10n) {
      return this.mapFlatpickrLocaleToLanguage(instance.l10n);
    }

    // Try to find the current locale from global flatpickr (check both window and globalThis)
    const globalFlatpickr =
      (typeof window !== 'undefined' && (window as any).flatpickr) ||
      (globalThis as any).flatpickr;

    if (globalFlatpickr) {
      if (globalFlatpickr.l10n) {
        return this.mapFlatpickrLocaleToLanguage(globalFlatpickr.l10n);
      }
      if (globalFlatpickr.defaultLocale) {
        return this.mapFlatpickrLocaleToLanguage(globalFlatpickr.defaultLocale);
      }
    }

    return null;
  }

  /**
   * Map flatpickr locale codes to our language codes
   */
  public mapFlatpickrLocaleToLanguage(locale: { code: string }): SupportedLanguage | null {
    if (!locale || !locale.code) return null;

    const localeCode = locale.code.toUpperCase();

    // Direct matches
    const directMap: Record<string, SupportedLanguage> = {
      'EN': 'EN',
      'PL': 'PL',
      'DA': 'DA',
      'SV': 'SV',
      'NO': 'NO'
    };

    if (directMap[localeCode]) {
      return directMap[localeCode];
    }

    // Partial matches for locale variants
    if (localeCode.startsWith('EN')) return 'EN';
    if (localeCode.startsWith('PL')) return 'PL';
    if (localeCode.startsWith('DA')) return 'DA';
    if (localeCode.startsWith('SV')) return 'SV';
    if (localeCode.startsWith('NO')) return 'NO';

    // Additional common locale mappings
    const localeMap: Record<string, SupportedLanguage> = {
      'EN-US': 'EN',
      'EN-GB': 'EN',
      'EN-CA': 'EN',
      'EN-AU': 'EN',
      'NB': 'NO', // Norwegian Bokmål
      'NN': 'NO', // Norwegian Nynorsk
      'SV-SE': 'SV',
      'SV-FI': 'SV',
      'DA-DK': 'DA'
    };

    if (localeMap[localeCode]) {
      return localeMap[localeCode];
    }

    return null;
  }

  /**
   * Get translation for a key
   */
  public getTranslation(key: keyof LocaleStrings, instance: FlatpickrInstance | null = null): string {
    const lang = this.getCurrentLanguage(instance);

    // Import locales dynamically
    const locales = this.getLocales();
    return locales[lang] && locales[lang][key] ? locales[lang][key] : locales.EN[key];
  }

  /**
   * Get all available locales
   */
  private getLocales(): Record<SupportedLanguage, LocaleStrings> {
    return BUILT_IN_LOCALES;
  }
}

// Export singleton instance
export const languageManager = LanguageManagerImpl.getInstance();

// Convenience function for getting translations
export function t(key: keyof LocaleStrings, instance: FlatpickrInstance | null = null): string {
  return languageManager.getTranslation(key, instance);
}
