import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PAYMENT_COMPLETE = "complete";
const PAYMENT_OPEN = "open";

export default function CheckoutOutcome() {
  const [status, setStatus] = useState(null);
  const orderId = useSelector((state) => state.cart.id);
  const navigate = useNavigate();

  // fetch dell'esito
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");  
    const orderId = urlParams.get("order_id");

    console.log(`/shop/session-status?session_id=${sessionId}&order_id=${orderId}`);

    fetch(
      import.meta.env.VITE_API_URL +
        `/shop/session-status?session_id=${sessionId}&order_id=${orderId}`
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
        setStatus(data.data.status);
        //setCustomerEmail(data.customer_email);
      });
  }, []);

  // redirect in base all'esito
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        // il pagamento è completo, vado a richiedere le foto reali
        if (status === PAYMENT_COMPLETE) {
          navigate("/processing-photos");
        }

        // il pagamento risulta ancora in sospeso, ritorno al checkout
        if (status === PAYMENT_OPEN) {
          navigate("/checkout");
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  if (status === PAYMENT_COMPLETE) {
    return (
      <>
        <h3>Pagamento completato</h3>
      </>
    );
  }

  if (status === PAYMENT_OPEN) {
    return (
      <>
        <h3>Qualcosa è andato storto</h3>
      </>
    );
  }

  if (!status) {
    return <></>;
  }
}
