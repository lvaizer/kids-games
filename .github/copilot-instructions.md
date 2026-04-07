# Kids Games - Agent Development Guidelines

## General Game Structure

All games in this project follow a consistent architecture for educational children's games. When creating or modifying any game, adhere to these standards:

## Core Game Requirements

### 1. Game Rounds & Questions
- **Each game has 10 rounds/questions** as the standard game length
- Questions should use variety (no duplicate question combinations within a session)
- Use `generateRound()` and `generateAllRounds()` pattern for pre-generating all rounds to ensure uniqueness

### 2. Question Format
- **Multiple choice**: 4 answer options per question (1 correct + 3 wrong)
- **Difficulty levels** (optional for some games):
  - Easy, Medium, Hard are the standard levels
  - Each level has different parameters (Memory game: pairs, Counting game: number ranges, etc.)
- **Instant feedback**: Show immediately if answer is correct or wrong (not at end of round)

### 3. Scoring & Progress Tracking
- **Best score tracking**: Always persist best score to localStorage using `useLocalStorage` hook
- For games with difficulty levels: track best score **per difficulty level**
- Display current score, best score, and mistakes/moves during gameplay
- Update best score only if current game beats previous best

### 4. User Feedback & Animations
- **Sound effects**:
  - `playSuccess()` - when user answers correctly
  - `playCheer()` - when user wins/completes game
  - Import from `../../hooks/useSound`
- **Confetti animation**:
  - Trigger on game completion/win
  - Import from `'canvas-confetti'`
  - Standard pattern: 150 particles with 80° spread, then 100 particles with 100° spread at 300ms delay
- **Visual feedback**: Show correct answer when wrong, but allow player to see it before moving to next round

### 4.5. Navigation & Control Buttons
**All games must include these control buttons:**

- **"התחל מחדש" (Restart) button** - During gameplay, resets the current game session
  - Located in game header next to stats
  - Styled with orange color (#f39c12) and hover effect
  - Uses `t('memory.restart')` translation key

- **"שנה רמה" (Change Level) button** - For games with difficulty levels only
  - Located in game header next to restart button
  - Returns to difficulty selection screen
  - Styled with blue color and hover effect
  - Uses `t('memory.changeLevel')` translation key

- **"שחק שוב" (Play Again) button** - In game over screen
  - Restarts the same game/difficulty
  - Uses `t('memory.playAgain')` translation key

**Button placement pattern:**
```javascript
<div className="game-header">
  <div className="game-stat">...</div>
  <div className="game-stat">...</div>
  <button className="game-restart-btn" onClick={startGame}>
    {t('memory.restart')}
  </button>
  {hasDifficulty && (
    <button className="game-change-level-btn" onClick={() => setDifficulty(null)}>
      {t('memory.changeLevel')}
    </button>
  )}
</div>
```

### 5. Internationalization
- **Language support**: Use `useLanguage()` hook from `src/i18n/LanguageContext`
- **Translations**:
  - Add game names to `src/i18n/translations.js` for both 'he' and 'en'
  - Use dot notation keys: `'game.myGame'`, `'myGame.title'`, `'myGame.subtitle'`
  - All UI text should use `t('key')` for translation
- **Direction awareness**: App automatically handles RTL for Hebrew and LTR for English

### 6. Component File Structure
```
src/games/[game-name]/
├── [GameName].js       # Main component file
├── [GameName].css      # Styling (must match component name)
└── README.md           # Agent documentation
```

### 7. Documentation (README.md)
Every game must have a README.md that explains:
- Game mechanics and objectives
- State management (what state is stored)
- Key functions and their purpose
- Data sources (what emojis, numbers, etc. are used)
- Dependencies (hooks, libraries)
- User flow through the game

This helps agents understand the game without reading all the code.

### 8. Styling
- **Each game has its own CSS file** with the same name as component
- Include styles for:
  - Question/content display area
  - Answer buttons/options
  - Score display
  - Game over/completion screen
  - Loading/start state
- **Responsive design**: Use flexbox/grid for mobile-friendly layouts

### 9. State Management Pattern
Each game component manages:
```javascript
// Persistent data -> localStorage
const [bestScore, setBestScore] = useLocalStorage('[game-name]-best-score', null);

// Session data -> useState
const [rounds, setRounds] = useState(null);
const [currentRound, setCurrentRound] = useState(0);
const [selected, setSelected] = useState(null);
const [mistakes, setMistakes] = useState(0);
const [showCorrect, setShowCorrect] = useState(false);
const [gameOver, setGameOver] = useState(false);
```

### 10. Game Registration
When adding a new game, register it in these places:

**src/data/games.js**:
```javascript
{ 
  id: 'game-id', 
  nameKey: 'game.gameName',  // Add to translations
  emoji: '🎮',
  gradient: 'linear-gradient(135deg, #color1 0%, #color2 100%)',
  path: '/games/game-id'
}
```

**src/App.js** - Add route:
```javascript
<Route path="games/game-id" element={<GameComponent />} />
```

**src/i18n/translations.js** - Add translations for both Hebrew and English

## Component Imports
Standard imports for most games:
```javascript
import { useState, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../i18n/LanguageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { playCheer, playSuccess } from '../../hooks/useSound';
```

## Testing Checklist for New Games
- [ ] Game starts properly and loads 10 rounds
- [ ] All 4 answer options are unique and correct one is included
- [ ] Correct answers trigger success sound and visual feedback
- [ ] Incorrect answers don't advance round (allow retry or show wrong)
- [ ] Game tracks mistakes/moves correctly
- [ ] Best score saves to localStorage
- [ ] Best score updates only when beaten
- [ ] Game completion shows confetti and cheer sound
- [ ] **"התחל מחדש" button works during gameplay**
- [ ] **"שנה רמה" button exists for games with difficulty levels**
- [ ] **"שחק שוב" button works in game over screen**
- [ ] Language toggle works (if translations needed)
- [ ] RTL/LTR display works correctly
- [ ] README.md documents the game clearly
- [ ] CSS is responsive and matches component styling

## Key Hooks Available
- `useLanguage()` - Get/set current language, translation function
- `useLocalStorage(key, defaultValue)` - Persist state to localStorage
- `useSound()` - Access playCheer() and playSuccess() functions

## Performance Considerations
- Pre-generate all 10 rounds at game start (don't generate round-by-round)
- Use `useMemo` for expensive calculations (e.g., rendering many emojis)
- Store used combinations in Sets for O(1) duplicate detection
- Debounce rapid clicks with state flags (e.g., `showCorrect` prevents double-clicks)
