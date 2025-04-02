import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";
import Lightbox from "yet-another-react-lightbox";
//import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import styles from "./ImageGallery.module.css";

export default function ImageGallery({ images, select = true, actions = false }) {
  const dispatch = useDispatch();
  const photoItems = useSelector((state) => state.cart.items);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const handleImageClick = (imageKey) => {
    if (photoItems.some((element) => element.key === imageKey)) {
      dispatch(cartActions.removeItemFromCart(imageKey));
    } else {
      dispatch(cartActions.addItemToCart(imageKey));
    }
  };

  const handleDownloadClick = (image) => {
    alert(`Download: ${image.url}`);
  }

  const handleShareClick = (image) => {
    alert(`Share: ${image.url}`);
  }

  const zoom = (i) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <>
      <div className="row row-cols-3 row-cols-md-4 row-cols-lg-5 gx-0">
        {images.map((image, i) => (
          <div className="gallery" key={image.key}>
            <div
              onClick={() =>
                photoItems.length === 0 ? zoom(i) : handleImageClick(image.key)
              }
              className="ratio ratio-1-1"
            >
              <div className={`${styles.foto} ${
                photoItems.some((el) => el.key === image.key) ? styles.selected : ""
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

      {open && (
        <Lightbox
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .95)" } }}
        open={open}
        close={() => setOpen(false)}
        index={index}
        on={{
          view: ({ index: newIndex }) => setIndex(newIndex),
        }}
        slides={images.map((image) => ({
          src: image.url,
          id: image.key,
        }))}
        /*plugins={[Thumbnails]}*/
        render={{
          slideHeader: () => {
            if (!select) return null;

            const image = images[index];
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
                  {isSelected ? "Rimuovi" : "Aggiungi al carrello"}
                </button>
              </div>
            );
          },
          slideFooter: () => {
            if (!actions) return null;

            const image = images[index];

            return (
              <div className={styles['actions-cnt']}>
                <a
                  onClick={() => handleDownloadClick(image)}
                  aria-label="Download image"
                >
                  <img src="/images/box-arrow-down.svg" alt="Download" />
                </a>
                <a
                  onClick={() => handleShareClick(image)}
                  aria-label="Share image"
                >
                  <img src="/images/arrow-up-right.svg" alt="Share" />
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
