import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../i18n/LanguageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { playCheer, playSuccess } from '../../hooks/useSound';
import './WritingNumbersGame.css';

const NUMBER_WORDS = {
  en: {
    0: 'Zero', 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four',
    5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine',
    10: 'Ten', 11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen',
    15: 'Fifteen', 16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen',
    20: 'Twenty',
  },
  he: {
    0: 'אפס', 1: 'אחת', 2: 'שתיים', 3: 'שלוש', 4: 'ארבע',
    5: 'חמש', 6: 'שש', 7: 'שבע', 8: 'שמונה', 9: 'תשע',
    10: 'עשר', 11: 'אחת עשרה', 12: 'שתים עשרה', 13: 'שלוש עשרה', 14: 'ארבע עשרה',
    15: 'חמש עשרה', 16: 'שש עשרה', 17: 'שבע עשרה', 18: 'שמונה עשרה', 19: 'תשע עשרה',
    20: 'עשרים',
  },
};

const TOTAL_ROUNDS = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound(lang, usedNumbers) {
  const allNumbers = Object.keys(NUMBER_WORDS[lang]).map(Number);
  const available = allNumbers.filter((n) => !usedNumbers.has(n));
  const pool = available.length > 0 ? available : allNumbers;

  const correctNumber = pool[Math.floor(Math.random() * pool.length)];
  usedNumbers.add(correctNumber);

  const wrongOptions = new Set();
  while (wrongOptions.size < 3) {
    const wrong = allNumbers[Math.floor(Math.random() * allNumbers.length)];
    if (wrong !== correctNumber && !wrongOptions.has(wrong)) {
      wrongOptions.add(wrong);
    }
  }

  const options = shuffle([
    { number: correctNumber, word: NUMBER_WORDS[lang][correctNumber], correct: true },
    ...[...wrongOptions].map((n) => ({ number: n, word: NUMBER_WORDS[lang][n], correct: false })),
  ]);

  return { correctNumber, options };
}

function generateAllRounds(lang) {
  const used = new Set();
  return Array.from({ length: TOTAL_ROUNDS }, () => generateRound(lang, used));
}

function WritingNumbersGame() {
  const { lang, t } = useLanguage();
  const [bestScore, setBestScore] = useLocalStorage('writing-numbers-best-score', null);
  const [rounds, setRounds] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [roundMistakes, setRoundMistakes] = useState(0);

  const startGame = useCallback(() => {
    setRounds(generateAllRounds(lang));
    setCurrentRound(0);
    setSelected(null);
    setTotalMistakes(0);
    setShowCorrect(false);
    setGameOver(false);
    setRoundMistakes(0);
  }, [lang]);

  const round = rounds ? rounds[currentRound] : null;

  const handleAnswer = (option) => {
    if (showCorrect) return;

    if (option.correct) {
      setSelected(option);
      setShowCorrect(true);
      playSuccess();

      setTimeout(() => {
        if (currentRound + 1 >= TOTAL_ROUNDS) {
          setGameOver(true);
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } }), 300);
          playCheer();
          if (bestScore === null || totalMistakes < bestScore) {
            setBestScore(totalMistakes);
          }
        } else {
          setCurrentRound((r) => r + 1);
          setSelected(null);
          setShowCorrect(false);
          setRoundMistakes(0);
        }
      }, 1000);
    } else {
      setSelected(option);
      setTotalMistakes((m) => m + 1);
      setRoundMistakes((m) => m + 1);
      setTimeout(() => setSelected(null), 500);
    }
  };

  // Start screen
  if (!rounds) {
    return (
      <div className="writing-numbers-game">
        <h2>{t('writingNumbers.title')}</h2>
        <p className="wn-subtitle">{t('writingNumbers.subtitle')}</p>
        <div className="wn-start-info">
          <p>{t('writingNumbers.roundsInfo')}</p>
          {bestScore !== null && (
            <p className="wn-best">{t('counting.bestScore')}: {bestScore} {t('counting.mistakesWord')}</p>
          )}
        </div>
        <button className="wn-start-btn" onClick={startGame}>
          {t('counting.start')}
        </button>
      </div>
    );
  }

  // Game over
  if (gameOver) {
    return (
      <div className="writing-numbers-game">
        <div className="wn-win">
          <h2>{t('counting.finished')}</h2>
          <p className="wn-score">
            {t('counting.totalMistakes')}: {totalMistakes}
          </p>
          {bestScore === totalMistakes && (
            <span className="new-record-badge">{t('memory.newRecord')}</span>
          )}
          <button className="wn-start-btn" onClick={startGame}>
            {t('memory.playAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="writing-numbers-game">
      <div className="wn-header">
        <div className="wn-stat">
          <span className="stat-label">{t('counting.round')}</span>
          <span className="stat-value">{currentRound + 1}/{TOTAL_ROUNDS}</span>
        </div>
        <div className="wn-stat">
          <span className="stat-label">{t('counting.mistakesLabel')}</span>
          <span className="stat-value">{totalMistakes}</span>
        </div>
      </div>

      <div className="wn-question">
        <span className="wn-big-number">{round.correctNumber}</span>
      </div>

      <div className="wn-options">
        {round.options.map((opt, i) => {
          let cls = 'wn-option';
          if (showCorrect && opt.correct) cls += ' correct';
          else if (selected === opt && !opt.correct) cls += ' wrong';

          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleAnswer(opt)}
              disabled={showCorrect}
            >
              {opt.word}
            </button>
          );
        })}
      </div>

      {roundMistakes > 0 && !showCorrect && (
        <p className="wn-try-again">{t('counting.tryAgain')}</p>
      )}
    </div>
  );
}

export default WritingNumbersGame;
