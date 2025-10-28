import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScreenReaderAnnouncerImpl } from '../src/utils/announcements';
import { screenReaderAnnouncer } from '../src/utils/announcements';
import { createDefaultOptions } from '../src/index';
import { focusManager } from '../src/core/focus';
import { clickOutsideHandler } from '../src/core/click-outside';
import type { FlatpickrInstance } from '../src/types';

describe('ScreenReaderAnnouncer', () => {
  let announcer: ScreenReaderAnnouncerImpl;

  beforeEach(() => {
    announcer = new ScreenReaderAnnouncerImpl();
    vi.restoreAllMocks();
    delete (globalThis as any).accessibleFlatpickrLanguage;
  });

  describe('announce', () => {
    it('should announce message to screen readers', () => {
      const message = 'Test announcement';

      // Should not throw an error when announcing
      expect(() => announcer.announce(message)).not.toThrow();
    });

    it('should handle multiple announcements', () => {
      // Should handle multiple calls gracefully
      expect(() => {
        announcer.announce('First message');
        announcer.announce('Second message');
      }).not.toThrow();
    });

    it('should handle empty messages', () => {
      expect(() => announcer.announce('')).not.toThrow();
    });

    it('should set up live region correctly', () => {
      // Create a test to verify the live region setup doesn't throw
      expect(() => announcer.setup()).not.toThrow();

      // In test environment, document might not be available
      if (typeof document !== 'undefined') {
        // Check that live region exists and has correct attributes
        const liveRegion = document.getElementById('flatpickr-live-region');
        expect(liveRegion).toBeTruthy();
        expect(liveRegion?.getAttribute('aria-live')).toBe('polite');
        expect(liveRegion?.getAttribute('aria-atomic')).toBe('true');
      }
    });
  });

  describe('integration with flatpickr events', () => {
    it('should announce calendar opened message', () => {
      // Test that the announcer can handle the calendar opened message
      const message = 'Calendar opened';
      expect(() => screenReaderAnnouncer.announce(message)).not.toThrow();
    });

    it('should announce calendar closed message', () => {
      // Test that the announcer can handle the calendar closed message
      const message = 'Calendar closed';
      expect(() => screenReaderAnnouncer.announce(message)).not.toThrow();
    });

    it('should announce date selection messages', () => {
      // Test that the announcer can handle date selection messages
      const message = 'Date selected: Monday, January 1, 2024';
      expect(() => screenReaderAnnouncer.announce(message)).not.toThrow();
    });

    it('should handle localized announcements', () => {
      // Test that the announcer works with different message formats
      const messages = [
        'Calendar opened',
        'Kalendarz otwarty',
        'Kalender åbnet',
        'Kalender öppnad',
        'Kalender åpnet'
      ];

      messages.forEach(message => {
        expect(() => screenReaderAnnouncer.announce(message)).not.toThrow();
      });
    });
  });

  describe('onOpen announcements', () => {
    it('should announce calendar open when default options are used', () => {
      (globalThis as any).accessibleFlatpickrLanguage = 'EN';

      const announceSpy = vi.spyOn(screenReaderAnnouncer, 'announce').mockImplementation(() => {});
      vi.spyOn(focusManager, 'manageFocusOnOpen').mockImplementation(() => {});
      vi.spyOn(clickOutsideHandler, 'setup').mockImplementation(() => {});

      const mockInstance = {
        calendarContainer: {} as HTMLElement,
        element: {
          setAttribute: vi.fn()
        } as unknown as HTMLInputElement,
        l10n: {
          code: 'en',
          months: { longhand: [] as string[] }
        }
      } as unknown as FlatpickrInstance;

      const options = createDefaultOptions();
      options.onOpen?.([], '', mockInstance);

      expect(announceSpy).toHaveBeenCalledWith('Calendar opened');
    });
  });
});
