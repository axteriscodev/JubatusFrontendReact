import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";

const stripePromise = loadStripe(
  "pk_test_51R7ZQMFm5H2oHbnITXHTB2tvocnsDLNEpgeDSCpM77uVAQVND3IdEMV79tEP3bNnpcXUdVmJkbUB6fYrra5arv7V00c2972u5n"
);

/**
 * Pagina per il checkout
 */
export default function Checkout() {
  const cart = useSelector((state) => state.cart);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("http://localhost:8080/shop/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Indica che inviamo dati JSON
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
      .then((data) => data.data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
