import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslations } from "../features/TranslationProvider";
import ProgressBar from "../components/ProgressBar";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

/**
 * Pagina per il checkout
 */
export default function Checkout() {
  const location = useLocation();
  const receivedData = location.state;
  const eventPreset = useSelector((state) => state.competition);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslations();

  const [checkoutData, setCheckoutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const buttonHandle = () => {
    if (eventPreset.preOrder) navigate("/pre-order");
    else navigate("/image-shop/");
  };

  const checkoutResponse = useCallback(async () => {
    // Create a Checkout Session
    const jsonBody = JSON.stringify({
      orderId: receivedData.orderId,
      paymentId: receivedData.payments[0].id,
      clientUrl: import.meta.env.VITE_APP_DOMAIN,
    });
    const res = await fetch(
      import.meta.env.VITE_API_URL + "/shop/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonBody,
      },
    );
    if (!res.ok) {
      throw Response(
        JSON.stringify({ status: res.status, message: res.message }),
      );
    }
    const data = await res.json();
    dispatch(cartActions.updateOrderId(data.data.orderId));
    return {
      clientSecret: data.data.clientSecret,
      orderId: data.data.orderId,
    };
  }, [dispatch, receivedData]);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        setIsLoading(true);

        if (receivedData?.clientSecret && receivedData?.orderId) {
          // Sessione già creata da TotalShopButton, usa i dati ricevuti
          dispatch(cartActions.updateOrderId(receivedData.orderId));
          setCheckoutData({
            clientSecret: receivedData.clientSecret,
            orderId: receivedData.orderId,
          });
        } else {
          // Fallback: crea la sessione autonomamente (flusso PreOrder, retry, ecc.)
          const data = await checkoutResponse();
          setCheckoutData(data);
        }

        setError(null);
      } catch (err) {
        console.error("Checkout error:", err);
        setError(err.message || "Errore durante il checkout");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckoutData();
  }, []);

  // Loading state
  if (isLoading) {
    return <ProgressBar />;
  }

  // Error state
  if (error) {
    return (
      <>
        <div className="alert alert-danger" role="alert">
          <h3>{t("ERROR")}</h3>
          <p>{error}</p>
        </div>
        <button className="my-button w-100 mt-sm" onClick={buttonHandle}>
          {t("CHECKOUT_BACK")}
        </button>
      </>
    );
  }

  // Paid order - mostra Stripe checkout
  if (checkoutData?.clientSecret) {
    const options = {
      clientSecret: checkoutData.clientSecret,
    };

    return (
      <>
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
        <button className="my-button w-full mt-10" onClick={buttonHandle}>
          {t("CHECKOUT_BACK")}
        </button>
      </>
    );
  }

  // Fallback
  return null;
}
