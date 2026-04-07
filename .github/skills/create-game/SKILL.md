---
name: create-game
description: "Create a new educational game following the project standards. Use when: adding a new game to the kids-games project. Generates component with 10 rounds, multiple choice, best score tracking, confetti, sounds, i18n support, and documentation."
---

# Create a New Educational Game

## Overview
This skill guides the creation of a new educational game following the established patterns in the kids-games project. All games follow the same architecture: 10 rounds, 4 multiple-choice options, score tracking, internationalization support, and celebration animations.

## Prerequisites
- Understand the game mechanics you want to implement
- Decide on difficulty levels (optional, but common)
- Have game content ready (emojis, words, numbers, etc.)

## Step 1: Define Game Specifications

Before coding, clarify:
- **Game ID**: kebab-case identifier (e.g., `shape-matching`, `alphabet-game`)
- **Game Name**: Translatable display name
- **Mechanics**: What question is asked and what answers are provided?
- **Content**: What data drives the game? (animals, numbers, letters, shapes, etc.)
- **Difficulty**: Does the game have easy/medium/hard variants? What differs per level?
- **Win Condition**: How does the player win? (10/10 correct, all pairs matched, etc.)

## Step 2: Create Component File
**File**: `src/games/[game-id]/[GameName].js`

### Template Structure
```javascript
import { useState, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../i18n/LanguageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { playCheer, playSuccess } from '../../hooks/useSound';
import './[GameName].css';

const TOTAL_ROUNDS = 10;

// Game data (constants, shuffle function, generation functions)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound(usedCombos) {
  // Generate unique question with 4 multiple-choice options
  // Return: { question, options: [{value, correct}] }
}

function generateAllRounds() {
  const used = new Set();
  return Array.from({ length: TOTAL_ROUNDS }, () => generateRound(used));
}

// Main component
function [GameName]() {
  const { lang, t } = useLanguage();
  const [bestScore, setBestScore] = useLocalStorage('[game-id]-best-score', null);
  
  // Session state
  const [rounds, setRounds] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startGame = useCallback(() => {
    setRounds(generateAllRounds());
    setCurrentRound(0);
    setSelected(null);
    setTotalMistakes(0);
    setShowCorrect(false);
    setGameOver(false);
  }, [lang]); // Add lang if questions are language-dependent

  const round = rounds ? rounds[currentRound] : null;

  const handleAnswer = (answer) => {
    if (showCorrect) return; // Prevent double-clicking

    if (answer.correct) {
      setSelected(answer);
      setShowCorrect(true);
      playSuccess();

      setTimeout(() => {
        if (currentRound + 1 >= TOTAL_ROUNDS) {
          setGameOver(true);
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          setTimeout(() => 
            confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } }), 
            300
          );
          playCheer();
          
          // Update best score
          if (!bestScore || totalMistakes < bestScore) {
            setBestScore(totalMistakes);
          }
        } else {
          setCurrentRound(currentRound + 1);
          setSelected(null);
          setShowCorrect(false);
        }
      }, 800);
    } else {
      setSelected(answer);
      setTotalMistakes(totalMistakes + 1);
      // Show mistake but don't advance - let player try again
    }
  };

  if (!rounds) {
    return (
      <div className="game-container">
        <button className="start-btn" onClick={startGame}>
          {t('game.start')}
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="game-container">
        <h2>{t('game.gameOver')}</h2>
        <p>{t('game.mistakes')}: {totalMistakes}</p>
        {bestScore !== null && <p>{t('game.best')}: {bestScore}</p>}
        <button className="restart-btn" onClick={startGame}>
          {t('game.restart')}
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <span>{t('game.round')} {currentRound + 1}/10</span>
        <span>{t('game.mistakes')}: {totalMistakes}</span>
      </div>

      <div className="game-content">
        {/* Display question based on round data */}
        {/* Example: */}
        <div className="question">{round.question}</div>
      </div>

      <div className="options">
        {round.options.map((option, idx) => (
          <button
            key={idx}
            className={`option-btn ${
              selected === option ? (option.correct ? 'correct' : 'wrong') : ''
            } ${showCorrect && option.correct ? 'show-correct' : ''}`}
            onClick={() => handleAnswer(option)}
            disabled={showCorrect}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default [GameName];
```

## Step 3: Create Stylesheet
**File**: `src/games/[game-id]/[GameName].css`

