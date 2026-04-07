import { useState, useEffect } from 'react';
import { getGames } from '../data/games';
import { useLanguage } from '../i18n/LanguageContext';
import GameCard from '../components/GameCard';
import './HomePage.css';

function HomePage() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const games = getGames(t);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowDownloadBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setShowDownloadBtn(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleDownloadClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowDownloadBtn(false);
    }
  };

  return (
    <div className="home-page">
      {showDownloadBtn && (
        <button className="home-download-btn" onClick={handleDownloadClick}>
          📲 {t('home.download')}
        </button>
      )}
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
