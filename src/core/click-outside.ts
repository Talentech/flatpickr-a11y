import type { ClickOutsideHandler, FlatpickrInstance } from '../types';

/**
 * Click outside handler for closing calendar
 */
export class ClickOutsideHandlerImpl implements ClickOutsideHandler {
  private handlers = new Map<FlatpickrInstance, EventListener>();

  /**
   * Setup click outside to close calendar
   */
  public setup(instance: FlatpickrInstance): void {
    if (this.handlers.has(instance)) {
      return; // Listener is already active
    }

    const handler = (event: Event) => {
      // Check if the click is on an element that is not a child of the calendar or the input
      const isClickInside = instance.calendarContainer.contains(event.target as Node) ||
                            instance.element.contains(event.target as Node);

      if (instance.isOpen && !isClickInside) {
        instance.close();
      }
    };

    this.handlers.set(instance, handler);

    // Add listener with a timeout to avoid it being triggered by the event that opened the picker
    setTimeout(() => {
      document.addEventListener('mousedown', handler, true);
      document.addEventListener('touchstart', handler, true);
    }, 0);
  }

  /**
   * Remove click outside listener
   */
  public remove(instance: FlatpickrInstance): void {
    const handler = this.handlers.get(instance);
    if (handler) {
      document.removeEventListener('mousedown', handler, true);
      document.removeEventListener('touchstart', handler, true);
      this.handlers.delete(instance);
    }
  }
}

// Export singleton instance
export const clickOutsideHandler = new ClickOutsideHandlerImpl();
