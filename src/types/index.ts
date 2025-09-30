// Core types for Accessible Flatpickr

// Extend Window interface to include our global property
declare global {
  interface Window {
    accessibleFlatpickrLanguage?: string;
    flatpickr?: any;
  }
}

export interface LocaleStrings {
  calendarOpened: string;
  calendarClosed: string;
  dateSelected: string;
  today: string;
  previousMonth: string;
  nextMonth: string;
  selectDate: string;
  instructions: string;
  dateSelection: string;
  monthlyCalendar: string;
  previousMonthButton: string;
  nextMonthButton: string;
}

export interface LanguageConfig {
  [key: string]: LocaleStrings;
}

export type SupportedLanguage = 'EN' | 'PL' | 'DA' | 'SV' | 'NO';

export interface FlatpickrInstance {
  calendarContainer: HTMLElement;
  element: HTMLInputElement;
  config: {
    minDate?: Date;
    maxDate?: Date;
  };
  currentYear: number;
  currentMonth: number;
  l10n: {
    months: {
      longhand: string[];
    };
    code: string;
  };
  open: () => void;
  close: () => void;
  jumpToDate: (date: Date, triggerChange?: boolean) => void;
  isOpen: boolean;
}

export interface DayElement extends HTMLElement {
  dateObj: Date;
  classList: DOMTokenList;
  textContent: string;
  getAttribute(attr: string): string | null;
  setAttribute(attr: string, value: string): void;
  removeAttribute(attr: string): void;
  click: () => void;
  focus: () => void;
}

export interface CalendarContainer extends HTMLElement {
  querySelector: (selector: string) => HTMLElement | null;
  querySelectorAll: (selector: string) => NodeListOf<HTMLElement>;
  addEventListener: (type: string, listener: EventListener) => void;
}

export interface AccessibleFlatpickrOptions {
  onReady?: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => void;
  onOpen?: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => void;
  onClose?: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => void;
  onChange?: (selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) => void;
  onDayCreate?: (dObj: Date, dStr: string, fp: FlatpickrInstance, dayElem: DayElement) => void;
}

export interface LanguageManager {
  getCurrentLanguage(instance?: FlatpickrInstance | null): SupportedLanguage;
  detectFlatpickrLocale(instance?: FlatpickrInstance | null): SupportedLanguage | null;
  mapFlatpickrLocaleToLanguage(locale: { code: string }): SupportedLanguage | null;
  getTranslation(key: keyof LocaleStrings, instance?: FlatpickrInstance | null): string;
}

export interface AccessibilityEnhancer {
  enhance(instance: FlatpickrInstance): void;
  enhanceInput(input: HTMLInputElement, instance: FlatpickrInstance): void;
  enhanceCalendar(calendar: CalendarContainer, instance: FlatpickrInstance): void;
  enhanceNavigationButtons(calendar: CalendarContainer, instance: FlatpickrInstance): void;
}

export interface KeyboardNavigationHandler {
  addKeyboardNavigation(instance: FlatpickrInstance): void;
  getAllNavigableDays(calendar: CalendarContainer): DayElement[];
  moveFocusToDay(currentDay: DayElement, targetDay: DayElement): void;
  navigateByDateOffset(instance: FlatpickrInstance, unit: 'month' | 'year', offset: number, activeDay: DayElement): void;
}

export interface FocusManager {
  manageFocusOnOpen(instance: FlatpickrInstance): void;
  returnFocusToInput(instance: FlatpickrInstance): void;
}

export interface ScreenReaderAnnouncer {
  announce(message: string): void;
  setup(): void;
}

export interface ClickOutsideHandler {
  setup(instance: FlatpickrInstance): void;
  remove(instance: FlatpickrInstance): void;
}

export interface DateUtils {
  formatDateForScreenReader(date: Date): string;
}
