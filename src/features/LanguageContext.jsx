import { createContext, useContext, useEffect, useState } from 'react';
import { useApi } from "../../services/useApi";
import { apiFactory } from "../../services/apiFactory";

// Lingua di default
const defaultLanguage = {
  languageId: "",
  languageCode: "it",
  languageName: "Italiano",
};

const LanguageContext = createContext({
  currentLanguage: defaultLanguage,
  setLanguage: () => { },
  availableLanguages: [],
  loadingLanguages: false,
});

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(true);

  // creo il servizio
  const apiService = apiFactory(import.meta.env.VITE_API_URL + "/api/language");

  // importo stati e funzioni che servono
  const { listState, getAll } = useApi(apiService);

  useEffect(() => {
    getAll();
  }, []);

  // Aggiorna stato con risultato fetch
  useEffect(() => {
    if (listState.data?.length) {
      setAvailableLanguages(listState.data);

      const saved = localStorage.getItem("preferred_lang");
      let preferredLang;

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          preferredLang = listState.data.find(l => l.languageCode === parsed.languageCode);
        } catch {
          console.warn("Invalid preferred_lang in localStorage:", saved);
          localStorage.removeItem("preferred_lang");
        }
      }

      if (!preferredLang) {
        preferredLang = listState.data.find(l => l.languageCode === "it") || listState.data[0];
      }

      if (preferredLang) {
        setCurrentLanguage(preferredLang);
        localStorage.setItem("preferred_lang", JSON.stringify(preferredLang));
      }

      setLoadingLanguages(false);
    }
  }, [listState.data]);

  const setLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem("preferred_lang", JSON.stringify(lang));
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage: currentLanguage ?? defaultLanguage,
      setLanguage,
      availableLanguages,
      loadingLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
