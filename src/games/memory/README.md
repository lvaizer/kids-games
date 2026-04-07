# Memory Game

## Overview
A classic memory/matching game with three difficulty levels. Players flip cards to find matching pairs of animal emojis. The objective is to match all pairs in the fewest number of moves.

## Game Mechanics
- **Difficulty Levels**:
  - Easy: 4 pairs (8 cards total)
  - Medium: 6 pairs (12 cards total)
  - Hard: 8 pairs (16 cards total)
- **Grid Layout**: 4 columns for all difficulty levels (rows auto-calculated)
- **Scoring**: Tracks best score (fewest moves) per difficulty level
- **Movement**: A "move" is counted when 2 cards are flipped for comparison
- **Feedback**: Sound effects and confetti animation on game completion

## Component Structure

### State Management
- `bestScores`: Dictionary of best scores per difficulty (Easy/Medium/Hard) in localStorage
- `difficulty`: Currently selected difficulty level
- `cards`: Array of card objects with id, animal emoji, and match status
- `flipped`: Array of currently flipped card IDs (max 2 at a time)
- `moves`: Counter for total moves made
- `matchedCount`: Number of successfully matched pairs
- `locked`: Boolean preventing clicks while checking match
- `gameWon`: Boolean indicating game completion

### Key Functions
- `createCards(pairCount)`: Generates shuffled card array with animal pairs
- `startGame(difficulty)`: Initializes new game for selected difficulty
- `handleCardClick(card)`: Handles card flip logic and match checking
- Match detection happens automatically when 2 cards are flipped

## Data Source
- Uses 12 unique animal emojis (ANIMALS array)
- Shuffled randomly each game
- Only required number of animals for selected difficulty are used

## Dependencies
- `useLanguage()`: For internationalization support (language and translations)
- `useLocalStorage`: For persisting best scores per difficulty
- `useSound`: For audio feedback (playCheer, playSuccess)
- `canvas-confetti`: For celebration animation

## Styling
- `MemoryGame.css`: Styles for card grid, card flip animation, difficulty selector, and score display

## User Flow
1. Select difficulty level (Easy/Medium/Hard)
2. Cards automatically shuffle
3. Click cards to flip and reveal emojis
4. Match pairs to increase matchedCount
5. Each pair match plays success sound
6. Game ends when all pairs matched
7. Final move count compared to best score
8. Option to restart or try different difficulty
