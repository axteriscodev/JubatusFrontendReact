import type { Language } from "@/types/i18n";

export function extractLanguageCode(locale: string): string | null {
  if (!locale || typeof locale !== "string") return null;
  return locale.split("-")[0].split("_")[0].toLowerCase();
}

export function getBrowserLanguages(): string[] {
  const languages: string[] = [];

  if (navigator.languages && navigator.languages.length > 0) {
    navigator.languages.forEach((lang) => {
      const code = extractLanguageCode(lang);
      if (code && !languages.includes(code)) {
        languages.push(code);
      }
    });
  }

  if (languages.length === 0 && navigator.language) {
    const code = extractLanguageCode(navigator.language);
    if (code) languages.push(code);
  }

  return languages;
}

export function findBestLanguageMatch(
  availableLanguages: Language[],
  browserLanguages: string[],
): Language | null {
  if (!availableLanguages || availableLanguages.length === 0) return null;
  if (!browserLanguages || browserLanguages.length === 0) return null;

  for (const browserLang of browserLanguages) {
    const match = availableLanguages.find(
      (lang) => lang.acronym && lang.acronym.toLowerCase() === browserLang,
    );
    if (match) return match;
  }

  return null;
}

export function getFallbackLanguage(availableLanguages: Language[]): Language | null {
  if (!availableLanguages || availableLanguages.length === 0) return null;

  const english = availableLanguages.find((l) => l.acronym === "en");
  if (english) return english;

  return availableLanguages[0];
}

export function getPreferredLanguage(): Pick<Language, "acronym"> {
  try {
    const saved = localStorage.getItem("preferred_lang");
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (parsed && typeof parsed === "object" && "acronym" in parsed) {
        return parsed as Language;
      }
    }
  } catch (e) {
    console.warn("Failed to parse preferred_lang from localStorage:", e);
  }

  return { acronym: "en" };
}
