import { createContext, useContext, useEffect, useState } from 'react';

// Lingua di default
const defaultLanguage = {
  languageId: "",
  languageCode: "it",
  languageName: "Italiano",
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
            preferredLang = data.data.find(l => l.acronym === parsed.languageCode);
          } catch {
            console.warn("Invalid preferred_lang in localStorage:", saved);
            localStorage.removeItem("preferred_lang");
          }
        }

        if (!preferredLang) {
          preferredLang = data.data.find(l => l.acronym === "it") || data.data[0];
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
