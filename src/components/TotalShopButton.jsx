import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslations } from "../features/TranslationProvider";
import { useState } from "react";
import { apiRequest } from "../services/api-services";

/**
 * Pulsante dello shop che visualizza il totale di spesa
 *
 * @returns {React.ReactElement}  TotalShopButton
 */
export default function TotalShopButton({ onButtonClick = null }) {
  const navigate = useNavigate();
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const totalItems = useSelector((state) => state.cart.items.length);
  const eventPreset = useSelector((state) => state.competition);
  const { t } = useTranslations();

  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckout(event) {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/auth/manage-external-payment",
        method: "GET",
        needAuth: true,
      });

      if (!response.ok)
        throw new Error("Errore durante la verifica dei permessi.");

      const result = await response.json();

      // Logica di reindirizzamento basata sulla risposta del server
      if (result.data?.canManageExternalPayments) {
        navigate("/choose-payment"); // Sostituisci con la rotta desiderata
      } else {
        navigate("/checkout");
      }
    } catch (error) {
      console.error("Errore:", error);
      // In caso di errore, puoi decidere se mandarlo comunque al checkout o mostrare un avviso
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
