import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";

import Carousel from 'react-bootstrap/Carousel';
import ImageGallery from "../components/ImageGallery";
import Lightbox from "yet-another-react-lightbox";

export default function Personal() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState(false);
  const [actions, setActions] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  const handleImageClick = (imageKey) => {
    if (photoItems.some((element) => element.key === imageKey)) {
      dispatch(cartActions.removeItemFromCart(imageKey));
    } else {
      dispatch(cartActions.addItemToCart(imageKey));
    }
    setOpen(false);
  };

  const photoItems = useSelector((state) => state.cart.items);

  const handleFavouriteClick = (image) => {
    alert(`Favourite: ${image.url}`);
  }

  const handleDownloadClick = (image) => {
    alert(`Download: ${image.url}`);
  }

  const handleShareClick = (image) => {
    alert(`Share: ${image.url}`);
  }

  const openLightbox = (images, startIndex = 0, select, actions) => {
    setIndex(startIndex);
    setOpen(true);
    setSlides(images);
    setSelect(select);
    setActions(actions);
  };

  const imageList = [
    { key: 1, url: "/tmp/istockphoto-500645381-1024x1024.jpg" },
    { key: 2, url: "/tmp/istockphoto-535967907-1024x1024.jpg" },
    { key: 3, url: "/tmp/istockphoto-636828120-1024x1024.jpg" },
  ];

  const imageList2 = [
    { key: 4, url: "/tmp/istockphoto-852157310-1024x1024.jpg" },
    { key: 5, url: "/tmp/istockphoto-936552298-1024x1024.jpg" },
    { key: 6, url: "/tmp/istockphoto-961494108-1024x1024.jpg" },
    { key: 7, url: "/tmp/istockphoto-139877917-1024x1024.jpg" },
    { key: 8, url: "/tmp/istockphoto-1139730571-1024x1024.jpg" },
  ];

  return (
    <>
      <div className="container">
        <h2 className="my-sm">Ecco i tuoi acquisti!</h2>
        <div className="px-lg">
          <Carousel>
          {imageList.map((image, i) => (
            <Carousel.Item>
              <div className="ratio ratio-1-1">
                <img src={image.url} className="d-block w-100 object-fit-cover" alt="..." onClick={() => openLightbox(imageList, i, false, true)} />
              </div>
            </Carousel.Item>
            ))}
          </Carousel>
        </div>
        <div className="mt-md">
          <ImageGallery images={imageList2} select={false} actions={true} onOpenLightbox={openLightbox} onImageClick={handleImageClick} photoItems={photoItems} />
        </div>
      </div>

      {open && (
        <Lightbox
          styles={{ container: { backgroundColor: "var(--overlay)" } }}
          open={open}
          close={() => setOpen(false)}
          index={index}
          on={{
            view: ({ index: newIndex }) => setIndex(newIndex),
          }}
          slides={slides.map((image) => ({
            src: image.url,
            id: image.key,
          }))}
          render={{
            slideHeader: () => {
              if (!select) return null;

              const image = slides[index];
              const isSelected = photoItems.some((el) => el.key === image.key);
        
              return (
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "80px",
                    zIndex: 1000,
                  }}
                >
                  <button
                    onClick={() => handleImageClick(image.key)}
                    className={`my-button ${isSelected ? "remove" : "add"}`}
                  >
                    <i className='bi bi-cart'></i> {isSelected ? "Rimuovi" : "Seleziona"}
                  </button>
                </div>
              );
            },
            slideFooter: () => {
              if (!actions) return null;

              const image = slides[index];

              return (
                <div className="text-50 d-flex gap-3 justify-content-between position-absolute bottom-0 start-50 translate-middle-x">
                  <a
                    onClick={() => handleFavouriteClick(image)}
                    aria-label="Favourite image"
                  >
                    <i className="bi bi-heart-fill text-danger"></i>
                  </a>
                  <a
                    onClick={() => handleDownloadClick(image)}
                    aria-label="Download image"
                  >
                    <i className="bi bi-arrow-up"></i>
                  </a>
                  <a
                    onClick={() => handleShareClick(image)}
                    aria-label="Share image"
                  >
                    <i className="bi bi-arrow-up-right"></i>
                  </a>
                </div>
              );
            }
          }}
        />         
      )}
    </>
  );
}