import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../repositories/cart/cart-slice";
import { useNavigate } from "react-router-dom";
import { isPhotoFullPackEligible } from "../utils/offers";
import { useTranslations } from "../features/TranslationProvider";
import { useLanguage } from "../features/LanguageContext";
import ProgressBar from "../components/ProgressBar";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

/**
 * Pagina per il checkout
 */
export default function Checkout() {
  const cart = useSelector((state) => state.cart);
  const eventPreset = useSelector((state) => state.competition);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
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
    const res = await fetch(
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
            searchId: cart.searchId,
            allPhotos: cart.allPhotos,
            video: cart.video,
            amount: cart.totalPrice,
            items: isPhotoFullPackEligible(cart.totalPrice, cart.prices)
              ? [
                  ...cart.products.filter(
                    (item) => item.fileTypeId === 1 && item.purchased !== true,
                  ),
                  ...cart.items.filter(
                    (item_1) =>
                      item_1.fileTypeId === 2 && item_1.purchased !== true,
                  ),
                ]
              : cart.items,
          },
          clientUrl: import.meta.env.VITE_APP_DOMAIN,
          lang: currentLanguage.acronym,
        }),
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
      isFree: data.data.isFree,
    };
  }, [cart, currentLanguage, dispatch]);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        setIsLoading(true);
        const data = await checkoutResponse();
        setCheckoutData(data);
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

  useEffect(() => {
    if (checkoutData?.isFree === true) {
      navigate("/mail-confirmation");
    }
  }, [checkoutData, navigate]);

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

  // Free order - mostra messaggio temporaneo prima del redirect
  if (checkoutData?.isFree === true) {
    return (
      <>
        <h3>{t("CHECKOUT_FREE_ORDER")}</h3>
        <ProgressBar />
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
        <button className="my-button w-100 mt-sm" onClick={buttonHandle}>
          {t("CHECKOUT_BACK")}
        </button>
      </>
    );
  }

  // Fallback
  return null;
}
