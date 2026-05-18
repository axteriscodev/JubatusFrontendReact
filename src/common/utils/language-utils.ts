import type { Language } from "@/types/i18n";

/** Estrae il codice lingua base da una stringa locale (es. "it-IT" → "it", "en_US" → "en"). */
export function extractLanguageCode(locale: string): string | null {
  if (!locale || typeof locale !== "string") return null;
  return locale.split("-")[0].split("_")[0].toLowerCase();
}

/** Restituisce la lista ordinata dei codici lingua preferiti dal browser (deduplicati). */
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

/**
 * Trova la prima lingua disponibile che corrisponde a una delle preferenze del browser.
 * Restituisce null se non c'è nessuna corrispondenza.
 */
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

/** Restituisce l'inglese come fallback, o la prima lingua disponibile se l'inglese non c'è. */
export function getFallbackLanguage(availableLanguages: Language[]): Language | null {
  if (!availableLanguages || availableLanguages.length === 0) return null;

  const english = availableLanguages.find((l) => l.acronym === "en");
  if (english) return english;

  return availableLanguages[0];
}

/**
 * Legge la lingua preferita da localStorage (chiave "preferred_lang").
 * Restituisce { acronym: "en" } come default se assente o malformata.
 */
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
