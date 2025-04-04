import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import styles from "./ImageGallery.module.css";

export default function ImageGallery({ images, select = true, actions = false, onOpenLightbox, onImageClick, photoItems }) {

  return (
    <>
      <div className={`row row-cols-3 row-cols-md-4 row-cols-lg-5 g-2 ${styles.gallery}`}>
        {images.map((image, i) => (
          <div>
            <div
              onClick={() =>
                {
                  //console.log("Clicked image:", image);
                  photoItems.length === 0
                    ? onOpenLightbox(images, i, select, actions)
                    : onImageClick(image.keyPreview);
                }
              }
              className="ratio ratio-1-1"
            >
              <div className={`${styles.square} ${
                photoItems.some((el) => el.keyPreview === image.keyPreview) ? styles.selected : ""
              }`}></div>
              <div
                style={{
                  backgroundImage: `url(${image.url})`,
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "scroll",
                  backgroundPosition: "50% 50%",
                  backgroundSize: "cover",
                  backgroundColor: "transparent",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
