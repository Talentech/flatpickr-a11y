import type { ScreenReaderAnnouncer } from '../types';

/**
 * Screen reader announcer utility
 */
export class ScreenReaderAnnouncerImpl implements ScreenReaderAnnouncer {
  private liveRegion: HTMLElement | null = null;

  /**
   * Setup live region for screen reader announcements
   */
  public setup(): void {
    if (typeof document === 'undefined') {
      // In test environments or non-browser environments
      return;
    }

    if (!document.getElementById('flatpickr-live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'flatpickr-live-region';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(liveRegion);
      this.liveRegion = liveRegion;
    } else {
      this.liveRegion = document.getElementById('flatpickr-live-region');
    }
  }

  /**
   * Announce message to screen readers
   */
  public announce(message: string): void {
    if (this.liveRegion) {
      this.liveRegion.textContent = '';
      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = message;
        }
      }, 10);
    }
  }
}

// Export singleton instance
export const screenReaderAnnouncer = new ScreenReaderAnnouncerImpl();
