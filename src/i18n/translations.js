const translations = {
  he: {
    // Layout
    'app.title': 'משחקי ילדים',
    'nav.home': 'בית',

    // HomePage
    'home.greeting': 'בחרו משחק!',

    // GamePage
    'game.notFound': 'המשחק לא נמצא',
    'game.comingSoon': 'בקרוב!',

    // Game names
    'game.memory': 'משחק זיכרון',
    'game.puzzle': 'פאזל',
    'game.coloring': 'צביעה',
    'game.math': 'חידון חשבון',
    'game.spelling': 'איות',
    'game.matching': 'התאמה',

    // Memory game
    'memory.title': 'משחק זיכרון',
    'memory.subtitle': 'התאימו את זוגות החיות!',
    'memory.easy': 'קל',
    'memory.medium': 'בינוני',
    'memory.hard': 'קשה',
    'memory.pairs': 'זוגות',
    'memory.best': 'שיא',
    'memory.moves': 'מהלכים',
    'memory.movesLabel': 'מהלכים',
    'memory.matched': 'התאמות',
    'memory.changeLevel': 'שנה רמה',
    'memory.restart': 'התחל מחדש',
    'memory.newRecord': 'שיא חדש!',
    'memory.playAgain': 'שחקו שוב',

    // Animals
    'animal.Dog': 'כלב',
    'animal.Cat': 'חתול',
    'animal.Rabbit': 'ארנב',
    'animal.Fox': 'שועל',
    'animal.Bear': 'דוב',
    'animal.Panda': 'פנדה',
    'animal.Lion': 'אריה',
    'animal.Frog': 'צפרדע',
    'animal.Monkey': 'קוף',
    'animal.Unicorn': 'חד קרן',
    'animal.Penguin': 'פינגווין',
    'animal.Butterfly': 'פרפר',
  },
  en: {
    // Layout
    'app.title': 'Kids Games',
    'nav.home': 'Home',

    // HomePage
    'home.greeting': 'Choose a Game!',

    // GamePage
    'game.notFound': 'Game not found',
    'game.comingSoon': 'Coming soon!',

    // Game names
    'game.memory': 'Memory Game',
    'game.puzzle': 'Puzzle',
    'game.coloring': 'Coloring',
    'game.math': 'Math Quiz',
    'game.spelling': 'Spelling',
    'game.matching': 'Matching',

    // Memory game
    'memory.title': 'Memory Game',
    'memory.subtitle': 'Match the animal pairs!',
    'memory.easy': 'Easy',
    'memory.medium': 'Medium',
    'memory.hard': 'Hard',
    'memory.pairs': 'pairs',
    'memory.best': 'Best',
    'memory.moves': 'moves',
    'memory.movesLabel': 'Moves',
    'memory.matched': 'Matched',
    'memory.changeLevel': 'Change Level',
    'memory.restart': 'Restart',
    'memory.newRecord': 'New Record!',
    'memory.playAgain': 'Play Again',

    // Animals
    'animal.Dog': 'Dog',
    'animal.Cat': 'Cat',
    'animal.Rabbit': 'Rabbit',
    'animal.Fox': 'Fox',
    'animal.Bear': 'Bear',
    'animal.Panda': 'Panda',
    'animal.Lion': 'Lion',
    'animal.Frog': 'Frog',
    'animal.Monkey': 'Monkey',
    'animal.Unicorn': 'Unicorn',
    'animal.Penguin': 'Penguin',
    'animal.Butterfly': 'Butterfly',
  },
};

export function wonMessage(lang, moves) {
  if (lang === 'he') {
    return `ניצחתם ב-${moves} מהלכים!`;
  }
  return `You won in ${moves} moves!`;
}

export default translations;
