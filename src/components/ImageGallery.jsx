import styles from "./ImageGallery.module.css";

export default function ImageGallery({ images, select = true, actions = false, onOpenLightbox, onImageClick, photoItems }) {

  return (
    <>
      <div className={`row row-cols-3 row-cols-md-4 row-cols-lg-5 g-2 ${styles.gallery}`}>
        {images.map((image, i) => (
          <div>
            <div              
              className="ratio ratio-1-1"
            >
              <div>
                <div className={`${styles.picture} ${
                    photoItems.some((el) => el.keyPreview === image.keyPreview) ? styles.selected : ""
                  }`}
                  style={{
                    backgroundImage: `url(${image.url})`
                  }}
                >
                </div>
                <div className={styles.zoom}
                  onClick={() => onOpenLightbox(images, i, select, actions) }>
                    <i className="bi bi-search"></i>
                </div>
                <div className={styles.circle}
                  onClick={() => onImageClick(image.keyPreview) }>
                    <i className="bi bi-check"></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
