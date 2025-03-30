import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/**
 * Pulsante dello shop che visualizza il totale di spesa
 *
 * @returns {React.ReactElement}  TotalShopButton
 */
export default function TotalShopButton() {
  const navigate = useNavigate();
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  async function handleCheckout(event) {
    event.preventDefault();

    navigate("/checkout");
  }

  return (
    <button
      className="my-button w-75 fixed-bottom mx-auto mb-sm"
      onClick={handleCheckout}
    >
      {totalPrice === 0 ? "Seleziona" : `Totale: €${totalPrice.toFixed(2)}`}
    </button>
  );
}
