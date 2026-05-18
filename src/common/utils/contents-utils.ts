/** Identificatori numerici del tipo di file media. */
export const FileType = {
  IMAGE: 1,
  VIDEO: 2,
  CLIP: 3,
} as const;

export type FileTypeId = (typeof FileType)[keyof typeof FileType];

/** Stato dell'evento rispetto ai contenuti acquistati/cercati. */
export const EventStatus = {
  ONLY_PURCHASED: "onlyPurchased",
  MIXED: "mixed",
  ONLY_SEARCHED: "onlySearched",
} as const;

interface RawContentItem {
  id: number;
  fileTypeId: FileTypeId;
  keyOriginal: string;
  isPurchased: boolean;
  favorite?: boolean;
  urlOriginal?: string;
  urlPreview?: string;
  urlPreviewTiny?: string;
  urlThumbnail?: string;
  urlTiny?: string;
  urlCover?: string;
}

interface RawEventItem {
  id?: number;
  eventId?: number;
  slug: string;
  hashId: string;
  title?: string;
  logo?: string;
  status: string;
  items?: RawContentItem[];
  totalItems?: number;
  preOrder?: boolean;
  allPhotos?: boolean;
}

export interface NormalizedContent {
  id: number;
  src: string | undefined;
  srcThumbnail: string | undefined;
  srcTiny: string | undefined;
  key: string;
  favorite: boolean;
  isVideo: boolean;
  isPurchased: boolean;
  urlOriginal: string | undefined;
  fileTypeId: FileTypeId;
}

export interface PersonalEventGallery {
  id: number | undefined;
  slug: string;
  hashId: string;
  title: string;
  logo: string;
  status: string;
  images: NormalizedContent[];
  totalImages: number;
  preOrder: boolean;
  allPhotos: boolean;
}

/**
 * Normalizza la risposta API della libreria personale in un array di PersonalEventGallery.
 * Ogni evento include i propri contenuti già normalizzati tramite getEventContents.
 */
export const getPersonalEventGalleries = (
  data: unknown,
): PersonalEventGallery[] => {
  if (!Array.isArray(data)) {
    console.error("Expected array but received:", typeof data, data);
    return [];
  }

  return (data as RawEventItem[]).map((event) => ({
    id: event.id || event.eventId,
    slug: event.slug,
    hashId: event.hashId,
    title: event.title || "",
    logo: event.logo || "",
    status: event.status,
    images: getEventContents(event.items || [], true),
    totalImages: event.totalItems || 0,
    preOrder: event.preOrder ?? false,
    allPhotos: event.allPhotos ?? false,
  }));
};

/**
 * Normalizza un array grezzo di contenuti API in NormalizedContent[].
 * isPersonalArea influenza la selezione dell'URL thumbnail per video/clip.
 */
export const getEventContents = (
  data: unknown,
  isPersonalArea = false,
): NormalizedContent[] => {
  if (!Array.isArray(data)) {
    console.error("Expected array but received:", typeof data, data);
    return [];
  }

  const result = (data as RawContentItem[]).map((item) =>
    NormalizeContent(item, isPersonalArea),
  );

  return result;
};

/**
 * Normalizza un singolo item grezzo in NormalizedContent.
 * Seleziona le URL src/thumbnail/tiny in base al tipo (foto/video/clip)
 * e allo stato di acquisto.
 */
export const NormalizeContent = (
  item: RawContentItem,
  isPersonalArea = false,
): NormalizedContent => {
  const isReel = item.fileTypeId === FileType.VIDEO;
  const isClip = item.fileTypeId === FileType.CLIP;
  let src: string | undefined;
  let srcThumbnail: string | undefined;
  let srcTiny: string | undefined;

  if (isReel) {
    src = item.urlOriginal || item.urlPreview;
    srcThumbnail =
      (isPersonalArea ? item.urlThumbnail : item.urlCover) ||
      item.urlCover ||
      "/images/play-icon.webp";
    srcTiny =
      (isPersonalArea ? item.urlThumbnail : item.urlCover) ||
      item.urlCover ||
      "/images/play-icon.webp";
  } else if (isClip) {
    src = item.urlOriginal || item.urlPreview;
    srcThumbnail =
      (isPersonalArea ? item.urlThumbnail : item.urlCover) ||
      "/images/play-icon.webp";
    srcTiny =
      (isPersonalArea ? item.urlThumbnail : item.urlCover) ||
      "/images/play-icon.webp";
  } else {
    if (item.isPurchased) {
      src = item.urlThumbnail || item.urlPreview;
      srcThumbnail = item.urlThumbnail || item.urlPreview;
      srcTiny = item.urlTiny || item.urlPreviewTiny || src;
    } else {
      src = item.urlPreview;
      srcThumbnail = item.urlPreview;
      srcTiny = item.urlPreviewTiny || src;
    }
  }

  return {
    id: item.id,
    src,
    srcThumbnail,
    srcTiny,
    key: item.keyOriginal,
    favorite: item.favorite ?? false,
    isVideo: isReel || isClip,
    isPurchased: item.isPurchased,
    urlOriginal: item.urlOriginal,
    fileTypeId: item.fileTypeId,
  };
};
