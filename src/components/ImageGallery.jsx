import { Search, Check, Heart } from "lucide-react";
import styles from "./ImageGallery.module.css";
import { useTranslations } from "../features/TranslationProvider";
import { getEventContents } from "../utils/contents-utils";

/**
 * Componente ImageGallery
 *
 * Visualizza una galleria di immagini responsive con funzionalità opzionali come:
 * - Selezione delle immagini
 * - Evidenziazione di immagini acquistate/preferite
 * - Lightbox per visualizzazione ingrandita
 * - Azioni personalizzate sulle immagini
 *
 * @param {Array} images - Array di oggetti immagine da visualizzare
 * @param {boolean} select - Abilita la selezione delle immagini (default: true)
 * @param {boolean} actions - Abilita azioni aggiuntive sulle immagini (default: false)
 * @param {boolean} highLightPurchased - Evidenzia le immagini acquistate (default: false)
 * @param {boolean} highLightFavourite - Evidenzia le immagini preferite (default: false)
 * @param {boolean} applyRedFilter - Applica filtro rosso alle immagini non acquistate (default: false)
 * @param {Function} onOpenLightbox - Callback per aprire il lightbox
 * @param {Function} onImageClick - Callback per il click sull'immagine
 * @param {Array} photoItems - Array di foto selezionate per evidenziare la selezione
 * @param {boolean} personalSlice - Flag per gestione slice personale (default: false)
 * @param {string} aspectRatio - Aspect ratio delle immagini (es: "1:1", "3:2", "16:9"). Default: "1:1"
 */
export default function ImageGallery({
  images,
  select = true,
  actions = false,
  highLightPurchased = false,
  highLightFavourite = false,
  applyRedFilter = false,
  onOpenLightbox = null,
  onImageClick = null,
  photoItems = null,
  personalSlice = false,
  aspectRatio = "1:1",
}) {
  // Recupera i contenuti degli eventi personali dalle immagini
  const data = getEventContents(images);

  // Recupera le foto attualmente selezionate per evidenziarle nella galleria
  const currentPhotoItems = getEventContents(photoItems || []);

  // Hook per le traduzioni
  const { t } = useTranslations();

  // Converte aspectRatio da formato "3:2" a classe CSS "ratio-3-2"
  const getRatioClass = (ratio) => {
    if (!ratio) return "ratio-1-1"; // Fallback di default
    return `ratio-${ratio.replace(":", "-")}`;
  };

  return (
    <>
      {/* Griglia responsive della galleria: 3 colonne su mobile, 4 su tablet, 5 su desktop */}
      <div
        className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-center gap-2 pb-30 ${styles.gallery}`}
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
                  <Search size={16} />
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
                {/* {highLightPurchased && image.isPurchased &&
                <div className={styles.purchased}>
                  {t("GALLERY_PURCHASE")}
                </div>
                } */}

                {/* Icona cuore: visibile solo se l'immagine è tra i preferiti */}
                {highLightFavourite && image.favorite && (
                  <div className={styles.favorite}>
                    <Heart size={16} className="text-danger" fill="currentColor" />
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
