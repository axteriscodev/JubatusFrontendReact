//import { useDispatch } from "react-redux";
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
  onUpdateSlide = null,
  onImageClick = null,
  photoItems =  null,
}) {
  //const dispatch = useDispatch();
  
  const currentImage = slides[index] ?? 0;

  const isSelected = photoItems?.some(
    (el) => el.keyPreview === (currentImage.keyPreview || currentImage.keyThumbnail || currentImage.keyOriginal)
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
      const updatedSlide = {
        ...currentImage,
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
  
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1]?.split('?')[0] || `image`;
  
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
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
        view: ({ index: newIndex }) => setIndex(newIndex),
      }}
      slides={slides.map((image) => ({
        src: image.urlPreview || image.urlThumbnail || image.url,
        id: image.keyPreview || image.keyThumbnail || image.keyOriginal,
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
                onClick={() => onImageClick?.(currentImage.keyPreview || currentImage.keyThumbnail)}
                className={`my-button ${isSelected ? "remove" : "add"}`}
              >
                <i className="bi bi-cart"></i> {isSelected ? "Rimuovi" : "Seleziona"}
              </button>
            </div>
          ),
        slideFooter: () =>
          actions && (
            <div className="text-50 d-flex gap-3 justify-content-between position-absolute bottom-0 start-50 translate-middle-x">
              <a onClick={handleFavouriteClick} aria-label="Favourite image">
                <i className={`bi ${currentImage.favorite ? "bi-heart-fill text-danger" : "bi-heart text-white"}`}></i>
              </a>
              <a
                onClick={handleDownload}
                title="Download"
                aria-label="Download image"
              >
                <i className="bi bi-box-arrow-down text-white"></i>
              </a>
              {/* {<a onClick={() => handleShareClick(currentImage)} aria-label="Share image">
                <i className="bi bi-arrow-up-right"></i>
              </a>} */}
            </div>
          ),
      }}
    />
  );
}