```css
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.game-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  margin-bottom: 30px;
  font-size: 18px;
  color: white;
  font-weight: bold;
}

.game-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 30px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.question {
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  max-width: 600px;
  width: 100%;
}

.option-btn {
  padding: 15px 20px;
  font-size: 16px;
  border: 2px solid #667eea;
  border-radius: 8px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.option-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.option-btn:disabled {
  cursor: not-allowed;
}

.option-btn.correct {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.option-btn.wrong {
  background: #f44336;
  color: white;
  border-color: #f44336;
}

.start-btn,
.restart-btn {
  padding: 15px 40px;
  font-size: 18px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.start-btn:hover,
.restart-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
  .options {
    grid-template-columns: 1fr 1fr;
  }

  .game-content {
    padding: 20px;
  }

  .question {
    font-size: 20px;
  }
}
```

## Step 4: Register the Game
**File**: `src/data/games.js` - Add entry to gameDefinitions:
```javascript
{ 
  id: 'game-id', 
  nameKey: 'game.gameName',
  emoji: '🎮',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  path: '/games/game-id'
}
```

## Step 5: Add Routing
**File**: `src/App.js` - Add route to Routes:
```javascript
<Route path="games/game-id" element={<GameComponent />} />
```

## Step 6: Add Translations
**File**: `src/i18n/translations.js` - Add to both `he` and `en` dictionaries:
```javascript
// Game names
'game.gameName': 'English Name / שם בעברית',

// Game UI
'game.start': 'Start / התחל',
'game.round': 'Round / סבב',
'game.mistakes': 'Mistakes / טעויות',
'game.best': 'Best / שיא',
'game.gameOver': 'Game Over! / המשחק הסתיים!',
'game.restart': 'Play Again / שחק שוב',
```

## Step 7: Create Documentation
**File**: `src/games/[game-id]/README.md`

Document:
- Game overview and learning objective
- Game mechanics and rules
- State management details
- Key functions and their purpose
- Data source (what content is used)
- Dependencies (hooks, libraries)
- User flow through the game

See existing README files for examples: `src/games/memory/README.md`, `src/games/counting/README.md`

## Step 8: Test the Game
- [ ] Game starts and displays 10 rounds
- [ ] All answer options are present and correct answer is included
- [ ] Correct answers trigger success sound and visual feedback
- [ ] Best score saves to localStorage
- [ ] Best score updates only when beaten
- [ ] Game completion shows confetti and cheer sound
- [ ] Language toggle works
- [ ] RTL/LTR display correct for both languages
- [ ] Mobile responsive layout

## Step 9: Commit and Document
```bash
git add src/games/[game-id]/ src/data/games.js src/App.js src/i18n/translations.js
git commit -m "feat: add [game name] game"
git push
```

## Code Patterns Reference

### Handling Difficulty Levels (Optional)
```javascript
const DIFFICULTY_KEYS = {
  easy: { pairs: 4, cols: 4, label: 'memory.easy' },
  medium: { pairs: 6, cols: 4, label: 'memory.medium' },
  hard: { pairs: 8, cols: 4, label: 'memory.hard' },
};

// Track best score per difficulty
const [bestScores, setBestScores] = useLocalStorage('[game-id]-best-scores', {});

// Update best score
if (!bestScores[difficulty] || moves < bestScores[difficulty]) {
  setBestScores({ ...bestScores, [difficulty]: moves });
}
```

### Generating Unique Questions
```javascript
function generateRound(usedCombos) {
  let combo;
  do {
    // Generate random combination
    combo = `${item}-${count}`; // Or whatever uniqueness key
  } while (usedCombos.has(combo)); // Prevent duplicates
  
  usedCombos.add(combo);
  return { /* round data */ };
}
```

### Debouncing Clicks
```javascript
const handleAnswer = (answer) => {
  if (showCorrect) return; // Already answered, prevent clicking again
  // ... handle answer
};
```

## Common Mistakes to Avoid
- ❌ Not pre-generating all 10 rounds (generates them on-the-fly)
- ❌ Allowing duplicate questions within a session
- ❌ Not using localStorage for best scores
- ❌ Hardcoded text instead of using `t()` for translations
- ❌ Missing confetti or sounds on game completion
- ❌ Not handling language changes if questions contain language-specific content
- ❌ Forgetting to update best score only when beaten
- ❌ Missing CSS file or unresponsive design
