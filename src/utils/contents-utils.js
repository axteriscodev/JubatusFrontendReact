/**
 * Costanti per identificare il tipo di file multimediale
 */
export const FileType = {
  IMAGE: 1,
  VIDEO: 2,
};

/**
 * Costanti per identificare lo stato dell evento per l utente (se ha acquistato o meno)
 */
export const EventStatus ={
    ONLY_PURCHASED : "onlyPurchased",
    MIXED : "mixed",
    ONLY_SEARCHED : "onlySearched"
}

/**
 * Formatta i dati degli eventi personali in una struttura di gallerie
 *
 * @param {Array} data - Array di oggetti evento ricevuti dal backend
 * @returns {Array} Array di oggetti galleria formattati con le seguenti proprietà:
 *   - id: ID univoco dell'evento
 *   - slug: URL-friendly identifier dell'evento
 *   - hashId: Hash ID per l'identificazione sicura
 *   - title: Titolo dell'evento
 *   - logo: URL del logo dell'evento
 *   - status: Stato dell'evento
 *   - images: Array di contenuti multimediali (immagini/video)
 *   - totalImages: Numero totale di elementi nella galleria
 *
 * @example
 * const galleries = getPersonalEventGalleries(eventsData);
 * // Returns: [{ id: 1, slug: 'event-name', images: [...], ... }]
 */
export const getPersonalEventGalleries = (data) => {
  // Verifica che i dati ricevuti siano un array valido
  if (!Array.isArray(data)) {
    console.error("Expected array but received:", typeof data, data);
    return [];
  }

  // Trasforma ogni evento in un oggetto galleria strutturato
  return data.map((event) => ({
    id: event.id || event.eventId, // Supporta entrambi i nomi di proprietà per compatibilità
    slug: event.slug,
    hashId: event.hashId,
    title: event.title || "", // Fornisce stringa vuota come fallback
    logo: event.logo || "",
    status: event.status,
    images: getPersonalEventContents(event.items || []), // Estrae e formatta i contenuti multimediali
    totalImages: event.totalItems || 0,
  }));
};

/**
 * Estrae e formatta i contenuti multimediali di un evento
 * Gestisce la logica di visualizzazione in base allo stato di acquisto
 *
 * @param {Array} data - Array di oggetti contenuto (immagini/video)
 * @returns {Array} Array di oggetti con le seguenti proprietà:
 *   - src: URL dell'immagine/video da visualizzare
 *   - isVideo: Boolean che indica se il contenuto è un video
 *
 * @example
 * const contents = getPersonalEventContents(eventItems);
 * // Returns: [{ src: 'url/to/image.jpg', isVideo: false }, ...]
 */
export const getPersonalEventContents = (data) => {
  // Verifica che i dati ricevuti siano un array valido
  if (!Array.isArray(data)) {
    console.error("Expected array but received:", typeof data, data);
    return [];
  }

  // Trasforma ogni item in un oggetto contenuto con src e tipo
  const result = data.map((item) => {
    // Determina quale URL utilizzare in base allo stato di acquisto:
    // - Se acquistato: usa la versione tiny o thumbnail
    // - Se non acquistato: usa la versione preview (con watermark/blur)
    const isVideo = item.fileTypeId === FileType.VIDEO;

    let src;

    if (isVideo) {
      src = item.urlCover || "/images/play-icon.webp";
    } else {
      src = item.isPurchased
        ? item.urlTiny || item.urlThumbnail
        : item.urlPreviewTiny || item.urlPreview;
    }

    const key = item.isPurchased
      ? item.keyTiny || item.keyThumbnail
      : item.keyPreviewTiny || item.keyPreview;

    return {
      id: item.id,
      src,
      key,
      favourite: item.isFavourite ?? false, //se il contenuto è tra i preferiti
      isVideo: isVideo, // Identifica se il contenuto è un video
      isPurchased: item.isPurchased, //se il contenuto è già stato acquistato
    };
  });

  return result;
};
