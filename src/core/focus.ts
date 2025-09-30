import type { FocusManager, FlatpickrInstance } from '../types';
import { getAllNavigableDays, moveFocusToDay } from '../utils/dom';

/**
 * Focus management for accessibility
 */
export class FocusManagerImpl implements FocusManager {
  /**
   * Manage focus when calendar opens
   */
  public manageFocusOnOpen(instance: FlatpickrInstance): void {
    const calendar = instance.calendarContainer;
    const selectedDay = calendar.querySelector('.flatpickr-day.selected') ||
                       calendar.querySelector('.flatpickr-day.today') ||
                       calendar.querySelector('.flatpickr-day:not(.flatpickr-disabled):not(.prevMonthDay):not(.nextMonthDay)') as HTMLElement | null;

    if (selectedDay) {
      calendar.querySelectorAll('.flatpickr-day').forEach(day => {
        const htmlDay = day as HTMLElement;
        htmlDay.setAttribute('tabindex', '-1');
      });

      selectedDay.setAttribute('tabindex', '0');
      setTimeout(() => {
        (selectedDay as HTMLElement).focus();
      }, 100);
    }

    instance.element.setAttribute('aria-expanded', 'true');
  }

  /**
   * Return focus to input when calendar closes
   */
  public returnFocusToInput(instance: FlatpickrInstance): void {
    instance.element.focus();
    instance.element.setAttribute('aria-expanded', 'false');
  }
}

// Export singleton instance
export const focusManager = new FocusManagerImpl();
