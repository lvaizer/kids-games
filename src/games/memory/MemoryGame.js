import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useLanguage } from '../../i18n/LanguageContext';
import { wonMessage } from '../../i18n/translations';
import { playCheer } from '../../hooks/useSound';
import './MemoryGame.css';

const ANIMALS = [
  { emoji: '🐶', nameKey: 'Dog' },
  { emoji: '🐱', nameKey: 'Cat' },
  { emoji: '🐰', nameKey: 'Rabbit' },
  { emoji: '🦊', nameKey: 'Fox' },
  { emoji: '🐻', nameKey: 'Bear' },
  { emoji: '🐼', nameKey: 'Panda' },
  { emoji: '🦁', nameKey: 'Lion' },
  { emoji: '🐸', nameKey: 'Frog' },
  { emoji: '🐵', nameKey: 'Monkey' },
  { emoji: '🦄', nameKey: 'Unicorn' },
  { emoji: '🐧', nameKey: 'Penguin' },
  { emoji: '🦋', nameKey: 'Butterfly' },
];

const DIFFICULTY_KEYS = {
  easy: { pairs: 4, cols: 4, labelKey: 'memory.easy' },
  medium: { pairs: 6, cols: 4, labelKey: 'memory.medium' },
  hard: { pairs: 8, cols: 4, labelKey: 'memory.hard' },
};

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createCards(pairCount) {
  const selected = shuffle(ANIMALS).slice(0, pairCount);
  const cards = selected.flatMap((animal, i) => [
    { id: i * 2, animal, matched: false },
    { id: i * 2 + 1, animal, matched: false },
  ]);
  return shuffle(cards);
}

function MemoryGame() {
  const { lang, t } = useLanguage();
  const [bestScores, setBestScores] = useLocalStorage('memory-best-scores', {});
  const [difficulty, setDifficulty] = useState(null);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const totalPairs = difficulty ? DIFFICULTY_KEYS[difficulty].pairs : 0;

  const startGame = useCallback((diff) => {
    setDifficulty(diff);
    setCards(createCards(DIFFICULTY_KEYS[diff].pairs));
    setFlipped([]);
    setMoves(0);
    setMatchedCount(0);
    setLocked(false);
    setGameWon(false);
  }, []);

  useEffect(() => {
    if (matchedCount > 0 && matchedCount === totalPairs) {
      setGameWon(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } }), 300);
      playCheer();
      const prev = bestScores[difficulty];
      if (!prev || moves < prev) {
        setBestScores({ ...bestScores, [difficulty]: moves });
      }
    }
  }, [matchedCount, totalPairs, difficulty, moves, bestScores, setBestScores]);

  const handleCardClick = (card) => {
    if (locked || card.matched || flipped.includes(card.id)) return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);

      if (first.animal.nameKey === second.animal.nameKey) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
          )
        );
        setMatchedCount((m) => m + 1);
        setFlipped([]);
      } else {
        setLocked(true);
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 800);
      }
    }
  };

  // Difficulty selection screen
  if (!difficulty) {
    return (
      <div className="memory-game">
        <h2>{t('memory.title')}</h2>
        <p className="memory-subtitle">{t('memory.subtitle')}</p>
        <div className="difficulty-select">
          {Object.entries(DIFFICULTY_KEYS).map(([key, { labelKey, pairs }]) => (
            <button key={key} className={`diff-btn diff-${key}`} onClick={() => startGame(key)}>
              <span className="diff-label">{t(labelKey)}</span>
              <span className="diff-info">{pairs} {t('memory.pairs')}</span>
              {bestScores[key] && (
                <span className="diff-best">{t('memory.best')}: {bestScores[key]} {t('memory.moves')}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Game board
  return (
    <div className="memory-game">
      <div className="memory-header">
        <div className="memory-stat">
          <span className="stat-label">{t('memory.movesLabel')}</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="memory-stat">
          <span className="stat-label">{t('memory.matched')}</span>
          <span className="stat-value">{matchedCount}/{totalPairs}</span>
        </div>
        <button className="restart-btn" onClick={() => setDifficulty(null)}>
          {t('memory.changeLevel')}
        </button>
        <button className="restart-btn" onClick={() => startGame(difficulty)}>
          {t('memory.restart')}
        </button>
      </div>

      {gameWon && (
        <div className="win-banner">
          <span className="win-text">{wonMessage(lang, moves)}</span>
          {bestScores[difficulty] === moves && <span className="new-record">{t('memory.newRecord')}</span>}
          <button className="play-again-btn" onClick={() => startGame(difficulty)}>
            {t('memory.playAgain')}
          </button>
        </div>
      )}

      <div className={`memory-board cols-${DIFFICULTY_KEYS[difficulty].cols}`}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || card.matched;
          return (
            <button
              key={card.id}
              className={`memory-card ${isFlipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
              onClick={() => handleCardClick(card)}
              disabled={card.matched}
            >
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">
                  <span className="card-emoji">{card.animal.emoji}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MemoryGame;
