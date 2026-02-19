import { Trash2, ShoppingCart, Heart, Download } from "lucide-react";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import styles from "./CustomLightbox.module.css";
import { useTranslations } from "../i18n/TranslationProvider";
import { getEventContents } from "../utils/contents-utils";

export default function CustomLightbox({
  open,
  slides = null,
  slide = null,
  index = 0,
  setIndex = null,
  select = false,
  actions = false,
  addToCart = true,
  onClose,
  onUpdateSlide = null,
  onImageClick = null,
  photoItems = null,
  shopMode = false,
}) {
  //const dispatch = useDispatch();

  //const currentImage = slides[index] ?? 0;

  const { t } = useTranslations();

  const effectiveSlides =
    slides && slides.length > 0
      ? slides
      : slide
      ? [{ url: slide, keyOriginal: slide, fileTypeId: 2, urlOriginal: slide }]
      : [];

  const normalizedSlides = getEventContents(effectiveSlides);

  const currentImage = normalizedSlides[index] ?? normalizedSlides[0] ?? {};

  const isSelected = photoItems?.some(
    (el) => el.keyOriginal === currentImage.key
  );

  const handleFavouriteClick = async () => {
    const rq = { contentId: currentImage.id };
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/utility/my-like",
      {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(rq),
      }
    );
    const data = await response.json();

    // Aggiorna lo slide corrente via callback
    if (onUpdateSlide) {
      const originalSlide = effectiveSlides[index];
      const updatedSlide = {
        ...originalSlide,
        //favorite: !currentImage.favorite
        favorite: data.data,
      };
      onUpdateSlide(index, updatedSlide);
    }
  };

  const handleDownload = async () => {
    const url = currentImage.urlOriginal;
    const response = await fetch(url);
    const blob = await response.blob();

    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1]?.split("?")[0] || `image`;

    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  //const handleShareClick = (image) => alert(`Share: ${image.urlOriginal}`);

  return (
    <Lightbox
      styles={{ container: { backgroundColor: "var(--overlay)" } }}
      open={open}
      close={onClose}
      index={index}
      on={{
        view: ({ index: newIndex }) => {
          // Pausa eventuale video prima del cambio slide
          const playingVideo = document.querySelector("video");
          if (playingVideo && !playingVideo.paused) {
            playingVideo.pause();
          }
          setIndex?.(newIndex);
        },
      }}
      slides={normalizedSlides}
      plugins={normalizedSlides.length > 1 ? [Thumbnails, Video] : [Video]}
      render={{
        slide: ({ slide }) => {
          const media = slide.isVideo ? (
            <video
              controls
              controlsList="nodownload"
              className="max-w-full max-h-full mx-auto"
            >
              <source src={slide.src} type="video/mp4" />
              {t("LIGHTBOX_SUPPORT")}
            </video>
          ) : (
            <img
              src={slide.src}
              alt=""
              className="max-w-full max-h-full"
            />
          );

          return (
            <div className="flex flex-col items-center h-full w-full">
              {actions && (
                <div className="flex gap-4 text-5xl py-2 z-1000">
                  <a onClick={handleFavouriteClick} aria-label="Favourite image" className="cursor-pointer">
                    <i
                      className={`bi ${
                        currentImage.favorite
                          ? "bi-heart-fill text-red-500"
                          : "bi-heart text-white"
                      }`}
                    ></i>
                  </a>
                  <a
                    onClick={handleDownload}
                    title="Download"
                    aria-label="Download image"
                    className="cursor-pointer"
                  >
                    <i className="bi bi-box-arrow-down text-white"></i>
                  </a>
                </div>
              )}
              <div className="flex-1 flex items-center justify-center min-h-0 w-full">
                {media}
              </div>
            </div>
          );
        },
        thumbnail: ({ slide, rect }) => 
          {  
            return <div
            style={{
              width: rect.width,
              height: rect.height,
              position: "relative",
              overflow: "hidden",
              borderRadius: "4px",
            }}
            className={slide.isVideo ? "video" : ""}
          >
            <img
              src={slide.srcTiny || "/images/play-icon.webp"}
              alt=""
              className={styles.thunbnail}
              loading="lazy"
            />
          </div>}
        ,
        slideHeader: () => (
          <>
            {addToCart && select && !currentImage.isPurchased && (
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  left: "25%",
                  width: "50%",
                  zIndex: 1000,
                }}
              >
                <button
                  onClick={() =>
                    onImageClick?.(
                      currentImage.key
                    )
                  }
                  className={`my-button w-full ${isSelected ? "remove" : "add"}`}
                >
                  {isSelected ? (
                    <>
                      <Trash2 size={16} className="inline" />{" "}
                      {t("LIGHTBOX_REMOVE")}
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} className="inline" /> {t("LIGHTBOX_SELECT")}
                    </>
                  )}
                </button>
              </div>
            )}
            {(shopMode && currentImage.isPurchased) && (
              <div className="shopBadge">🎉 {t("LIGHTBOX_PURCHASE")}</div>
            )}
            {actions && (
              <div className="flex gap-3 justify-between position-absolute top-0 start-50 translate-middle-x z-3 px-4 py-1 mt-3">
                <a onClick={handleFavouriteClick} aria-label="Favourite image">
                  <Heart
                    size={48}
                    className={currentImage.favorite ? "text-danger" : "text-white"}
                    fill={currentImage.favorite ? "currentColor" : "none"}
                  />
                </a>
                <a
                  onClick={handleDownload}
                  title="Download"
                  aria-label="Download image"
                >
                  <Download size={48} className="text-white" />
                </a>
                {/* {<a onClick={() => handleShareClick(currentImage)} aria-label="Share image">
                <i className="bi bi-arrow-up-right"></i>
              </a>} */}
              </div>
            )}
          </>
        ),
      }}
    />
  );
}
