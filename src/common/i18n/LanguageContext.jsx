import { createContext, useContext, useEffect, useState } from 'react';
import {
  getBrowserLanguages,
  findBestLanguageMatch,
  getFallbackLanguage
} from '../utils/language-utils';

// Versione corrente del formato localStorage
const LANGUAGE_VERSION = 1;

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
        let hasValidVersion = false;

        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            // Check if the saved preference has the version field
            hasValidVersion = parsed.version === LANGUAGE_VERSION;

            // Only use saved preference if it has the correct version
            if (hasValidVersion) {
              preferredLang = data.data.find(l => l.acronym === parsed.acronym);
            }
          } catch {
            console.warn("Invalid preferred_lang in localStorage:", saved);
            localStorage.removeItem("preferred_lang");
          }
        }

        // If no valid versioned preference, use browser detection
        if (!preferredLang) {
          // Try browser language detection
          const browserLanguages = getBrowserLanguages();
          preferredLang = findBestLanguageMatch(data.data, browserLanguages);

          // Fallback to "en" or first available
          if (!preferredLang) {
            preferredLang = getFallbackLanguage(data.data);
          }
        }

        if (preferredLang) {
          setCurrentLanguage(preferredLang);
          // Save with version field
          localStorage.setItem("preferred_lang", JSON.stringify({
            ...preferredLang,
            version: LANGUAGE_VERSION
          }));
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
    // Save with version field
    localStorage.setItem("preferred_lang", JSON.stringify({
      ...lang,
      version: LANGUAGE_VERSION
    }));
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
