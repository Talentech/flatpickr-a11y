import type { AccessibilityEnhancer, FlatpickrInstance, CalendarContainer } from '../types';
import { InputEnhancer } from './input';
import { CalendarEnhancer } from './calendar';
import { NavigationEnhancer } from './navigation';
import { keyboardNavigationHandler } from '../core/keyboard-navigation';

/**
 * Main accessibility enhancer that coordinates all accessibility enhancements
 */
export class AccessibilityEnhancerImpl implements AccessibilityEnhancer {
  private inputEnhancer: InputEnhancer;
  private calendarEnhancer: CalendarEnhancer;
  private navigationEnhancer: NavigationEnhancer;

  constructor() {
    this.inputEnhancer = new InputEnhancer();
    this.calendarEnhancer = new CalendarEnhancer();
    this.navigationEnhancer = new NavigationEnhancer();
  }

  /**
   * Enhance flatpickr instance with accessibility features
   */
  public enhance(instance: FlatpickrInstance): void {
    const calendar = instance.calendarContainer;
    const input = instance.element;

    this.inputEnhancer.enhance(input, instance);
    this.calendarEnhancer.enhance(calendar, instance);
    this.navigationEnhancer.enhance(calendar, instance);
    keyboardNavigationHandler.addKeyboardNavigation(instance);
  }

  /**
   * Enhance input field accessibility
   */
  public enhanceInput(input: HTMLInputElement, instance: FlatpickrInstance): void {
    this.inputEnhancer.enhance(input, instance);
  }

  /**
   * Enhance calendar accessibility
   */
  public enhanceCalendar(calendar: CalendarContainer, instance: FlatpickrInstance): void {
    this.calendarEnhancer.enhance(calendar, instance);
  }

  /**
   * Enhance navigation buttons accessibility
   */
  public enhanceNavigationButtons(calendar: CalendarContainer, instance: FlatpickrInstance): void {
    this.navigationEnhancer.enhance(calendar, instance);
  }
}

// Export singleton instance
export const accessibilityEnhancer = new AccessibilityEnhancerImpl();
