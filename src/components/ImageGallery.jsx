import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import styles from "./ImageGallery.module.css";

export default function ImageGallery({ images }) {
  const dispatch = useDispatch();
  const photoItems = useSelector((state) => state.cart.items);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const handleImageClick = (imageId) => {
    if (photoItems.some((element) => element.id === imageId)) {
      dispatch(cartActions.removeItemFromCart({ id: imageId }));
    } else {
      dispatch(cartActions.addItemToCart({ id: imageId }));
    }
  };

  const zoom = (i) => {
    setIndex(i);
    setOpen(true);
  };

  const slides = images.map((img) => ({ src: img.src }));

  return (
    <>
      <div className="row row-cols-3 row-cols-md-4 row-cols-lg-5 gx-0">
        {images.map((image, i) => (
          <div className="gallery" key={image.id}>
            <div
              onClick={() =>
                photoItems.length === 0 ? zoom(i) : handleImageClick(image.id)
              }
              className="ratio ratio-1-1 bg-white"
            >
              <div
                className={`${styles.foto} ${
                  photoItems.some((el) => el.id === image.id) ? styles.selected : ""
                }`}
                style={{
                  backgroundImage: `url(${image.src})`,
                  backgroundRepeat: "no-repeat",
                  backgroundAttachment: "scroll",
                  backgroundPosition: "0px 100%",
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
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Thumbnails]}
        render={{
          slideHeader: () => {
            const image = images[index];
            const isSelected = photoItems.some((el) => el.id === image.id);      
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
                  onClick={() => handleImageClick(image.id)}
                  style={{
                    padding: "10px 16px",
                    background: isSelected ? "#dc3545" : "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  {isSelected ? "Rimuovi" : "Seleziona"}
                </button>
              </div>
            );
          },
        }}
      />
      )}
    </>
  );
}
