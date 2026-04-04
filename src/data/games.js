const gameDefinitions = [
  { id: 'memory', nameKey: 'game.memory', emoji: '🧠', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', path: '/games/memory' },
  { id: 'puzzle', nameKey: 'game.puzzle', emoji: '🧩', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', path: '/games/puzzle' },
  { id: 'coloring', nameKey: 'game.coloring', emoji: '🎨', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', path: '/games/coloring' },
  { id: 'math', nameKey: 'game.math', emoji: '🔢', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', path: '/games/math' },
  { id: 'spelling', nameKey: 'game.spelling', emoji: '📝', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', path: '/games/spelling' },
  { id: 'matching', nameKey: 'game.matching', emoji: '🃏', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', path: '/games/matching' },
];

export function getGames(t) {
  return gameDefinitions.map((game) => ({
    ...game,
    name: t(game.nameKey),
  }));
}

export default gameDefinitions;
