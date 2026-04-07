# Writing Numbers Game

## Overview
A language-learning game focused on number spelling. Players view a number and select the correct word spelling from multiple choice options. Supports English and Hebrew with number words (0-20).

## Game Mechanics
- **Rounds**: 10 rounds per game
- **Question Format**: Display a number (0-20) and ask to identify its word spelling
- **Answer Options**: 4 multiple choice buttons with the correct spelling plus 3 wrong options
- **Languages**: Two language dictionaries (English and Hebrew)
- **Scoring**: Tracks best score (fewest mistakes) for the game
- **Feedback**: Sound effects and confetti animation on success

## Component Structure

### State Management
- `bestScore`: User's best score stored in localStorage
- `rounds`: Array of pre-generated round questions with correct number and options
- `currentRound`: Index of current active round (0-9)
- `selected`: Currently selected answer option
- `totalMistakes`: Cumulative mistakes across all rounds
- `showCorrect`: Whether to display the correct answer
- `gameOver`: Whether the game has concluded
- `roundMistakes`: Mistakes in current round

### Key Functions
- `generateRound(lang, usedNumbers)`: Creates a single round with question in target language
- `generateAllRounds(lang)`: Pre-generates all 10 rounds preventing duplicate numbers
- `handleAnswer(option)`: Processes answer selection and advances round
- `startGame()`: Initializes a new game session in current language

## Data Source
- **NUMBER_WORDS**: Language-specific dictionaries
  - English: "Zero", "One", "Two", etc.
  - Hebrew: "אפס", "אחת", "שתיים", etc.
- **Range**: Numbers 0-20 in each language
- **Strategy**: Numbers are selected without replacement within a 10-round session, cycling through available pool if needed

## Dependencies
- `useLanguage()`: For current language and translations (both affect round generation and UI)
- `useLocalStorage`: For persisting best score
- `useSound`: For audio feedback (playCheer, playSuccess)
- `canvas-confetti`: For celebration animation

## Language Support
The game reads the current language from `useLanguage()` context and regenerates all rounds when language changes. This ensures:
- Questions are in the currently selected language
- Invalid answer options are also in the correct language
- Best score is global (not language-specific)

## Styling
- `WritingNumbersGame.css`: Styles for number display, option buttons, score display, and game UI

## User Flow
1. Click "Start Game"
2. View a number and read its word form in current language
3. Select the correct spelling from 4 options
4. Get instant feedback on correctness
5. Advance through 10 rounds automatically after delay
6. View final score and best score comparison
7. Option to play again (regenerates in current language)
