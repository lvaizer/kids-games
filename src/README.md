# Kids Games Application

## Application Overview

A React-based educational game platform for children featuring multiple learning games with full internationalization support (English and Hebrew). The app provides a user-friendly interface for selecting and playing different educational games targeting various learning skills.

## Architecture

### Technology Stack
- **Framework**: React 19.2.4 with React Router 7.14.0
- **State Management**: React Context API (no Redux)
- **Styling**: CSS files (CSS Modules alternative not used)
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Key Libraries**:
  - `canvas-confetti`: Celebration animations
  - `react-router-dom`: Client-side routing
  - Testing libraries: React Testing Library

### Core Application Structure

```
App.js (Root component)
├── LanguageProvider (Context wrapper)
└── BrowserRouter
    └── Routes
        ├── "/" → Layout → HomePage
        ├── "/games/memory" → Layout → MemoryGame
        ├── "/games/counting" → Layout → CountingGame
        └── "/games/writing-numbers" → Layout → WritingNumbersGame
```

## Main Components

### Layout Component
**File**: `src/components/Layout.js`

The persistent wrapper for all pages containing:
- **Header** with app title, language toggle button, and conditional home navigation
- **Language Toggle**: Switches between English (en) and Hebrew (he)
- **Home Button**: Appears on game pages to return to game selection
- **Outlet**: React Router outlet for rendering page content

### HomePage Component
**File**: `src/pages/HomePage.js`

The main landing page that:
- Displays greeting message (translated based on language)
- Renders grid of available games using GameCard components
- Fetches game definitions from `data/games.js`

### GameCard Component
**File**: `src/components/GameCard.js`

Reusable card component for each game with:
- Gradient background styling
- Game emoji icon
- Game name (translated)
- Click handler for navigation to game route

## Games

Each game is a fully self-contained React component with its own scoring system, state management, and UI. For detailed information about each game's mechanics and implementation:

- **[Memory Game](src/games/memory/README.md)** - Classic card-matching game with 3 difficulty levels
- **[Counting Game](src/games/counting/README.md)** - Count animal emojis and select the correct number
- **[Writing Numbers Game](src/games/writing-numbers/README.md)** - Spell number words in English or Hebrew

## Internationalization (i18n) System

### LanguageContext
**File**: `src/i18n/LanguageContext.js`

Provides three main pieces of context data:
- `lang`: Current language ('en' or 'he')
- `setLang(newLang)`: Function to change language
- `t(key)`: Translation function to fetch strings

### Features
- **Persistence**: Language preference stored in localStorage
- **Fallback**: If translation missing, falls back to English, then returns key itself
- **Document Direction**: Automatically sets `dir="rtl"` for Hebrew, `dir="ltr"` for English
- **Document Language**: Sets `lang` attribute on html element

### Translations
**File**: `src/i18n/translations.js`

Nested object structure with language-specific strings:
```javascript
translations = {
  he: { 'app.title': 'משחקי ילדים', ... },
  en: { 'app.title': 'Kids Games', ... },
}
```

**Usage**: `const { t } = useLanguage(); t('app.title')`

## State Management & Hooks

### Custom Hooks

**useLanguage()**
- Returns: `{ lang, setLang, t }`
- Throws error if used outside LanguageProvider
- Must be imported from `i18n/LanguageContext`

**useLocalStorage**
- File: `src/hooks/useLocalStorage.js`
- Persists state to browser localStorage
- Used by games to save best scores

**useSound**
- File: `src/hooks/useSound.js`
- Provides audio feedback functions
- Used by games: `playSuccess()`, `playCheer()`

### Game State Pattern
Each game component manages its own state:
- Current round/question state
- User answers and selections
- Score/mistakes tracking
- Game completion status
- Difficulty settings (if applicable)

## Data Flow

1. **User opens app** → Checks localStorage for saved language → Defaults to Hebrew
2. **HomePage loads** → Fetches translated game list from `getGames(t)`
3. **User clicks game card** → Router navigates to game component
4. **Game component loads** → Restores any saved best scores from localStorage
5. **Game session** → Updates state, saves scores to localStorage on completion
6. **User toggles language** → Sets new language, all translations update via context

## File Organization

```
src/
├── components/          # Reusable UI components
│   ├── GameCard.js/css
│   └── Layout.js/css
├── games/               # Game implementations
│   ├── counting/        # Counting Game with README
│   ├── memory/          # Memory Game with README
│   └── writing-numbers/ # Writing Numbers Game with README
├── pages/               # Page components (full screen views)
│   └── HomePage.js/css
├── i18n/                # Internationalization
│   ├── LanguageContext.js
│   └── translations.js
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.js
│   └── useSound.js
├── data/                # Static data definitions
│   └── games.js         # Game registry with configuration
├── App.js               # Root router setup
├── index.js             # React entry point
└── [css files]          # Global and component styling
```

## Development Workflow

### Common Tasks

**Adding a new game**:
1. Create folder under `src/games/[game-name]/`
2. Create component file (e.g., `MyGame.js`) and styles (`MyGame.css`)
3. Create `README.md` explaining game mechanics for agents
4. Register in `src/data/games.js` with id, name key, emoji, gradient, and path
5. Add route in `App.js`
6. Add translations in `src/i18n/translations.js`
7. Use language context and localStorage hooks for state persistence

**Modifying translations**:
1. Edit `src/i18n/translations.js`
2. Add entries for both `he` and `en` objects
3. Use dot notation for nested keys: `'category.key'`

**Adding sounds or visual effects**:
- Import `useSound` from `src/hooks/useSound`
- Import `confetti` from `canvas-confetti`
- See individual game READMEs for implementation examples

## Production Build

Run `npm run build` to generate optimized production build in the `build/` folder (already committed as reference).

## Available Scripts

- `npm start` - Start development server
- `npm build` - Create production build
- `npm test` - Run test suite
