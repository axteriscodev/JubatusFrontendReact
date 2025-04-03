import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

/**
 * Pagina per il checkout
 */
export default function Checkout() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const buttonHandle = (event) => {
    navigate("/image-shop/");
  };

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch(
      import.meta.env.VITE_API_URL + "/shop/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: {
            userId: cart.userId,
            eventId: cart.eventId,
            amount: cart.totalPrice,
            items: cart.items,
          },
        }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw Response(
            JSON.stringify({ status: res.status, message: res.message })
          );
        }

        return res.json();
      })
      .then((data) => {
        dispatch(cartActions.updateOrderId(data.data.oderId));
        return data.data.clientSecret;
      });
  }, []);

  const options = { fetchClientSecret };

  return (
    <>
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
    <button className="my-button w-100 mt-sm" onClick={buttonHandle}>
        Torna allo store
      </button>
    </>
  );
}
