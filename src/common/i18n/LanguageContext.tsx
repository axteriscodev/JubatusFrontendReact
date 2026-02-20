import { createContext, useContext, useEffect, useState } from 'react';
import type { Language, LanguageContextValue, StoredLanguage } from '@/types/i18n';
import type { ApiResponse } from '@/types/api';
import {
  getBrowserLanguages,
  findBestLanguageMatch,
  getFallbackLanguage
} from '../utils/language-utils';

// Versione corrente del formato localStorage
const LANGUAGE_VERSION = 1;

// Lingua di default
const defaultLanguage: Language = {
  id: "",
  acronym: "it",
  language: "Italiano",
};

const LanguageContext = createContext<LanguageContextValue>({
  currentLanguage: defaultLanguage,
  setLanguage: () => undefined,
  availableLanguages: [],
  loadingLanguages: false,
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
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

        const data = await response.json() as ApiResponse<Language[]>;
        setAvailableLanguages(data.data);

        const saved = localStorage.getItem("preferred_lang");
        let preferredLang: Language | null | undefined;
        let hasValidVersion = false;

        if (saved) {
          try {
            const parsed = JSON.parse(saved) as StoredLanguage;
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
          const toStore: StoredLanguage = { ...preferredLang, version: LANGUAGE_VERSION };
          localStorage.setItem("preferred_lang", JSON.stringify(toStore));
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

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    // Save with version field
    const toStore: StoredLanguage = { ...lang, version: LANGUAGE_VERSION };
    localStorage.setItem("preferred_lang", JSON.stringify(toStore));
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

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
