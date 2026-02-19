export interface Language {
  id: string;
  acronym: string;
  language: string;
}

export interface StoredLanguage extends Language {
  version: number;
}

export interface LanguageContextValue {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  availableLanguages: Language[];
  loadingLanguages: boolean;
}

export interface TranslationContextValue {
  translations: Record<string, string>;
  t: (key: string) => string;
  loadingTranslations: boolean;
  currentLanguage: Language | null;
}
