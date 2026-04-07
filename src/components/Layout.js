import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './Layout.css';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { lang, setLang, t } = useLanguage();

  const toggleLang = () => {
    setLang(lang === 'he' ? 'en' : 'he');
  };

  const getLayoutClass = () => {
    if (location.pathname === '/games/arithmetic') {
      return 'layout layout-arithmetic';
    }
    return 'layout';
  };

  return (
    <div className={getLayoutClass()}>
      <header className={`layout-header ${location.pathname === '/games/arithmetic' ? 'layout-header-arithmetic' : ''}`}>
        {!isHome && (
          <button className={`home-button ${location.pathname === '/games/arithmetic' ? 'home-button-arithmetic' : ''}`} onClick={() => navigate('/')}>
            <span className="home-icon">🏠</span>
            <span className="home-label">{t('nav.home')}</span>
          </button>
        )}
        <h1 className={`app-title ${location.pathname === '/games/arithmetic' ? 'app-title-arithmetic' : ''}`}>{t('app.title')}</h1>
        <button className={`lang-toggle-btn ${location.pathname === '/games/arithmetic' ? 'lang-toggle-btn-arithmetic' : ''}`} onClick={toggleLang}>
          {lang === 'he' ? 'EN' : 'עב'}
        </button>
      </header>
      <main className={`layout-content ${location.pathname === '/games/arithmetic' ? 'layout-content-arithmetic' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
