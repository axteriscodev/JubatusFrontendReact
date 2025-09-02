import React, { useCallback } from "react";
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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

/**
 * Pagina per il checkout
 */
export default function Checkout() {
  const cart = useSelector((state) => state.cart);
  const eventPreset = useSelector((state) => state.competition);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslations();

  const buttonHandle = (event) => {
    if (eventPreset.preOrder) navigate("/pre-order");
    else navigate("/image-shop/");
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
            searchId: cart.searchId,
            allPhotos: cart.allPhotos,
            video: cart.video,
            amount: cart.totalPrice,
            items: isPhotoFullPackEligible(cart.totalPrice, cart.prices)
              ? [
                  ...cart.products.filter(
                    (item) => item.fileTypeId === 1 && item.purchased !== true
                  ),
                  ...cart.items.filter(
                    (item) => item.fileTypeId === 2 && item.purchased !== true
                  ),
                ]
              : cart.items,
          },
          clientUrl: import.meta.env.VITE_APP_DOMAIN,
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
        dispatch(cartActions.updateOrderId(data.data.orderId));
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
        {t('CHECKOUT_BACK')}
      </button>
    </>
  );
}
