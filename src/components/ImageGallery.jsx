import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";
import styles from "./ImageGallery.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
    <Row xs={1} md={3}>
      {images.map((image) => (
        <Col>
          <div key={image.id} onClick={() => handleImageClick(image.id)}>
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
        </Col>
      ))}
    </Row>
  );
}
