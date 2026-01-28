import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslations } from "../features/TranslationProvider";

/**
 * Pulsante dello shop che visualizza il totale di spesa
 *
 * @returns {React.ReactElement}  TotalShopButton
 */
export default function TotalShopButton({ onButtonClick = null }) {
  const navigate = useNavigate();
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const eventPreset = useSelector((state) => state.competition);
  const { t } = useTranslations();

  async function handleCheckout(event) {
    event.preventDefault();

    navigate("/checkout");
  }

  return (
    <button
      className="my-button w-75 fixed-bottom mx-auto mb-sm"
      onClick={totalPrice === 0 ? onButtonClick : handleCheckout}
    >
      {totalPrice === 0 ? (
        <>{t("CHECKOUT_SELECT")}</>
      ) : (
        `${t("CHECKOUT_TOTAL")}: ${eventPreset.currency === "EUR" ? `${totalPrice.toFixed(2)} ${eventPreset.currencySymbol}` : `${eventPreset.currencySymbol} ${totalPrice.toFixed(2)}`}`
      )}
    </button>
  );
}
