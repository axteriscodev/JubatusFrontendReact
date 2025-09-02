import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { useApi } from "../../services/useApi";
import { apiFactory } from "../../services/apiFactory";

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

  // creo il servizio
  const apiService = apiFactory(import.meta.env.VITE_API_URL + "/api/language");

  // importo stati e funzioni che servono
  const { listState, getAll } = useApi(apiService);

  useEffect(() => {
    getAll({ id: langCode, action: "translations" });
  }, [langCode]);

  const toDictionary = (array) =>
    Object.fromEntries(array.map(item => [item.key, item.value]));

  useEffect(() => {
    if (listState.data) {
      setTranslations(toDictionary(listState.data));
    } else {
      setTranslations({});
    }
    setLoadingTranslations(listState.loading);
  }, [listState.data, listState.loading]);

  return (
    <TranslationContext.Provider value={{ translations, t, loadingTranslations }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  return useContext(TranslationContext);
}
