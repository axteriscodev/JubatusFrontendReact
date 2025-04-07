import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

export default function CustomLightbox({
  open,
  slides,
  index,
  setIndex,
  select,
  actions,
  onClose,
  onImageClick,
  photoItems,
}) {
  const currentImage = slides[index];

  const isSelected = photoItems.some(
    (el) => el.keyPreview === currentImage.keyPreview
  );

  const handleFavouriteClick = (image) => alert(`Favourite: ${image.url}`);
  const handleDownloadClick = (image) => alert(`Download: ${image.url}`);
  const handleShareClick = (image) => alert(`Share: ${image.url}`);

  return (
    <Lightbox
      styles={{ container: { backgroundColor: "var(--overlay)" } }}
      open={open}
      close={onClose}
      index={index}
      on={{
        view: ({ index: newIndex }) => setIndex(newIndex),
      }}
      slides={slides.map((image) => ({
        src: image.url,
        id: image.keyPreview,
      }))}
      plugins={[Thumbnails]}
      render={{
        slideHeader: () =>
          select && (
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "80px",
                zIndex: 1000,
              }}
            >
              <button
                onClick={() => onImageClick(currentImage.keyPreview)}
                className={`my-button ${isSelected ? "remove" : "add"}`}
              >
                <i className="bi bi-cart"></i> {isSelected ? "Rimuovi" : "Seleziona"}
              </button>
            </div>
          ),
        slideFooter: () =>
          actions && (
            <div className="text-50 d-flex gap-3 justify-content-between position-absolute bottom-0 start-50 translate-middle-x">
              <a onClick={() => handleFavouriteClick(currentImage)} aria-label="Favourite image">
                <i className="bi bi-heart-fill text-danger"></i>
              </a>
              <a onClick={() => handleDownloadClick(currentImage)} aria-label="Download image">
                <i className="bi bi-arrow-up"></i>
              </a>
              <a onClick={() => handleShareClick(currentImage)} aria-label="Share image">
                <i className="bi bi-arrow-up-right"></i>
              </a>
            </div>
          ),
      }}
    />
  );
}
