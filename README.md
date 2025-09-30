# Accessible Flatpickr

[![npm version](https://badge.fury.io/js/accessible-flatpickr.svg)](https://badge.fury.io/js/accessible-flatpickr)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive accessibility enhancement for Flatpickr that provides WCAG-compliant keyboard navigation, screen reader support, and proper ARIA attributes.

## Features

- **Full Keyboard Navigation**: Arrow keys, Home/End, Page Up/Down, Enter/Space, Escape
- **Screen Reader Support**: Live announcements for all interactions
- **ARIA Compliance**: Proper roles, labels, and states
- **Multi-language Support**: English, Polish, Danish, Swedish, Norwegian
- **Extensible Locale System**: Easy to add new languages
- **TypeScript Support**: Full type safety
- **Modular Architecture**: Easy to extend and customize

## Quick Start

### CDN Usage

```html
<!-- Include Flatpickr -->
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>

<!-- Include Accessible Flatpickr -->
<script src="https://cdn.jsdelivr.net/npm/accessible-flatpickr"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"> 

<!-- Use normally - it will be automatically enhanced -->
<input type="text" id="my-date" placeholder="Select date">

<script>
    flatpickr('#my-date', {
        dateFormat: 'Y-m-d'
    });
</script>
```

### Enhanced Initialization

```html
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="https://cdn.jsdelivr.net/npm/accessible-flatpickr"></script>

<input type="text" id="my-date" placeholder="Select date">

<script>
    // Use the enhanced initialization function
    const fp = window.initAccessibleFlatpickr('#my-date', {
        dateFormat: 'Y-m-d'
    });
</script>
```

### Language Support

```javascript
// Set language globally
window.accessibleFlatpickrLanguage = 'PL';

// Or detect from Flatpickr locale
flatpickr('#date', {
    locale: 'pl',
    dateFormat: 'Y-m-d'
});
```

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd accessible-flatpickr

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000/demo/index.html
```

### Build

```bash
# Build for production
npm run build

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Test coverage
npm run test:coverage
```

### Project Structure

```
src/
├── types/              # TypeScript type definitions
├── locales/            # Language/locale files
├── core/               # Core functionality
│   ├── language.ts     # Language management
│   ├── focus.ts        # Focus management
│   ├── click-outside.ts # Click outside handler
│   └── keyboard-navigation.ts # Keyboard navigation
├── enhancements/       # UI enhancements
│   ├── accessibility.ts # Main enhancer
│   ├── input.ts        # Input field enhancements
│   ├── calendar.ts     # Calendar enhancements
│   └── navigation.ts   # Navigation button enhancements
├── utils/              # Utility functions
│   ├── announcements.ts # Screen reader announcements
│   ├── date.ts         # Date formatting
│   └── dom.ts          # DOM utilities
└── index.ts            # Main entry point
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| **Arrow Keys** | Navigate between dates |
| **Home** | Jump to first day of month |
| **End** | Jump to last day of month |
| **Page Up/Down** | Navigate between months |
| **Shift + Page Up/Down** | Navigate between years |
| **Enter/Space** | Select date |
| **Escape** | Close calendar |
| **Tab** | Navigate between form elements |

## Screen Reader Support

The library provides comprehensive screen reader support:

- **Calendar state announcements**: "Calendar opened", "Calendar closed"
- **Date selection announcements**: "Date selected: [formatted date]"
- **Date descriptions**: Include month, year, and context (today, previous/next month)
- **Navigation instructions**: Provided via aria-describedby

## ARIA Implementation

- **Input field**: `role="combobox"`, `aria-expanded`, `aria-haspopup="dialog"`
- **Calendar**: `role="dialog"`, `aria-label`
- **Date buttons**: `role="button"`, `aria-label`, `aria-pressed`
- **Navigation buttons**: `role="button"`, `aria-label`, `tabindex="0"`

## Localization

### Built-in Languages

- English (EN)
- Polish (PL)
- Danish (DA)
- Swedish (SV)
- Norwegian (NO)

### Adding Custom Languages

```typescript
import { registerLocale } from 'accessible-flatpickr';

registerLocale('FR', {
  calendarOpened: "Calendrier ouvert",
  calendarClosed: "Calendrier fermé",
  dateSelected: "Date sélectionnée :",
  today: " (aujourd'hui)",
  previousMonth: " (mois précédent)",
  nextMonth: " (mois suivant)",
  selectDate: "Sélectionner une date",
  instructions: "Utilisez les touches de direction pour naviguer dans le calendrier. Entrée sélectionne la date, Échap ferme. Page Up/Down change le mois.",
  dateSelection: "Sélection de date",
  monthlyCalendar: "Calendrier mensuel",
  previousMonthButton: "Mois précédent",
  nextMonthButton: "Mois suivant"
});
```

## TypeScript Support

The library is written in TypeScript and provides full type definitions:

```typescript
import type { FlatpickrInstance, AccessibleFlatpickrOptions } from 'accessible-flatpickr';

const options: AccessibleFlatpickrOptions = {
  onReady: (selectedDates, dateStr, instance) => {
    // Type-safe callback
  },
  onOpen: (selectedDates, dateStr, instance) => {
    // instance is properly typed
  }
};

const fp = initAccessibleFlatpickr('#date', options);
```

## Testing

The project includes comprehensive unit tests:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Adding New Locales

1. Create a new file in `src/locales/` (e.g., `fr.ts`)
2. Export the locale object with all required keys
3. Add the language code to the `SupportedLanguage` type
4. Update the locale index file if needed

### Architecture

The library follows a modular architecture:

- **Core modules**: Handle fundamental functionality (language, focus, keyboard navigation)
- **Enhancement modules**: Apply accessibility features to UI elements
- **Utility modules**: Provide helper functions
- **Type definitions**: Ensure type safety throughout

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Flatpickr](https://flatpickr.js.org/) - The base date picker library
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility standards
