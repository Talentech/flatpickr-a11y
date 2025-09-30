import type { FlatpickrInstance, CalendarContainer, DayElement } from '../types';
import { t } from '../core/language';

/**
 * Calendar accessibility enhancer
 */
export class CalendarEnhancer {
  /**
   * Enhance calendar accessibility
   */
  public enhance(calendar: CalendarContainer, instance: FlatpickrInstance): void {
    calendar.setAttribute('role', 'dialog');
    calendar.setAttribute('aria-label', t('dateSelection', instance));

    const monthContainer = calendar.querySelector('.flatpickr-days');
    if (monthContainer) {
      // No longer a grid, so remove the role
      monthContainer.removeAttribute('role');
      monthContainer.setAttribute('aria-label', t('monthlyCalendar', instance));
    }

    // Enhance day elements
    this.enhanceDayElements(calendar, instance);
  }

  /**
   * Enhance individual day elements
   */
  private enhanceDayElements(calendar: CalendarContainer, instance: FlatpickrInstance): void {
    const dayElements = calendar.querySelectorAll('.flatpickr-day');

    dayElements.forEach((dayElem: Element) => {
      const dayElement = dayElem as DayElement;

      // The reliable Date object is on dayElem.dateObj, not the first argument.
      const dateObject = (dayElement as any).dateObj;
      if (!dateObject || !(dateObject instanceof Date)) return;

      dayElement.setAttribute('role', 'button');
      dayElement.setAttribute('tabindex', '-1');

      const dateText = dayElement.textContent?.trim();
      if (!dateText) return;

      // Use the date object and flatpickr instance for more reliable labels
      const monthName = instance.l10n.months.longhand[dateObject.getMonth()];
      const year = dateObject.getFullYear();
      let fullDate = `${dateObject.getDate()} ${monthName} ${year}`;

      if (dayElement.classList.contains('today')) {
        fullDate += t('today', instance);
      }
      if (dayElement.classList.contains('prevMonthDay')) {
        fullDate += t('previousMonth', instance);
      }
      if (dayElement.classList.contains('nextMonthDay')) {
        fullDate += t('nextMonth', instance);
      }
      dayElement.setAttribute('aria-label', fullDate);

      // aria-pressed is handled by flatpickr's default selected class
      if (dayElement.classList.contains('selected')) {
        dayElement.setAttribute('aria-pressed', 'true');
        dayElement.setAttribute('tabindex', '0');
      } else {
        dayElement.setAttribute('aria-pressed', 'false');
      }

      // aria-disabled is handled by flatpickr's default disabled class
      if (dayElement.classList.contains('flatpickr-disabled')) {
        dayElement.setAttribute('aria-disabled', 'true');
      } else {
        dayElement.removeAttribute('aria-disabled');
      }
    });
  }
}
