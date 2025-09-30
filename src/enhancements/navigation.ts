import type { FlatpickrInstance, CalendarContainer } from '../types';
import { t } from '../core/language';

/**
 * Navigation buttons accessibility enhancer
 */
export class NavigationEnhancer {
  /**
   * Enhance navigation buttons accessibility
   */
  public enhance(calendar: CalendarContainer, instance: FlatpickrInstance): void {
    this.enhancePrevButton(calendar, instance);
    this.enhanceNextButton(calendar, instance);
    this.enhanceCurrentMonth(calendar, instance);
  }

  /**
   * Enhance previous month button
   */
  private enhancePrevButton(calendar: CalendarContainer, instance: FlatpickrInstance): void {
    const prevButton = calendar.querySelector('.flatpickr-prev-month');
    if (prevButton) {
      prevButton.setAttribute('aria-label', t('previousMonthButton', instance));
      prevButton.setAttribute('role', 'button');
      prevButton.setAttribute('tabindex', '0');

      prevButton.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          (prevButton as HTMLElement).click();
        }
      });
    }
  }

  /**
   * Enhance next month button
   */
  private enhanceNextButton(calendar: CalendarContainer, instance: FlatpickrInstance): void {
    const nextButton = calendar.querySelector('.flatpickr-next-month');
    if (nextButton) {
      nextButton.setAttribute('aria-label', t('nextMonthButton', instance));
      nextButton.setAttribute('role', 'button');
      nextButton.setAttribute('tabindex', '0');

      nextButton.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          (nextButton as HTMLElement).click();
        }
      });
    }
  }

  /**
   * Enhance current month display
   */
  private enhanceCurrentMonth(calendar: CalendarContainer, instance: FlatpickrInstance): void {
    const currentMonth = calendar.querySelector('.flatpickr-current-month');
    if (currentMonth) {
      currentMonth.setAttribute('aria-live', 'polite');
      currentMonth.setAttribute('aria-atomic', 'true');
    }
  }
}
