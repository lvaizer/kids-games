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

  return (
    <div className="layout">
      <header className="layout-header">
        {!isHome && (
          <button className="home-button" onClick={() => navigate('/')}>
            <span className="home-icon">🏠</span>
            <span className="home-label">{t('nav.home')}</span>
          </button>
        )}
        <h1 className="app-title">{t('app.title')}</h1>
        <button className="lang-toggle-btn" onClick={toggleLang}>
          {lang === 'he' ? 'EN' : 'עב'}
        </button>
      </header>
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
