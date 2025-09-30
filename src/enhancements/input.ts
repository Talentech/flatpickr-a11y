import type { FlatpickrInstance } from '../types';
import { t } from '../core/language';

/**
 * Input field accessibility enhancer
 */
export class InputEnhancer {
  /**
   * Enhance input field accessibility
   */
  public enhance(input: HTMLInputElement, instance: FlatpickrInstance): void {
    // Generate a unique ID for the calendar popup and link it with aria-controls
    const calendarId = input.id + '-calendar';
    instance.calendarContainer.id = calendarId;

    input.setAttribute('aria-label', t('selectDate', instance));
    input.setAttribute('aria-describedby', 'date-instructions');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-haspopup', 'dialog');
    input.setAttribute('role', 'combobox');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('aria-controls', calendarId);

    this.addInstructions(input, instance);
    this.addKeyboardHandlers(input, instance);
  }

  /**
   * Add instructions for screen readers
   */
  private addInstructions(input: HTMLInputElement, instance: FlatpickrInstance): void {
    if (!document.getElementById('date-instructions')) {
      const instructions = document.createElement('div');
      instructions.id = 'date-instructions';
      instructions.className = 'sr-only';
      instructions.textContent = t('instructions', instance);
      instructions.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      input.parentNode?.insertBefore(instructions, input.nextSibling);
    }
  }

  /**
   * Add keyboard event handlers to input
   */
  private addKeyboardHandlers(input: HTMLInputElement, instance: FlatpickrInstance): void {
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        instance.open();
      }
    });
  }
}
