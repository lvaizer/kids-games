const gameDefinitions = [
  { id: 'memory', nameKey: 'game.memory', emoji: '🧠', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', path: '/games/memory' },
  { id: 'counting', nameKey: 'game.counting', emoji: '🔢', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', path: '/games/counting' },
  { id: 'writing-numbers', nameKey: 'game.writingNumbers', emoji: '✍️', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', path: '/games/writing-numbers' },
  { id: 'arithmetic', nameKey: 'game.arithmetic', emoji: '➕➖', gradient: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)', path: '/games/arithmetic' },
];

export function getGames(t) {
  return gameDefinitions.map((game) => ({
    ...game,
    name: t(game.nameKey),
  }));
}

export default gameDefinitions;
