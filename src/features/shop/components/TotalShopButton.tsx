import { useNavigate } from "react-router-dom";
import { useState, type MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { useTranslations } from "@common/i18n/TranslationProvider";
import { useLanguage } from "@common/i18n/LanguageContext";
import { apiRequest } from "@common/services/api-services";
import { cartActions } from "../store/cart-slice";
import { isPhotoFullPackEligible } from "@common/utils/offers";
import { ROUTES } from "@/routes";

interface TotalShopButtonProps {
  onButtonClick?: (() => void) | null;
}

export default function TotalShopButton({ onButtonClick = null }: TotalShopButtonProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const totalPrice = useAppSelector((state) => state.cart.totalPrice);
  const totalItems = useAppSelector((state) => state.cart.items.length);
  const eventPreset = useAppSelector((state) => state.competition);
  const { t } = useTranslations();
  const { currentLanguage } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckout(event: MouseEvent) {
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
            allClips: cart.allClips,
            video: cart.video,
            amount: cart.totalPrice,
            items: isPhotoFullPackEligible(cart.totalPrice, cart.prices)
              ? [
                  ...cart.products.filter(
                    (item) => item.fileTypeId === 1 && item.purchased !== true,
                  ),
                  ...cart.items.filter(
                    (item) => item.fileTypeId === 2,
                  ),
                ]
              : cart.items,
          },
          lang: currentLanguage.acronym,
        }),
        needAuth: true,
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
        navigate(ROUTES.MAIL_CONFIRMATION, { replace: true });
      } else if (paymentMethods && paymentMethods.length > 1) {
        // Caso 2: più metodi di pagamento → scegli come pagare
        navigate(ROUTES.CHOOSE_PAYMENT, {
          replace: true,
          state: { payments, orderId },
        });
      } else {
        // Caso 1: un solo metodo di pagamento (Stripe) → vai al checkout
        navigate(ROUTES.CHECKOUT, {
          replace: true,
          state: { paymentId: payments[0].id, orderId },
        });
      }
    } catch (error) {
      console.error("Errore:", error);
      // Fallback: naviga al checkout senza state (creerà la sessione autonomamente)
      navigate(ROUTES.CHECKOUT);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      className="my-button w-3/4 fixed-bottom mx-auto mb-10"
      disabled={isLoading}
      onClick={totalItems === 0 ? onButtonClick ?? undefined : handleCheckout}
    >
      {totalItems === 0 ? (
        <>{t("CHECKOUT_SELECT")}</>
      ) : (
        `${t("CHECKOUT_TOTAL")}: ${eventPreset.currency === "EUR" ? `${totalPrice.toFixed(2)} ${eventPreset.currencySymbol}` : `${eventPreset.currencySymbol} ${totalPrice.toFixed(2)}`}`
      )}
    </button>
  );
}
