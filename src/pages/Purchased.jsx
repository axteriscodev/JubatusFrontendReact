import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";

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
    { id: 1, src: "/tmp/istockphoto-500645381-1024x1024.jpg" },
    { id: 2, src: "/tmp/istockphoto-535967907-1024x1024.jpg" },
    { id: 3, src: "/tmp/istockphoto-636828120-1024x1024.jpg" },
    { id: 4, src: "/tmp/istockphoto-852157310-1024x1024.jpg" },
    { id: 5, src: "/tmp/istockphoto-936552298-1024x1024.jpg" },
    { id: 6, src: "/tmp/istockphoto-961494108-1024x1024.jpg" },
    { id: 7, src: "/tmp/istockphoto-139877917-1024x1024.jpg" },
    { id: 8, src: "/tmp/istockphoto-1139730571-1024x1024.jpg" },
  ];

  return <></>;
}
