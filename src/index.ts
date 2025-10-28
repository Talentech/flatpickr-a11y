import type { FlatpickrInstance, AccessibleFlatpickrOptions } from './types';
import { accessibilityEnhancer } from './enhancements/accessibility';
import { focusManager } from './core/focus';
import { clickOutsideHandler } from './core/click-outside';
import { t } from './core/language';
import { screenReaderAnnouncer } from './utils/announcements';
import { dateUtils } from './utils/date';

// Store original flatpickr function
let originalFlatpickr: any = null;

/**
 * Enhanced flatpickr initialization with accessibility features
 */
export function createDefaultOptions(options: AccessibleFlatpickrOptions = {}): AccessibleFlatpickrOptions {
  return {
    onReady(selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) {
      accessibilityEnhancer.enhance(instance);
      options.onReady?.(selectedDates, dateStr, instance);
    },

    onOpen(selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) {
      screenReaderAnnouncer.announce(t('calendarOpened', instance));
      focusManager.manageFocusOnOpen(instance);
      clickOutsideHandler.setup(instance);
      options.onOpen?.(selectedDates, dateStr, instance);
    },

    onClose(selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) {
      screenReaderAnnouncer.announce(t('calendarClosed', instance));
      focusManager.returnFocusToInput(instance);
      clickOutsideHandler.remove(instance);
      options.onClose?.(selectedDates, dateStr, instance);
    },

    onChange(selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) {
      if (dateStr) {
        const formattedDate = dateUtils.formatDateForScreenReader(selectedDates[0]);
        screenReaderAnnouncer.announce(`${t('dateSelected', instance)} ${formattedDate}`);
      }
      options.onChange?.(selectedDates, dateStr, instance);
    },

    onDayCreate(dObj: Date, dStr: string, fp: FlatpickrInstance, dayElem: any) {
      const dateObject = (dayElem as any).dateObj;
      if (dateObject) {
        const monthName = fp.l10n.months.longhand[dateObject.getMonth()];
        const year = dateObject.getFullYear();
        let fullDate = `${dateObject.getDate()} ${monthName} ${year}`;

        if (dayElem.classList.contains('today')) {
          fullDate += t('today', fp);
        }
        if (dayElem.classList.contains('prevMonthDay')) {
          fullDate += t('previousMonth', fp);
        }
        if (dayElem.classList.contains('nextMonthDay')) {
          fullDate += t('nextMonth', fp);
        }
        dayElem.setAttribute('aria-label', fullDate);
      }

      options.onDayCreate?.(dObj, dStr, fp, dayElem);
    }
  };
}

export function initAccessibleFlatpickr(selector: string | Element, options: AccessibleFlatpickrOptions = {}): FlatpickrInstance | null {
  if (!originalFlatpickr) {
    console.error('Flatpickr is not loaded. Please include flatpickr before this script.');
    return null;
  }

  screenReaderAnnouncer.setup();

  // Merge: user's config options + enhanced handlers (handlers take precedence)
  const enhancedOptions = { ...options, ...createDefaultOptions(options) };

  return originalFlatpickr(selector, enhancedOptions);
}

/**
 * Auto-enhance existing flatpickr instances and override the flatpickr function
 */
function autoEnhanceFlatpickr(): void {
  // Wait for flatpickr to be loaded
  if (typeof (window as any).flatpickr === 'undefined') {
    if (typeof window !== 'undefined') {
      // Browser environment - try again later
      setTimeout(autoEnhanceFlatpickr, 100);
    }
    return;
  }

  // Store original flatpickr function
  originalFlatpickr = (window as any).flatpickr;

  // Override the global flatpickr function to automatically enhance instances
  (window as any).flatpickr = function(selector: string | Element, options: AccessibleFlatpickrOptions = {}) {
    // Merge: user's config options + enhanced handlers (handlers take precedence)
    const enhancedOptions = { ...options, ...createDefaultOptions(options) };
    
    // Create instance with enhanced options
    const instance = originalFlatpickr(selector, enhancedOptions);

    // Enhance the instance after creation for additional DOM enhancements
    if (instance && instance.calendarContainer) {
      // Use setTimeout to ensure the calendar is fully rendered
      setTimeout(() => {
        accessibilityEnhancer.enhance(instance);
      }, 10);
    }

    return instance;
  };

  // Preserve original functionality
  (window as any).flatpickr.originalFlatpickr = originalFlatpickr;

  // Also provide the enhanced initialization function
  (window as any).initAccessibleFlatpickr = initAccessibleFlatpickr;


  console.info('Accessible Flatpickr enhancement loaded');
}

/**
 * Initialize the enhancement
 */
function initialize(): void {
  if (typeof window !== 'undefined') {
    // Browser environment
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        // Ensure announcer is set up first
        screenReaderAnnouncer.setup();
        autoEnhanceFlatpickr();
      });
    } else {
      // Ensure announcer is set up first
      screenReaderAnnouncer.setup();
      autoEnhanceFlatpickr();
    }
  }
}

// Initialize immediately
initialize();

// Export for module usage
export default {
  initAccessibleFlatpickr,
  accessibilityEnhancer,
  focusManager,
  clickOutsideHandler
};
