import type { LanguageManager, SupportedLanguage, FlatpickrInstance, LocaleStrings } from '../types';

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
    // In browser environments, we need to handle locale loading differently
    // since require() is not available. We'll use a fallback approach.
    try {
      // Try to load locales using dynamic imports (works in modern browsers)
      if (typeof window !== 'undefined' && 'import' in window) {
        // For now, return the fallback locales since dynamic imports would be async
        // and we need synchronous access to locales
        throw new Error('Using fallback locales');
      }

      // Fallback for environments where require might work
      if (typeof require !== 'undefined') {
        const { en, pl, da, sv, no } = require('../locales');
        return {
          EN: en,
          PL: pl,
          DA: da,
          SV: sv,
          NO: no
        };
      }

      throw new Error('No locale loading mechanism available');
    } catch (error) {
      // Fallback locales - always available
      return {
        EN: {
          calendarOpened: 'Calendar opened',
          calendarClosed: 'Calendar closed',
          dateSelected: 'Date selected:',
          today: ' (today)',
          previousMonth: ' (previous month)',
          nextMonth: ' (next month)',
          selectDate: 'Select date',
          instructions: 'Use arrow keys to navigate the calendar. Enter selects date, Escape closes. Page Up/Down changes month.',
          dateSelection: 'Date selection',
          monthlyCalendar: 'Monthly calendar',
          previousMonthButton: 'Previous month',
          nextMonthButton: 'Next month'
        },
        PL: {
          calendarOpened: 'Kalendarz otwarty',
          calendarClosed: 'Kalendarz zamknięty',
          dateSelected: 'Wybrano datę:',
          today: ' (dzisiaj)',
          previousMonth: ' (poprzedni miesiąc)',
          nextMonth: ' (następny miesiąc)',
          selectDate: 'Wybierz datę',
          instructions: 'Użyj strzałek do nawigacji po kalendarzu. Enter wybiera datę, Escape zamyka. PageUp/PageDown zmienia miesiąc.',
          dateSelection: 'Wybór daty',
          monthlyCalendar: 'Kalendarz miesięczny',
          previousMonthButton: 'Poprzedni miesiąc',
          nextMonthButton: 'Następny miesiąc'
        },
        DA: {
          calendarOpened: 'Kalender åbnet',
          calendarClosed: 'Kalender lukket',
          dateSelected: 'Dato valgt:',
          today: ' (i dag)',
          previousMonth: ' (forrige måned)',
          nextMonth: ' (næste måned)',
          selectDate: 'Vælg dato',
          instructions: 'Brug piletaster til at navigere i kalenderen. Enter vælger dato, Escape lukker. Page Up/Down skifter måned.',
          dateSelection: 'Datovalg',
          monthlyCalendar: 'Månedlig kalender',
          previousMonthButton: 'Forrige måned',
          nextMonthButton: 'Næste måned'
        },
        SV: {
          calendarOpened: 'Kalender öppnad',
          calendarClosed: 'Kalender stängd',
          dateSelected: 'Datum valt:',
          today: ' (idag)',
          previousMonth: ' (förra månaden)',
          nextMonth: ' (nästa månad)',
          selectDate: 'Välj datum',
          instructions: 'Använd piltangenter för att navigera i kalendern. Enter väljer datum, Escape stänger. Page Up/Down byter månad.',
          dateSelection: 'Datumval',
          monthlyCalendar: 'Månadskalender',
          previousMonthButton: 'Föregående månad',
          nextMonthButton: 'Nästa månad'
        },
        NO: {
          calendarOpened: 'Kalender åpnet',
          calendarClosed: 'Kalender lukket',
          dateSelected: 'Dato valgt:',
          today: ' (i dag)',
          previousMonth: ' (forrige måned)',
          nextMonth: ' (neste måned)',
          selectDate: 'Velg dato',
          instructions: 'Bruk piltaster for å navigere i kalenderen. Enter velger dato, Escape lukker. Page Up/Down bytter måned.',
          dateSelection: 'Datovalg',
          monthlyCalendar: 'Månedlig kalender',
          previousMonthButton: 'Forrige måned',
          nextMonthButton: 'Neste måned'
        }
      };
    }
  }
}

// Export singleton instance
export const languageManager = LanguageManagerImpl.getInstance();

// Convenience function for getting translations
export function t(key: keyof LocaleStrings, instance: FlatpickrInstance | null = null): string {
  return languageManager.getTranslation(key, instance);
}
