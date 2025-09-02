import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';

export const TranslationContext = createContext({
  translations: {},
  t: (key) => key,
  loadingTranslations: true,
});

export function TranslationProvider({ children }) {
  const { currentLanguage } = useLanguage();
  const langCode = currentLanguage.languageCode;

  const [translations, setTranslations] = useState({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  const t = (key) => translations[key] ?? "";

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
    <TranslationContext.Provider value={{ translations, t, loadingTranslations }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  return useContext(TranslationContext);
}
