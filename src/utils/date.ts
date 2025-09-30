import type { DateUtils } from '../types';

/**
 * Date utility functions
 */
export class DateUtilsImpl implements DateUtils {
  /**
   * Format date for screen reader
   */
  public formatDateForScreenReader(date: Date): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Export singleton instance
export const dateUtils = new DateUtilsImpl();
