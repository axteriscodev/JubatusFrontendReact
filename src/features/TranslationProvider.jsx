import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { useSelector } from 'react-redux';

export const TranslationContext = createContext({
  translations: {},
  t: (key) => key,
  loadingTranslations: true,
   currentLanguage: null,
});

export function TranslationProvider({ children }) {
  const { currentLanguage } = useLanguage();
  const langCode = currentLanguage.acronym;
  const tagId = useSelector((state) => state.competition?.tagId);

  const [translations, setTranslations] = useState({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  const t = (key) => {
    if (!key) return "";

    //se ho il tag, provo a cercare la traduzione col tag
    if (tagId && tagId !== 0 && translations[`${key}_${tagId}`]) {
      return translations[`${key}_${tagId}`];
    }

    //se non ho il tag o non ho trovato la traduzione col tag, cerco la traduzione neutra
    if (translations[key]) {
      return translations[key];
    }

    return "";
  };

  const toDictionary = (array) =>
    Object.fromEntries(array.map(item => [item.key, item.value]));

  useEffect(() => {
    const fetchTranslations = async () => {
      setLoadingTranslations(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/translation/fetch/${langCode}/`
        );

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setTranslations(toDictionary(data.data));
      } catch (error) {
        console.error("Errore durante il fetch delle traduzioni:", error);
        setTranslations({});
      } finally {
        setLoadingTranslations(false);
      }
    };

    if (langCode) {
      fetchTranslations();
    }
  }, [langCode]);

  return (
    <TranslationContext.Provider value={{ translations, t, loadingTranslations, currentLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  return useContext(TranslationContext);
}
