import { useSelector } from "react-redux";

/**
 * Pulsante dello shop che visualizza il totale di spesa
 *
 * @returns {React.ReactElement}  TotalShopButton
 */
export default function TotalShopButton() {
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  return <button className="my-button w-75 fixed-bottom mx-auto mb-sm">
    { totalPrice === 0 ? "Seleziona" : `Totale: €${totalPrice.toFixed(2)}` }
  </button>;
}
