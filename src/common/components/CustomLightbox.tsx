import { Trash2, ShoppingCart, Heart, Download } from "lucide-react";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import styles from "./CustomLightbox.module.css";
import { useTranslations } from "../i18n/TranslationProvider";
import { apiRequest } from "../services/api-services";
import { getEventContents, NormalizedContent } from "../utils/contents-utils";

export interface CustomLightboxProps {
  open: boolean;
  slides?: NormalizedContent[] | null;
  slide?: string | null;
  index?: number;
  setIndex?: ((newIndex: number) => void) | null;
  select?: boolean;
  actions?: boolean;
  addToCart?: boolean;
  onClose: () => void;
  onUpdateSlide?: ((index: number, slide: unknown) => void) | null;
  onImageClick?: ((key: string) => void) | null;
  photoItems?: NormalizedContent[] | null;
  shopMode?: boolean;
  isPersonalArea?: boolean;
}

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
  isPersonalArea = false,
}: CustomLightboxProps) {
  const { t } = useTranslations();

  const effectiveSlides =
    slides && slides.length > 0
      ? slides
      : slide
        ? [
            {
              url: slide,
              keyOriginal: slide,
              fileTypeId: 2 as const,
              urlOriginal: slide,
              id: 0,
              src: slide,
              srcThumbnail: slide,
              srcTiny: slide,
              key: slide,
              favorite: false,
              isVideo: true,
              isPurchased: false,
            },
          ]
        : [];

  const normalizedSlides = getEventContents(effectiveSlides, isPersonalArea);

  const currentImage: Partial<NormalizedContent> =
    normalizedSlides[index] ?? normalizedSlides[0] ?? {};

  const isSelected = photoItems?.some((el) => el.key === currentImage.key);

  const handleFavouriteClick = async () => {
    const rq = { contentId: currentImage.id };
    const response = await apiRequest({
      api: import.meta.env.VITE_API_URL + "/utility/my-like",
      method: "POST",
      body: JSON.stringify(rq),
      needAuth: true,
    });
    const data = await response.json();

    // Aggiorna lo slide corrente via callback
    if (onUpdateSlide) {
      const originalSlide = effectiveSlides[index];
      const updatedSlide = {
        ...originalSlide,
        favorite: data.data,
      };
      onUpdateSlide(index, updatedSlide);
    }
  };

  const handleDownload = async () => {
    const url = currentImage.urlOriginal;
    if (!url) return;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      slides={normalizedSlides as any}
      plugins={normalizedSlides.length > 1 ? [Thumbnails, Video] : [Video]}
      render={{
        slide: ({ slide: s }) => {
          const typedSlide = s as NormalizedContent;
          const media = typedSlide.isVideo ? (
            <video
              controls
              controlsList="nodownload"
              className="max-w-full max-h-full mx-auto"
            >
              <source src={typedSlide.src} type="video/mp4" />
              {t("LIGHTBOX_SUPPORT")}
            </video>
          ) : (
            <img
              src={typedSlide.src}
              alt=""
              className="max-w-full max-h-full"
            />
          );

          return (
            <div className="flex flex-col items-center h-full w-full">
              {actions && (
                <div className="flex gap-6 py-2 z-10">
                  <a
                    onClick={handleFavouriteClick}
                    aria-label="Favourite image"
                    className="cursor-pointer"
                  >
                    <Heart
                      size={42}
                      className={
                        currentImage.favorite ? "text-red-500" : "text-white"
                      }
                      fill={currentImage.favorite ? "currentColor" : "none"}
                    />
                  </a>
                  <a
                    onClick={handleDownload}
                    title="Download"
                    aria-label="Download image"
                    className="cursor-pointer"
                  >
                    <Download size={42} className="text-white" />
                  </a>
                </div>
              )}
              <div className="flex-1 flex items-center justify-center min-h-0 w-full">
                {media}
              </div>
            </div>
          );
        },
        thumbnail: ({ slide: s, rect }) => {
          const typedSlide = s as NormalizedContent;
          return (
            <div
              style={{
                width: rect.width,
                height: rect.height,
                position: "relative",
                overflow: "hidden",
                borderRadius: "4px",
              }}
              className={typedSlide.isVideo ? "video" : ""}
            >
              <img
                src={typedSlide.srcTiny || "/images/play-icon.webp"}
                alt=""
                className={styles.thunbnail}
                loading="lazy"
              />
            </div>
          );
        },
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
                  onClick={() => onImageClick?.(currentImage.key!)}
                  className={`my-button w-full ${isSelected ? "remove" : "add"}`}
                >
                  {isSelected ? (
                    <>
                      <Trash2 size={16} className="inline" />{" "}
                      {t("LIGHTBOX_REMOVE")}
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} className="inline" />{" "}
                      {t("LIGHTBOX_SELECT")}
                    </>
                  )}
                </button>
              </div>
            )}
            {shopMode && currentImage.isPurchased && (
              <div className="shopBadge">🎉 {t("LIGHTBOX_PURCHASE")}</div>
            )}
          </>
        ),
      }}
    />
  );
}
