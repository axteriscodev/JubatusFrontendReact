import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../services/api-services";
import { useTranslations } from "../features/TranslationProvider";
import parse from 'html-react-parser';

export default function ThankYou() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0); // timer in secondi
  const userEmail = useSelector((state) => state.cart.userEmail);
  const orderId = useSelector((state) => state.cart.id);
  const { t } = useTranslations();

  const submitHandle = (event) => {
    navigate("/");
  };

  //re-invio dell email di accesso
  const handleResend = async () => {
    setLoading(true);
    setMessage("");

    try {
      const body = JSON.stringify({ userEmail: userEmail, orderId: orderId });
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/customer/resend-link",
        method: "POST",
        body: body,
      });

      if (response.ok) {
        setMessage("Un nuovo link è stato inviato alla tua email.");
        setCooldown(60); // blocco per 60 secondi
      } else {
        setMessage("Errore nell'invio dell'email. Riprova più tardi.");
      }
    } catch (error) {
      setMessage("Errore di rete. Controlla la connessione.");
    } finally {
      setLoading(false);
    }
  };

  // Decrementa cooldown ogni secondo
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Cancella il messaggio alla fine del timer
  useEffect(() => {
    if (cooldown === 0) {
      setMessage("");
    }
  }, [cooldown]);

  return (
    <div className="form-sm">
      <h2 className="text-center">{t('PURCHASE_TITLE')}</h2>
      <p className="max-4">
        {t('PURCHASE_TITLE')} <br />
        {parse(t('PURCHASE_ACCESS').replace('$email', userEmail))}
      </p>
      {/* <button
        className="my-button w-100 mt-sm"
        onClick={(event) => submitHandle(event)}
      >
        Vai all'area riservata
      </button> */}

      <div className="mt-md max-4">
        <p>{t('PURCHASE_EMAIL')}</p>
        <button
          className="my-button w-100"
          onClick={handleResend}
          disabled={loading || cooldown > 0}
        >
          {loading
            ? "Invio in corso..."
            : cooldown > 0
            ? `Attendi ${cooldown}s`
            : "Rigenera link"}
        </button>
        {message && <p className="mt-sm">{message}</p>}
      </div>
    </div>
  );
}
