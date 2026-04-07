# Counting Game

## Overview
An educational counting game designed for children to practice counting and number recognition. Players view a collection of animal emojis and select the correct count from multiple choice options.

## Game Mechanics
- **Rounds**: 10 rounds per game
- **Question Format**: Display a random animal emoji repeated N times (1-10)
- **Answer Options**: 4 multiple choice options with the correct count plus 3 wrong answers
- **Scoring**: Tracks best score (fewest mistakes made across all rounds)
- **Feedback**: Sound effects and confetti animation on success

## Component Structure

### State Management
- `bestScore`: User's best score stored in localStorage
- `rounds`: Array of pre-generated round questions
- `currentRound`: Index of current active round (0-9)
- `selected`: Currently selected answer
- `mistakes`: Mistakes in current round
- `totalMistakes`: Cumulative mistakes across all rounds
- `showCorrect`: Whether to display the correct answer
- `gameOver`: Whether the game has concluded

### Key Functions
- `generateRound()`: Creates a single round with question and 4 multiple choice options
- `generateAllRounds()`: Pre-generates all 10 rounds to prevent duplicate combinations
- `handleAnswer()`: Processes answer selection and advances round
- `startGame()`: Initializes a new game session

## Data Source
- Uses 12 animal emojis from ITEMS array
- Numbers range from 1-10
- Question variety: Each combo of (animal, count) is guaranteed unique within a 10-round session

## Dependencies
- `useLanguage()`: For internationalization support
- `useLocalStorage`: For persisting best score
- `useSound`: For audio feedback (playCheer, playSuccess)
- `canvas-confetti`: For celebration animation

## Styling
- `CountingGame.css`: Styles for emoji display, buttons, score display, and game UI

## User Flow
1. Click "Start Game"
2. View animal emojis and select the correct count
3. Get instant feedback on correctness
4. Advance through 10 rounds automatically after delay
5. View final score and best score comparison
6. Option to play again
