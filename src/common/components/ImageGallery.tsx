import { Search, Check, Heart } from "lucide-react";
import styles from "./ImageGallery.module.css";
import { Play } from "lucide-react";
import reelIcon from "../../assets/reel-icon.svg";
import { useTranslations } from "../i18n/TranslationProvider";
import { getEventContents, NormalizedContent } from "../utils/contents-utils";

/**
 * Componente ImageGallery
 *
 * Visualizza una galleria di immagini responsive con funzionalità opzionali come:
 * - Selezione delle immagini
 * - Evidenziazione di immagini acquistate/preferite
 * - Lightbox per visualizzazione ingrandita
 * - Azioni personalizzate sulle immagini
 */
export interface ImageGalleryProps {
  images: unknown[];
  select?: boolean;
  actions?: boolean;
  highLightPurchased?: boolean;
  highLightFavourite?: boolean;
  applyRedFilter?: boolean;
  onOpenLightbox?: (images: unknown[], index: number, select: boolean, actions: boolean, personalSlice: boolean) => void;
  onImageClick?: (key: string) => void;
  photoItems?: unknown[] | null;
  personalSlice?: boolean;
  aspectRatio?: string;
  isShop?: boolean;
}

export default function ImageGallery({
  images,
  select = true,
  actions = false,
  highLightPurchased = false,
  highLightFavourite = false,
  applyRedFilter = false,
  onOpenLightbox,
  onImageClick,
  photoItems = null,
  personalSlice = false,
  aspectRatio = "1:1",
  isShop = false,
}: ImageGalleryProps) {
  // Recupera i contenuti degli eventi personali dalle immagini
  const data: NormalizedContent[] = getEventContents(images);

  // Recupera le foto attualmente selezionate per evidenziarle nella galleria
  const currentPhotoItems: NormalizedContent[] = getEventContents(photoItems || []);

  // Hook per le traduzioni
  const { t } = useTranslations();

  // Converte aspectRatio da formato "3:2" a classe CSS "ratio-3-2"
  const getRatioClass = (ratio: string) => {
    if (!ratio) return "ratio-1-1"; // Fallback di default
    return `ratio-${ratio.replace(":", "-")}`;
  };

  return (
    <>
      {/* Griglia responsive della galleria: 3 colonne su mobile, 4 su tablet, 5 su desktop */}
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-2 pb-30 ${styles.gallery}`}
      >
        {data.map((image, i) => (
          // Contenitore singola immagine con chiave unica
          <div key={`gallery_${Date.now()}_${image.key || i}_${i}`}>
            {/* Ratio dinamico dalle impostazioni evento */}
            <div className={`ratio ${getRatioClass(aspectRatio)}`}>
              <div>
                {/* Contenitore immagine con classi condizionali per selezione e tipo video */}
                <div
                  className={`${styles.picture} ${
                    // Evidenzia l'immagine se è presente nei photoItems selezionati
                    currentPhotoItems?.some((el) => el.key === image.key)
                      ? styles.selected
                      : ""
                  } ${
                    // Aggiunge classe "video" se l'immagine ha src (logica da verificare)
                    image.isVideo && image.src && "video"
                  }`}
                  style={{ position: "relative" }}
                >
                  {/* Immagine con lazy loading per ottimizzare le performance */}
                  <img
                    src={image.srcTiny}
                    alt={`Immagine ${i + 1}`}
                    loading="lazy"
                    className={styles.galleryImage}
                  />

                  {/* Badge tipo contenuto: icona play circolare per Reel (typeId 2), play per Clip (typeId 3) */}
                  {(image.fileTypeId === 2 || image.fileTypeId === 3) && (
                    <div className={styles.contentTypeBadge}>
                      {image.fileTypeId === 2 ? (
                        <img src={reelIcon} width={22} height={22} alt="reel" />
                      ) : (
                        <Play size={18} strokeWidth={1.5} fill="white" />
                      )}
                    </div>
                  )}

                  {/* Filtro rosso se applyRedFilter è true e l'immagine non è acquistata */}
                  {applyRedFilter && image.isPurchased === false && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.4)", // Opzionale: overlay scuro
                        backdropFilter: "grayscale(100%)",
                        WebkitBackdropFilter: "grayscale(100%)", // Per Safari
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>

                {/* Icona zoom per aprire il lightbox */}
                <div
                  className={styles.zoom}
                  onClick={() =>
                    onOpenLightbox?.(images, i, select, actions, personalSlice)
                  }
                >
                  <Search size={32} />
                </div>

                {/* Cerchio di selezione: visibile solo se select è true,
                    highLightPurchased è true e l'immagine non è stata acquistata */}
                {select && highLightPurchased && !image.isPurchased && (
                  <div
                    className={styles.circle}
                    onClick={() => onImageClick?.(image.key)}
                  >
                    <Check size={16} />
                  </div>
                )}

                {/* Badge "Acquistato": visibile solo se l'immagine è stata acquistata */}
                {isShop && highLightPurchased && image.isPurchased && (
                  <div className={styles.purchased}>
                    {t("GALLERY_PURCHASE")}
                  </div>
                )}

                {/* Icona cuore: visibile solo se l'immagine è tra i preferiti */}
                {highLightFavourite && image.favorite && (
                  <div className={styles.favorite}>
                    <Heart
                      size={16}
                      className="text-danger"
                      fill="currentColor"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
