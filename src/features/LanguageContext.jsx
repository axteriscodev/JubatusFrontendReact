import { createContext, useContext, useEffect, useState } from 'react';
import {
  getBrowserLanguages,
  findBestLanguageMatch,
  getFallbackLanguage
} from '../utils/language-utils';

// Lingua di default
const defaultLanguage = {
  id: "",
  acronym: "it",
  language: "Italiano",
};

const LanguageContext = createContext({
  currentLanguage: defaultLanguage,
  setLanguage: () => {},
  availableLanguages: [],
  loadingLanguages: false,
});

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      setLoadingLanguages(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/translation/language`
        );

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setAvailableLanguages(data.data);

        const saved = localStorage.getItem("preferred_lang");
        let preferredLang;

        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            preferredLang = data.data.find(l => l.acronym === parsed.acronym);
          } catch {
            console.warn("Invalid preferred_lang in localStorage:", saved);
            localStorage.removeItem("preferred_lang");
          }
        }

        if (!preferredLang) {
          // Try browser language detection
          const browserLanguages = getBrowserLanguages();
          preferredLang = findBestLanguageMatch(data.data, browserLanguages);

          // Fallback to "it" or first available
          if (!preferredLang) {
            preferredLang = getFallbackLanguage(data.data);
          }
        }

        if (preferredLang) {
          setCurrentLanguage(preferredLang);
          localStorage.setItem("preferred_lang", JSON.stringify(preferredLang));
        }
      } catch (error) {
        console.error("Errore durante il fetch delle lingue:", error);
        setAvailableLanguages([]);
      } finally {
        setLoadingLanguages(false);
      }
    };

    fetchLanguages();
  }, []);

  const setLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem("preferred_lang", JSON.stringify(lang));
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage: currentLanguage ?? defaultLanguage,
        setLanguage,
        availableLanguages,
        loadingLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
