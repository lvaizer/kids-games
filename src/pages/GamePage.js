import { useParams } from 'react-router-dom';
import { getGames } from '../data/games';
import { useLanguage } from '../i18n/LanguageContext';
import './GamePage.css';

function GamePage() {
  const { gameId } = useParams();
  const { t } = useLanguage();
  const games = getGames(t);
  const game = games.find((g) => g.id === gameId);

  if (!game) {
    return <div className="game-page"><h2>{t('game.notFound')}</h2></div>;
  }

  return (
    <div className="game-page">
      <h2>{game.name}</h2>
      <p className="coming-soon">{t('game.comingSoon')}</p>
    </div>
  );
}

export default GamePage;
