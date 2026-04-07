import { useState, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../i18n/LanguageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { playCheer, playSuccess } from '../../hooks/useSound';
import './CountingGame.css';

const ITEMS = [
  { emoji: '🐶', nameKey: 'animal.Dog' },
  { emoji: '🐱', nameKey: 'animal.Cat' },
  { emoji: '🐰', nameKey: 'animal.Rabbit' },
  { emoji: '🦊', nameKey: 'animal.Fox' },
  { emoji: '🐻', nameKey: 'animal.Bear' },
  { emoji: '🦁', nameKey: 'animal.Lion' },
  { emoji: '🐸', nameKey: 'animal.Frog' },
  { emoji: '🐵', nameKey: 'animal.Monkey' },
  { emoji: '🐧', nameKey: 'animal.Penguin' },
  { emoji: '🦋', nameKey: 'animal.Butterfly' },
  { emoji: '🐢', nameKey: 'animal.Turtle' },
  { emoji: '🐙', nameKey: 'animal.Octopus' },
];

const TOTAL_ROUNDS = 10;
const MAX_COUNT = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound(usedCombos) {
  let item, count, key;
  do {
    item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    count = Math.floor(Math.random() * MAX_COUNT) + 1;
    key = `${item.nameKey}-${count}`;
  } while (usedCombos.has(key));
  usedCombos.add(key);

  // Generate 3 wrong answers (unique, different from correct)
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const wrong = Math.floor(Math.random() * MAX_COUNT) + 1;
    if (wrong !== count && !wrongs.has(wrong)) {
      wrongs.add(wrong);
    }
  }

  const options = shuffle([count, ...wrongs]);
  return { item, count, options };
}

function generateAllRounds() {
  const used = new Set();
  return Array.from({ length: TOTAL_ROUNDS }, () => generateRound(used));
}

function CountingGame() {
  const { t } = useLanguage();
  const [bestScore, setBestScore] = useLocalStorage('counting-best-score', null);
  const [rounds, setRounds] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startGame = useCallback(() => {
    setRounds(generateAllRounds());
    setCurrentRound(0);
    setSelected(null);
    setMistakes(0);
    setTotalMistakes(0);
    setShowCorrect(false);
    setGameOver(false);
  }, []);

  const round = rounds ? rounds[currentRound] : null;

  const emojis = useMemo(() => {
    if (!round) return [];
    return Array.from({ length: round.count }, (_, i) => (
      <span key={i} className="counting-emoji">{round.item.emoji}</span>
    ));
  }, [round]);

  const handleAnswer = (answer) => {
    if (showCorrect) return;

    if (answer === round.count) {
      setSelected(answer);
      setShowCorrect(true);
      playSuccess();

      // Move to next round after a delay
      setTimeout(() => {
        if (currentRound + 1 >= TOTAL_ROUNDS) {
          const finalMistakes = totalMistakes;
          setGameOver(true);
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } }), 300);
          playCheer();
          if (bestScore === null || finalMistakes < bestScore) {
            setBestScore(finalMistakes);
          }
        } else {
          setCurrentRound((r) => r + 1);
          setSelected(null);
          setMistakes(0);
          setShowCorrect(false);
        }
      }, 1000);
    } else {
      setSelected(answer);
      setMistakes((m) => m + 1);
      setTotalMistakes((m) => m + 1);
      // Clear wrong selection after a short flash
      setTimeout(() => setSelected(null), 500);
    }
  };

  // Start screen
  if (!rounds) {
    return (
      <div className="counting-game">
        <h2>{t('counting.title')}</h2>
        <p className="counting-subtitle">{t('counting.subtitle')}</p>
        <div className="counting-start-info">
          <p>{t('counting.roundsInfo')}</p>
          {bestScore !== null && (
            <p className="counting-best">{t('counting.bestScore')}: {bestScore} {t('counting.mistakesWord')}</p>
          )}
        </div>
        <button className="counting-start-btn" onClick={startGame}>
          {t('counting.start')}
        </button>
      </div>
    );
  }

  // Game over screen
  if (gameOver) {
    return (
      <div className="counting-game">
        <div className="counting-win">
          <h2>{t('counting.finished')}</h2>
          <p className="counting-score">
            {t('counting.totalMistakes')}: {totalMistakes}
          </p>
          {bestScore === totalMistakes && totalMistakes >= 0 && (
            <span className="new-record-badge">{t('memory.newRecord')}</span>
          )}
          <button className="counting-start-btn" onClick={startGame}>
            {t('memory.playAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="counting-game">
      <div className="counting-header">
        <div className="counting-stat">
          <span className="stat-label">{t('counting.round')}</span>
          <span className="stat-value">{currentRound + 1}/{TOTAL_ROUNDS}</span>
        </div>
        <div className="counting-stat">
          <span className="stat-label">{t('counting.mistakesLabel')}</span>
          <span className="stat-value">{totalMistakes}</span>
        </div>
        <button className="counting-restart-btn" onClick={startGame}>
          {t('memory.restart')}
        </button>
      </div>

      <div className="counting-question">
        <p className="counting-prompt">{t('counting.howMany')}</p>
        <div className="counting-items">
          {emojis}
        </div>
      </div>

      <div className="counting-options">
        {round.options.map((opt) => {
          let cls = 'counting-option';
          if (showCorrect && opt === round.count) cls += ' correct';
          else if (selected === opt && opt !== round.count) cls += ' wrong';

          return (
            <button
              key={opt}
              className={cls}
              onClick={() => handleAnswer(opt)}
              disabled={showCorrect}
            >
              <span className="option-number">{opt}</span>
            </button>
          );
        })}
      </div>

      {mistakes > 0 && !showCorrect && (
        <p className="try-again">{t('counting.tryAgain')}</p>
      )}
    </div>
  );
}

export default CountingGame;
