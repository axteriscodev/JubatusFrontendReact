import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { useAppSelector } from '@common/store/hooks';
import type { Language, TranslationContextValue } from '@/types/i18n';
import type { ApiResponse } from '@/types/api';

interface TranslationItem {
  key: string;
  value: string;
}

export const TranslationContext = createContext<TranslationContextValue>({
  translations: {},
  t: (key) => key,
  loadingTranslations: true,
  currentLanguage: null,
});

interface TranslationProviderProps {
  children: React.ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const { currentLanguage } = useLanguage();
  const langCode = currentLanguage.acronym;
  const tagId = useAppSelector((state) => state.competition?.tagId);

  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  // Restituisce la traduzione per key, con override per tag specifico (es. "TITLE_42").
  // Ritorna "" (stringa vuota) se la chiave non esiste — mai il fallback alla chiave stessa,
  // perché i componenti usano parse() e mostrano stringa vuota se la traduzione manca.
  const t = (key: string): string => {
    if (!key) return "";

    if (tagId && tagId !== 0 && translations[`${key}_${tagId}`]) {
      return translations[`${key}_${tagId}`];
    }

    if (translations[key]) {
      return translations[key];
    }

    return "";
  };

  const toDictionary = (array: TranslationItem[]): Record<string, string> =>
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

        const data = await response.json() as ApiResponse<TranslationItem[]>;
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

  const currentLang: Language = currentLanguage;

  return (
    <TranslationContext.Provider value={{ translations, t, loadingTranslations, currentLanguage: currentLang }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations(): TranslationContextValue {
  return useContext(TranslationContext);
}
