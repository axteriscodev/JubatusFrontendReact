import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslations } from "../features/TranslationProvider";
import { useLanguage } from "../features/LanguageContext";
import { useState } from "react";
import { apiRequest } from "../services/api-services";
import { cartActions } from "../repositories/cart/cart-slice";
import { isPhotoFullPackEligible } from "../utils/offers";

/**
 * Pulsante dello shop che visualizza il totale di spesa
 *
 * @returns {React.ReactElement}  TotalShopButton
 */
export default function TotalShopButton({ onButtonClick = null }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const totalItems = useSelector((state) => state.cart.items.length);
  const eventPreset = useSelector((state) => state.competition);
  const { t } = useTranslations();
  const { currentLanguage } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckout(event) {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const res = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/shop/create-order",
        method: "POST",
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
                    (item) => item.fileTypeId === 2 && item.purchased !== true,
                  ),
                ]
              : cart.items,
          },
          //clientUrl: import.meta.env.VITE_APP_DOMAIN,
          lang: currentLanguage.acronym,
        }),
      });

      if (!res.ok)
        throw new Error("Errore durante la creazione della sessione.");

      const result = await res.json();
      const { orderId, isFree, payments } = result.data;

      // TODO: adattare il nome del campo quando la struttura della risposta server sarà definita
      const paymentMethods = result.data.payments; // TODO: placeholder

      dispatch(cartActions.updateOrderId(orderId));

      if (isFree) {
        // Caso 3: ordine gratuito → vai direttamente alla conferma email
        navigate("/mail-confirmation", { replace: true });
      } else if (paymentMethods && paymentMethods.length > 1) {
        // Caso 2: più metodi di pagamento → scegli come pagare
        navigate("/choose-payment", {
          replace: true,
          state: { payments, orderId },
        });
      } else {
        // Caso 1: un solo metodo di pagamento (Stripe) → vai al checkout
        navigate("/checkout", {
          replace: true,
          state: { payments, orderId },
        });
      }
    } catch (error) {
      console.error("Errore:", error);
      // Fallback: naviga al checkout senza state (creerà la sessione autonomamente)
      navigate("/checkout");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      className="my-button w-3/4 fixed-bottom mx-auto mb-10"
      disabled={isLoading}
      onClick={totalItems === 0 ? onButtonClick : handleCheckout}
    >
      {totalItems === 0 ? (
        <>{t("CHECKOUT_SELECT")}</>
      ) : (
        `${t("CHECKOUT_TOTAL")}: ${eventPreset.currency === "EUR" ? `${totalPrice.toFixed(2)} ${eventPreset.currencySymbol}` : `${eventPreset.currencySymbol} ${totalPrice.toFixed(2)}`}`
      )}
    </button>
  );
}
