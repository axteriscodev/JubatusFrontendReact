import styles from "./ImageGallery.module.css";
import { useTranslations } from "../features/TranslationProvider";

export default function ImageGallery({
  images,
  select = true,
  actions = false,
  highLightPurchased = false,
  highLightFavourite = false,
  onOpenLightbox = null,
  onImageClick = null,
  photoItems = null,
  personalSlice = false
}) {


  const { t } = useTranslations();

  return (
    <>
      <div className={`row row-cols-3 row-cols-md-4 row-cols-lg-5 justify-content-center g-2 pb-lg ${styles.gallery}`}>
        {images.map((image, i) => (
          <div key={`gallery_${Date.now()}_${image.keyPreview || image.keyThumbnail || image.keyOriginal || i}_${i}`}>
            <div className="ratio ratio-1-1">
              <div>
                <div className={`${styles.picture} ${
                    photoItems?.some((el) => el.keyPreview === image.keyPreview) ? styles.selected : ""
                  } ${
                    image.urlCover && "video"
                  }`}
                >
                  <img
                    src={
                      !image.fileTypeId || image.fileTypeId == 1
                      ? 
                      image.urlPreview || image.urlThumbnail || image.url
                      : 
                      image.urlCover || "/images/play-icon.webp"
                    }
                    alt={`Immagine ${i + 1}`}
                    loading="lazy"
                    className={styles.galleryImage}
                  />
                </div>
                <div className={styles.zoom}
                  onClick={() => onOpenLightbox?.(images, i, select, actions, personalSlice) }>
                    <i className="bi bi-search"></i>
                </div>
                {select && highLightPurchased && !image.purchased &&
                <div className={styles.circle}
                  onClick={() => onImageClick?.(image.keyPreview || image.keyThumbnail || image.keyOriginal) }>
                    <i className="bi bi-check"></i>
                </div>
                }
                {highLightPurchased && image.purchased &&
                <div className={styles.purchased}>
                  {t("GALLERY_PURCHASE")}
                </div>
                }
                {highLightFavourite && image.favorite &&
                <div className={styles.favorite}><i className="bi bi-heart-fill text-danger"></i></div>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}