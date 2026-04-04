import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import translations from './translations';

const LanguageContext = createContext();

function getInitialLang() {
  try {
    const stored = localStorage.getItem('app-language');
    if (stored === 'en' || stored === 'he') return stored;
  } catch (e) {
    // localStorage may be unavailable
  }
  return 'he';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('app-language', newLang);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key) => {
      const dict = translations[lang];
      if (dict && dict[key] !== undefined) return dict[key];
      // Fallback to English, then to the key itself
      const fallback = translations.en;
      if (fallback && fallback[key] !== undefined) return fallback[key];
      return key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
