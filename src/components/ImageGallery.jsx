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
  personalSlice = false
}) {
  // Recupera i contenuti degli eventi personali dalle immagini
  const data = getEventContents(images);
  
  // Recupera le foto attualmente selezionate per evidenziarle nella galleria
  const currentPhotoItems = getEventContents(photoItems || []);
  
  // Hook per le traduzioni
  const { t } = useTranslations();
  
  return (
    <>
      {/* Griglia responsive della galleria: 3 colonne su mobile, 4 su tablet, 5 su desktop */}
      <div className={`row row-cols-3 row-cols-md-4 row-cols-lg-5 justify-content-center g-2 pb-lg ${styles.gallery}`}>
        {data.map((image, i) => (
          // Contenitore singola immagine con chiave unica
          <div key={`gallery_${Date.now()}_${image.key || i}_${i}`}>
            {/* Ratio 1:1 per mantenere le immagini quadrate */}
            <div className="ratio ratio-1-1">
              <div>
                {/* Contenitore immagine con classi condizionali per selezione e tipo video */}
                <div className={`${styles.picture} ${
                    // Evidenzia l'immagine se è presente nei photoItems selezionati
                    currentPhotoItems?.some((el) => el.key === image.key) ? styles.selected : ""
                  } ${
                    // Aggiunge classe "video" se l'immagine ha src (logica da verificare)
                    (image.isVideo && image.src) && "video"
                  }`}
                  style={{ position: 'relative' }}
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
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 0, 0, 0.4)',
                        mixBlendMode: 'multiply',
                        pointerEvents: 'none'
                      }}
                    />
                  )}
                </div>
                
                {/* Icona zoom per aprire il lightbox */}
                <div className={styles.zoom}
                  onClick={() => onOpenLightbox?.(images, i, select, actions, personalSlice) }>
                    <i className="bi bi-search"></i>
                </div>
                
                {/* Cerchio di selezione: visibile solo se select è true, 
                    highLightPurchased è true e l'immagine non è stata acquistata */}
                {select && highLightPurchased && !image.isPurchased &&
                <div className={styles.circle}
                  onClick={() => onImageClick?.(image.key) }>
                    <i className="bi bi-check"></i>
                </div>
                }
                
                {/* Badge "Acquistato": visibile solo se l'immagine è stata acquistata */}
                {highLightPurchased && image.isPurchased &&
                <div className={styles.purchased}>
                  {t("GALLERY_PURCHASE")}
                </div>
                }
                
                {/* Icona cuore: visibile solo se l'immagine è tra i preferiti */}
                {highLightFavourite && image.favorite &&
                <div className={styles.favorite}>
                  <i className="bi bi-heart-fill text-danger"></i>
                </div>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}