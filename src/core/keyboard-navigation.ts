import type { KeyboardNavigationHandler, FlatpickrInstance, DayElement, CalendarContainer } from '../types';
import { getAllNavigableDays, moveFocusToDay } from '../utils/dom';
import { t } from './language';
import { screenReaderAnnouncer } from '../utils/announcements';

/**
 * Keyboard navigation handler
 */
export class KeyboardNavigationHandlerImpl implements KeyboardNavigationHandler {
  /**
   * Add keyboard navigation to calendar
   */
  public addKeyboardNavigation(instance: FlatpickrInstance): void {
    const calendar = instance.calendarContainer;

    calendar.addEventListener('keydown', (e: KeyboardEvent) => {
      const activeElement = calendar.querySelector('.flatpickr-day:focus') ||
                           calendar.querySelector('.flatpickr-day[tabindex="0"]');
      const activeDay = activeElement as HTMLElement | null;

      if (!activeDay) return;

      switch(e.key) {
        case 'Home':
          e.preventDefault();
          const firstDay = getAllNavigableDays(instance.calendarContainer)[0];
          if (firstDay) {
            moveFocusToDay(activeDay, firstDay);
          }
          break;

        case 'End':
          e.preventDefault();
          const allDays = getAllNavigableDays(instance.calendarContainer);
          const lastDay = allDays[allDays.length - 1];
          if (lastDay) {
            moveFocusToDay(activeDay, lastDay);
          }
          break;

        case 'PageUp':
          e.preventDefault();
          this.navigateByDateOffset(instance, e.shiftKey ? 'year' : 'month', -1, activeDay as DayElement);
          break;

        case 'PageDown':
          e.preventDefault();
          this.navigateByDateOffset(instance, e.shiftKey ? 'year' : 'month', 1, activeDay as DayElement);
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!activeDay.classList.contains('flatpickr-disabled')) {
            const dateLabel = activeDay.getAttribute('aria-label');
            screenReaderAnnouncer.announce(`${t('dateSelected', instance)} ${dateLabel}`);
            (activeDay as HTMLElement).click();
          }
          break;

        case 'Escape':
          e.preventDefault();
          instance.close();
          break;
      }
    });
  }

  /**
   * Get all navigable days in the calendar
   */
  public getAllNavigableDays(calendar: CalendarContainer): DayElement[] {
    return getAllNavigableDays(calendar) as DayElement[];
  }

  /**
   * Move focus to a specific day
   */
  public moveFocusToDay(currentDay: DayElement, targetDay: DayElement): void {
    moveFocusToDay(currentDay, targetDay);
  }

  /**
   * Navigate by date offset (month or year)
   */
  public navigateByDateOffset(instance: FlatpickrInstance, unit: 'month' | 'year', offset: number, activeDay: DayElement): void {
    // Construct date from active day and flatpickr instance state
    const day = parseInt(activeDay.textContent, 10);
    if (isNaN(day)) return;

    const currentDate = new Date(instance.currentYear, instance.currentMonth, day);
    if (isNaN(currentDate.getTime())) return;

    const targetDate = new Date(currentDate);

    if (unit === 'month') {
      targetDate.setMonth(targetDate.getMonth() + offset);
    } else if (unit === 'year') {
      targetDate.setFullYear(targetDate.getFullYear() + offset);
    }

    // --- VALIDATION LOGIC ---
    const { minDate, maxDate } = instance.config;

    if (offset < 0 && minDate) { // Navigating backwards
      const lastDayOfTargetMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
      if (lastDayOfTargetMonth < minDate) {
        return; // Block navigation
      }
    }

    if (offset > 0 && maxDate) { // Navigating forwards
      const firstDayOfTargetMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      if (firstDayOfTargetMonth > maxDate) {
        return; // Block navigation
      }
    }
    // --- END VALIDATION LOGIC ---

    instance.jumpToDate(targetDate, true);

    // After jumping, focus on the first available day of the new month
    setTimeout(() => {
      const firstDay = getAllNavigableDays(instance.calendarContainer)[0];
      if (firstDay) {
        // Find the previously focused element to pass to moveFocusToDay
        const currentFocused = instance.calendarContainer.querySelector('.flatpickr-day[tabindex="0"]') as HTMLElement | null;
        moveFocusToDay((currentFocused || activeDay) as DayElement, firstDay);
      }
    }, 100); // Delay to ensure calendar has re-rendered
  }
}

// Export singleton instance
export const keyboardNavigationHandler = new KeyboardNavigationHandlerImpl();
