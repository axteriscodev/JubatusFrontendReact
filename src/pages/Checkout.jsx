import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51R7ZQMFm5H2oHbnITXHTB2tvocnsDLNEpgeDSCpM77uVAQVND3IdEMV79tEP3bNnpcXUdVmJkbUB6fYrra5arv7V00c2972u5n"
);

/**
 * Pagina per il checkout
 */
export default function Checkout() {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/create-checkout-session", {
      method: "POST",ƒ
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
