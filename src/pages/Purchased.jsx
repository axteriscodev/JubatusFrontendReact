import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";
import Logo from "../components/Logo";
import ImageGallery from "../components/ImageGallery";

/**
 * Pagina con le foto/video appena acquistati
 *
 * @returns {React.ReactElement}  Pagina con le foto/video appena acquistati.
 */
export default function Purchased() {
  const orderId = useSelector((state) => state.cart.id);
  const purchasedItems = useSelector((state) => state.cart.purchased);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("http://localhost:8080/shop/purchased-contents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
      }),
    })
      .then((res) => res.json())
      .then((data) =>
        dispatch(cartActions.setPurchasedItems(data.message.contents))
      );
  }, []);

  const imageList = [
    { id: 1, src: "/tmp/istockphoto-500645381-1024x1024.jpg", key: 11 },
    { id: 2, src: "/tmp/istockphoto-535967907-1024x1024.jpg", key: 12 },
    { id: 3, src: "/tmp/istockphoto-636828120-1024x1024.jpg", key: 13 },
    { id: 4, src: "/tmp/istockphoto-852157310-1024x1024.jpg", key: 14 },
    { id: 5, src: "/tmp/istockphoto-936552298-1024x1024.jpg", key: 15 },
    { id: 6, src: "/tmp/istockphoto-961494108-1024x1024.jpg", key: 16 },
    { id: 7, src: "/tmp/istockphoto-139877917-1024x1024.jpg", key: 17 },
    { id: 8, src: "/tmp/istockphoto-1139730571-1024x1024.jpg", key: 18 },
  ];

  return (
  <>
    <div className="text-start"><Logo size="logo-xs" /></div>
    <h2 className="my-sm">Ecco i tuoi acquisti!</h2>

    <div id="carouselExample" className="carousel slide">
      <div className="carousel-inner">
      {imageList.map((image, i) => (
        <div className={`carousel-item ${i == 0 ? "active" : ""}`} key={image.id}>
          <img src={image.src} className="d-block w-100" alt="..."/>
        </div> 
      ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
    <div className="mt-md">
      <ImageGallery images={imageList} select={false} />
    </div>
  </>
  )
}
