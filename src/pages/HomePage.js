import { getGames } from '../data/games';
import { useLanguage } from '../i18n/LanguageContext';
import GameCard from '../components/GameCard';
import './HomePage.css';

function HomePage() {
  const { t } = useLanguage();
  const games = getGames(t);

  return (
    <div className="home-page">
      <h2 className="home-greeting">{t('home.greeting')}</h2>
      <div className="games-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
