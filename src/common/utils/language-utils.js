/**
 * Estrae il codice lingua base da un locale
 * Es: "en-US" → "en", "it-IT" → "it"
 * @param {string} locale - Il locale da cui estrarre il codice lingua
 * @returns {string|null} Il codice lingua base o null se invalido
 */
export function extractLanguageCode(locale) {
  if (!locale || typeof locale !== 'string') return null;
  return locale.split('-')[0].split('_')[0].toLowerCase();
}

/**
 * Ottiene le lingue preferite del browser in ordine
 * Ritorna array di codici lingua: ["en", "it", ...]
 * @returns {string[]} Array di codici lingua in ordine di preferenza
 */
export function getBrowserLanguages() {
  const languages = [];

  // Try navigator.languages (modern browsers)
  if (navigator.languages && navigator.languages.length > 0) {
    navigator.languages.forEach(lang => {
      const code = extractLanguageCode(lang);
      if (code && !languages.includes(code)) {
        languages.push(code);
      }
    });
  }

  // Fallback to navigator.language
  if (languages.length === 0 && navigator.language) {
    const code = extractLanguageCode(navigator.language);
    if (code) languages.push(code);
  }

  // Fallback to navigator.userLanguage (IE)
  if (languages.length === 0 && navigator.userLanguage) {
    const code = extractLanguageCode(navigator.userLanguage);
    if (code) languages.push(code);
  }

  return languages;
}

/**
 * Trova la migliore lingua corrispondente tra quelle disponibili
 * Prova le lingue browser in ordine contro le opzioni disponibili
 * @param {Array} availableLanguages - Array di oggetti lingua dall'API
 * @param {string[]} browserLanguages - Array di codici lingua del browser
 * @returns {Object|null} L'oggetto lingua corrispondente o null
 */
export function findBestLanguageMatch(availableLanguages, browserLanguages) {
  if (!availableLanguages || availableLanguages.length === 0) return null;
  if (!browserLanguages || browserLanguages.length === 0) return null;

  // Try each browser language in order
  for (const browserLang of browserLanguages) {
    const match = availableLanguages.find(
      lang => lang.acronym && lang.acronym.toLowerCase() === browserLang
    );
    if (match) return match;
  }

  return null;
}

/**
 * Ottiene la lingua di fallback da quelle disponibili
 * Prova "en" prima, poi ritorna la prima disponibile
 * @param {Array} availableLanguages - Array di oggetti lingua dall'API
 * @returns {Object|null} L'oggetto lingua di fallback o null
 */
export function getFallbackLanguage(availableLanguages) {
  if (!availableLanguages || availableLanguages.length === 0) return null;

  // Try "en" first
  const english = availableLanguages.find(l => l.acronym === "en");
  if (english) return english;

  // Fallback to first available
  return availableLanguages[0];
}

/**
 * Ottiene la lingua preferita da localStorage con fallback a "en"
 * Utility per uso in loaders e actions
 * @returns {Object} Oggetto lingua con almeno { acronym: string }
 */
export function getPreferredLanguage() {
  try {
    const saved = localStorage.getItem('preferred_lang');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.acronym) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse preferred_lang from localStorage:', e);
  }

  // Fallback to English
  return { acronym: 'en' };
}
