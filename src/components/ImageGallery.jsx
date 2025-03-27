import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";
import styles from "./ImageGallery.module.css";

export default function ImageGallery({ images }) {
  const dispatch = useDispatch();
  const photoItems = useSelector((state) => state.cart.items);

  const handleImageClick = (imageId) => {
    if (photoItems.some((element) => element.id === imageId)) {
      dispatch(cartActions.removeItemFromCart({ id: imageId }));
    } else {
      dispatch(cartActions.addItemToCart({ id: imageId }));
    }
  };

  return (
    <div className="row row-cols-3 row-cols-md-4 row-cols-lg-5 gx-0">
      {images.map((image) => (
        <div id="gallery">
          <div key={image.id} onClick={() => handleImageClick(image.id)} className="ratio ratio-2-3 bg-grey">
            <img
              src={image.src}
              alt={`Image ${image.id}`}
              className={
                photoItems.some((element) => element.id === image.id)
                  ? styles.selected
                  : ""
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}
