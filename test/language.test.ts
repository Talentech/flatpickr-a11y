import { describe, it, expect, beforeEach } from 'vitest';
import { LanguageManagerImpl } from '../src/core/language';

describe('LanguageManager', () => {
  let languageManager: LanguageManagerImpl;

  beforeEach(() => {
    languageManager = LanguageManagerImpl.getInstance();
    // Reset any global language settings
    delete (globalThis as any).accessibleFlatpickrLanguage;
  });

  describe('getCurrentLanguage', () => {
    it('should return EN as default language', () => {
      const lang = languageManager.getCurrentLanguage();
      expect(lang).toBe('EN');
    });

    it('should return explicitly set language', () => {
      (globalThis as any).accessibleFlatpickrLanguage = 'PL';
      const lang = languageManager.getCurrentLanguage();
      expect(lang).toBe('PL');
    });

    it('should detect language from flatpickr instance', () => {
      const mockInstance = {
        l10n: {
          code: 'pl'
        }
      } as any;

      const lang = languageManager.getCurrentLanguage(mockInstance);
      expect(lang).toBe('PL');
    });

    it('should fallback to English for unknown locale', () => {
      const mockInstance = {
        l10n: {
          code: 'unknown'
        }
      } as any;

      const lang = languageManager.getCurrentLanguage(mockInstance);
      expect(lang).toBe('EN');
    });
  });

  describe('mapFlatpickrLocaleToLanguage', () => {
    it('should map direct language codes', () => {
      expect(languageManager.mapFlatpickrLocaleToLanguage({ code: 'EN' })).toBe('EN');
      expect(languageManager.mapFlatpickrLocaleToLanguage({ code: 'PL' })).toBe('PL');
      expect(languageManager.mapFlatpickrLocaleToLanguage({ code: 'DA' })).toBe('DA');
    });

    it('should map partial matches', () => {
      expect(languageManager.mapFlatpickrLocaleToLanguage({ code: 'en-US' })).toBe('EN');
      expect(languageManager.mapFlatpickrLocaleToLanguage({ code: 'pl-PL' })).toBe('PL');
    });

    it('should map special locale codes', () => {
      expect(languageManager.mapFlatpickrLocaleToLanguage({ code: 'NB' })).toBe('NO');
      expect(languageManager.mapFlatpickrLocaleToLanguage({ code: 'SV-SE' })).toBe('SV');
    });

    it('should return null for invalid input', () => {
      expect(languageManager.mapFlatpickrLocaleToLanguage({ code: '' })).toBeNull();
      expect(languageManager.mapFlatpickrLocaleToLanguage({} as any)).toBeNull();
    });
  });

  describe('getTranslation', () => {
    it('should return translation for key', () => {
      const translation = languageManager.getTranslation('calendarOpened');
      expect(translation).toBeDefined();
      expect(typeof translation).toBe('string');
    });

    it('should handle different languages', () => {
      (globalThis as any).accessibleFlatpickrLanguage = 'PL';
      const translation = languageManager.getTranslation('calendarOpened');
      expect(translation).toBeDefined();
      expect(typeof translation).toBe('string');
    });
  });
});
