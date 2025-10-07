/**
 * DOM utility functions
 */

/**
 * Check if an element is disabled
 */
export function isElementDisabled(element: HTMLElement): boolean {
  return element.classList.contains('flatpickr-disabled') ||
         element.getAttribute('aria-disabled') === 'true';
}

/**
 * Get all navigable days in the calendar
 */
export function getAllNavigableDays(calendar: HTMLElement): HTMLElement[] {
  const daysContainer = calendar.querySelector('.flatpickr-days');
  if (!daysContainer) return [];

  return Array.from(daysContainer.querySelectorAll('.flatpickr-day:not(.flatpickr-disabled):not(.prevMonthDay):not(.nextMonthDay)')) as HTMLElement[];
}

/**
 * Move focus to a specific day
 */
export function moveFocusToDay(currentDay: HTMLElement, targetDay: HTMLElement): void {
  if (!targetDay || isElementDisabled(targetDay)) {
    return; // Do not move focus to a disabled or non-existent day
  }

  // Clear current focus
  currentDay.setAttribute('tabindex', '-1');

  // Set new focus
  targetDay.setAttribute('tabindex', '0');
  targetDay.focus();

  // Announce the new date to screen readers
  const dateAnnouncement = targetDay.getAttribute('aria-label');
  if (dateAnnouncement) {
    announceToScreenReader(dateAnnouncement);
  }
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message: string): void {
  const liveRegion = document.getElementById('flatpickr-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 10);
  }
}
