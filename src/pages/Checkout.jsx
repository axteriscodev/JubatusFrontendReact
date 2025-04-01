import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

/**
 * Pagina per il checkout
 */
export default function Checkout() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch(
      import.meta.env.VITE_API_URL + '/shop/create-checkout-session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
