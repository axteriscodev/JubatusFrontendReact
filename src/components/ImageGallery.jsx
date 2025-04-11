import styles from "./ImageGallery.module.css";

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

  return (
    <>
      <div className={`row row-cols-3 row-cols-md-4 row-cols-lg-5 justify-content-center g-2 ${styles.gallery}`}>
        {images.map((image, i) => (
          <div key={image.keyPreview || image.keyThumbnail || image.keyOriginal || i}>
            <div className="ratio ratio-1-1">
              <div>
                <div className={`${styles.picture} ${
                    photoItems?.some((el) => el.keyPreview === image.keyPreview) ? styles.selected : ""
                  }`}
                  style={{
                    backgroundImage: `url(${!image.fileTypeId || image.fileTypeId == 1 ? image.urlPreview || image.urlThumbnail || image.url : "/images/play-icon.webp"})`
                  }}
                >
                </div>
                <div className={styles.zoom}
                  onClick={() => onOpenLightbox?.(images, i, select, actions, personalSlice) }>
                    <i className="bi bi-search"></i>
                </div>
                {select && highLightPurchased && !image.purchased &&
                <div className={styles.circle}
                  onClick={() => onImageClick?.(image.keyPreview || image.keyThumbnail) }>
                    <i className="bi bi-check"></i>
                </div>
                }
                {highLightPurchased && image.purchased &&
                <div className={styles.purchased}>
                  Acquistata
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
