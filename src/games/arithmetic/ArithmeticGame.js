import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../i18n/LanguageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { playCheer, playSuccess } from '../../hooks/useSound';
import './ArithmeticGame.css';

const DIFFICULTY_LEVELS = {
  easy: { labelKey: 'arithmetic.easy', operationType: 'plus' },
  medium: { labelKey: 'arithmetic.medium', operationType: 'minus' },
  hard: { labelKey: 'arithmetic.hard', operationType: 'mixed' },
};

const TOTAL_ROUNDS = 10;
const EASY_MAX = 10;
const MEDIUM_MAX = 10;
const HARD_MAX = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound(difficulty) {
  let num1, num2, operation, result;
  const operationType = DIFFICULTY_LEVELS[difficulty].operationType;

  if (operationType === 'plus') {
    num1 = Math.floor(Math.random() * EASY_MAX) + 1;
    num2 = Math.floor(Math.random() * EASY_MAX) + 1;
    operation = '+';
    result = num1 + num2;
  } else if (operationType === 'minus') {
    num1 = Math.floor(Math.random() * MEDIUM_MAX) + 5;
    num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
    operation = '-';
    result = num1 - num2;
  } else {
    // mixed
    operation = Math.random() > 0.5 ? '+' : '-';
    if (operation === '+') {
      num1 = Math.floor(Math.random() * HARD_MAX) + 1;
      num2 = Math.floor(Math.random() * HARD_MAX) + 1;
      result = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * HARD_MAX) + 5;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      result = num1 - num2;
    }
  }

  // Generate 3 wrong answers (unique, different from correct)
  const wrongs = new Set();
  while (wrongs.size < 3) {
    let wrong = result + (Math.floor(Math.random() * 7) - 3);
    if (wrong !== result && wrong > 0 && !wrongs.has(wrong)) {
      wrongs.add(wrong);
    }
  }

  const options = shuffle([result, ...wrongs]);
  return { num1, num2, operation, result, options };
}

function generateAllRounds(difficulty) {
  return Array.from({ length: TOTAL_ROUNDS }, () => generateRound(difficulty));
}

function ArithmeticGame() {
  const { t } = useLanguage();
  const [bestScores, setBestScores] = useLocalStorage('arithmetic-best-scores', {});
  const [difficulty, setDifficulty] = useState(null);
  const [rounds, setRounds] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [roundMistakes, setRoundMistakes] = useState(0);

  const startGame = useCallback((diff) => {
    setDifficulty(diff);
    setRounds(generateAllRounds(diff));
    setCurrentRound(0);
    setSelected(null);
    setTotalMistakes(0);
    setShowCorrect(false);
    setGameOver(false);
    setRoundMistakes(0);
  }, []);

  const round = rounds ? rounds[currentRound] : null;

  const handleAnswer = (answer) => {
    if (showCorrect) return;

    if (answer === round.result) {
      setSelected(answer);
      setShowCorrect(true);
      playSuccess();

      setTimeout(() => {
        if (currentRound + 1 >= TOTAL_ROUNDS) {
          setGameOver(true);
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } }), 300);
          playCheer();
          if (!bestScores[difficulty] || totalMistakes < bestScores[difficulty]) {
            setBestScores({ ...bestScores, [difficulty]: totalMistakes });
          }
        } else {
          setCurrentRound((r) => r + 1);
          setSelected(null);
          setShowCorrect(false);
          setRoundMistakes(0);
        }
      }, 1000);
    } else {
      setSelected(answer);
      setTotalMistakes((m) => m + 1);
      setRoundMistakes((m) => m + 1);
      setTimeout(() => setSelected(null), 500);
    }
  };

  // Start screen - select difficulty
  if (!rounds) {
    return (
      <div className="arithmetic-game">
        <h2>{t('arithmetic.title')}</h2>
        <p className="arithmetic-subtitle">{t('arithmetic.subtitle')}</p>
        <div className="arithmetic-levels">
          {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
            <button
              key={key}
              className="arithmetic-level-btn"
              onClick={() => startGame(key)}
            >
              {t(level.labelKey)}
            </button>
          ))}
        </div>
        <div className="arithmetic-info">
          <p>{t('arithmetic.roundsInfo')}</p>
        </div>
      </div>
    );
  }

  // Game over
  if (gameOver) {
    return (
      <div className="arithmetic-game">
        <div className="arithmetic-win">
          <h2>{t('counting.finished')}</h2>
          <p className="arithmetic-score">
            {t('counting.totalMistakes')}: {totalMistakes}
          </p>
          {bestScores[difficulty] === totalMistakes && (
            <span className="new-record-badge">{t('memory.newRecord')}</span>
          )}
          <button
            className="arithmetic-restart-btn"
            onClick={() => startGame(difficulty)}
          >
            {t('memory.playAgain')}
          </button>
          <button
            className="arithmetic-home-btn"
            onClick={() => setDifficulty(null)}
          >
            {t('memory.changeLevel')}
          </button>
        </div>
      </div>
    );
  }

  // Game playing
  return (
    <div className="arithmetic-game">
      <div className="arithmetic-header">
        <div className="arithmetic-progress">
          {t('counting.round')} {currentRound + 1} / {TOTAL_ROUNDS}
        </div>
        <div className="arithmetic-mistakes">
          {t('counting.mistakesLabel')}: {totalMistakes}
        </div>
      </div>

      <div className="arithmetic-question">
        <div className="arithmetic-expression">
          <span className="number">{round.num1}</span>
          <span className="operator">{round.operation}</span>
          <span className="number">{round.num2}</span>
          <span className="equals">=</span>
          <span className="question-mark">?</span>
        </div>
      </div>

      <div className="arithmetic-options">
        {round.options.map((option, index) => (
          <button
            key={index}
            className={`arithmetic-option ${
              selected === option
                ? option === round.result
                  ? 'correct'
                  : 'wrong'
                : ''
            }`}
            onClick={() => handleAnswer(option)}
            disabled={showCorrect}
          >
            {option}
          </button>
        ))}
      </div>

      {roundMistakes > 0 && !showCorrect && (
        <p className="arithmetic-feedback">{t('counting.tryAgain')}</p>
      )}
    </div>
  );
}

export default ArithmeticGame;
