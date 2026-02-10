import { useTranslations } from "../features/TranslationProvider";
import { useNavigate, useLocation } from "react-router-dom";

export default function ChoosePayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslations();

  const receivedData = location.state;
  // TODO: adattare i nomi dei campi quando la struttura della risposta server sarà definita
  const paymentMethods = receivedData?.paymentMethods ?? [];
  const orderId = receivedData?.orderId;
  const clientSecret = receivedData?.clientSecret;

  function handleSelectStripe() {
    navigate("/checkout", {
      state: { clientSecret, orderId },
    });
  }

  function handleSelectCounter() {
    // TODO: potrebbe servire una chiamata al backend per confermare il pagamento alla cassa
    navigate("/pay-at-counter");
  }

  // TODO: aggiungere handler per altri metodi di pagamento

  if (!receivedData || paymentMethods.length === 0) {
    return (
      <div className="form-sm">
        <div className="alert alert-danger" role="alert">
          <h3>{t("ERROR")}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="form-sm">
      {/* TODO: aggiungere chiave di traduzione per "Scegli metodo di pagamento" */}

      {/* TODO: iterare dinamicamente su paymentMethods quando la struttura sarà nota */}
      {paymentMethods.includes("stripe") && (
        <button
          className="my-button w-100 mt-sm"
          onClick={handleSelectStripe}
        >
          {/* TODO: usare la chiave di traduzione corretta */}
          Paga con carta
        </button>
      )}

      {paymentMethods.includes("counter") && (
        <button
          className="my-button w-100 mt-sm"
          onClick={handleSelectCounter}
        >
          {/* TODO: usare la chiave di traduzione corretta */}
          Paga alla cassa
        </button>
      )}
    </div>
  );
}
