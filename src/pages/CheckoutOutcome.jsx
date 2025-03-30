import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function CheckoutOutcome() {
  const [status, setStatus] = useState(null);
  const orderId = useSelector((state) => state.cart.id);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetch(
      `http://localhost:8080/shop/session-status?session_id=${sessionId}&order_id=${orderId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.data.status);
        //setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === "complete") {
    return (
      <>
        <h3>Pagamento completato</h3>
      </>
    );
  }

  if (status === "open") {
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
