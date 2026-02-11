import { useTranslations } from "../features/TranslationProvider";
import { useNavigate, useLocation } from "react-router-dom";

export default function ChoosePayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslations();

  const receivedData = location.state;

  // TODO: adattare i nomi dei campi quando la struttura della risposta server sarà definita
  const paymentMethods = receivedData?.payments ?? [];
  const orderId = receivedData?.orderId;

  function handleSelect(id) {
    navigate("/checkout", {
      state: { orderId, paymentId: id },
    });
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
    <div className="form-sm justify-center gap-4 px-6">
      {/* TODO: aggiungere chiave di traduzione per "Scegli metodo di pagamento" */}
      <p className="text-center text-xl font-semibold mb-2">
        Scegli come pagare
      </p>

      {/* TODO: iterare dinamicamente su paymentMethods quando la struttura sarà nota */}
      <button
        className="my-button w-full py-5 text-lg tracking-wide shadow-md"
        onClick={() => handleSelect(paymentMethods[0].id)}
      >
        {/* TODO: usare la chiave di traduzione corretta */}
        Paga con Stripe
      </button>

      <button
        className="my-button w-full py-5 text-lg tracking-wide shadow-md"
        onClick={() => handleSelect(paymentMethods[1].id)}
      >
        {/* TODO: usare la chiave di traduzione corretta */}
        Paga alla cassa
      </button>
    </div>
  );
}
