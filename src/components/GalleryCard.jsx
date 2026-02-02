import { Play } from "lucide-react";
import { useTranslations } from "../features/TranslationProvider";

export default function GalleryCard({
  title,
  logo,
  images = [],
  totalImages,
  eventId,
  onPhotoClick,
  onNewSearchClick,
}) {
  const { t } = useTranslations();

  if (!images || images.length === 0) {
    return null;
  }

  const displayImages = images.slice(0, 5);
  const remainingCount = totalImages - displayImages.length;

  return (
    <div className="border-b border-secondary pb-4 mb-5">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={import.meta.env.VITE_API_URL + "/" + logo}
          alt={title}
          className="rounded-full w-16 h-16 object-cover"
        />
        <h2 className="text-white text-3xl mb-0">{title}</h2>
      </div>

      <div className="flex gap-1">
        {/* Prima immagine grande a sinistra */}
        <div className="flex-1">
          <div
            className="bg-gray-900 border-0 p-0 overflow-hidden relative cursor-pointer"
            style={{ aspectRatio: "1/1", height: "100%" }}
            onClick={() => onPhotoClick(eventId)}
          >
            <img
              src={displayImages[0]?.srcThumbnail}
              alt="Gallery image 1"
              className="h-full w-full object-cover"
            />

            {/* Filtro gray se non acquistata */}
            {displayImages[0]?.isPurchased === false && (
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  backdropFilter: "grayscale(100%)",
                  WebkitBackdropFilter: "grayscale(100%)",
                }}
              />
            )}

            {displayImages[0]?.isVideo && (
              <div
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
              >
                <div className="bg-white rounded-full flex items-center justify-center w-20 h-20 opacity-90">
                  <Play size={40} className="text-gray-900 ml-1" fill="currentColor" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Griglia 2x2 a destra */}
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-1">
          {displayImages.slice(1, 5).map((image, index) => {
            const actualIndex = index + 1;
            const isLast = actualIndex === 4 && remainingCount > 0;

            return (
              <div
                key={actualIndex}
                className="bg-gray-900 border-0 p-0 overflow-hidden relative cursor-pointer"
                style={{ aspectRatio: "1/1" }}
                onClick={() => onPhotoClick(eventId)}
              >
                <img
                  src={image.srcTiny}
                  alt={`Gallery image ${actualIndex + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* Filtro gray se non acquistata */}
                {image.isPurchased === false && (
                  <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                      backdropFilter: "grayscale(100%)",
                      WebkitBackdropFilter: "grayscale(100%)",
                    }}
                  />
                )}

                {isLast && (
                  <div
                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/70"
                  >
                    <span className="text-white text-4xl">+{remainingCount}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottone Nuova Ricerca */}
      <div className="mt-4">
        <button
          className="text-white no-underline p-0 bg-transparent border-0 cursor-pointer hover:underline"
          onClick={() => onNewSearchClick(eventId)}
        >
          <i className="bi bi-search mr-2"></i>
          {t("PERSONAL_NEW_RESEARCH")}
        </button>
      </div>
    </div>
  );
}
