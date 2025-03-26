import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";

/**
 * Pulsante dello shop che visualizza il totale di spesa
 *
 * @returns {React.ReactElement}  TotalShopButton
 */
export default function TotalShopButton() {
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  return <Button variant="primary" size="lg">
    { totalPrice === 0 ? "Seleziona" : `Totale: €${totalPrice.toFixed(2)}` }
  </Button>;
}
