import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";

const stripePromise = loadStripe(
  "pk_test_51R7ZQMFm5H2oHbnITXHTB2tvocnsDLNEpgeDSCpM77uVAQVND3IdEMV79tEP3bNnpcXUdVmJkbUB6fYrra5arv7V00c2972u5n"
);

/**
 * Pagina per il checkout
 */
export default function Checkout() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("http://localhost:8080/shop/create-checkout-session", {
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
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(cartActions.updateOrderId(data.data.oderId));
        return data.data.clientSecret;
      });
  }, []);

  const options = { fetchClientSecret };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
