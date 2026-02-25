import { useState, useEffect } from "react";
import { useAppSelector } from "@common/store/hooks";
import { apiRequest } from "@common/services/api-services";
import { useTranslations } from "@common/i18n/TranslationProvider";
import parse from 'html-react-parser';
import { useLanguage } from "@common/i18n/LanguageContext";

export default function ThankYou() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0); // timer in secondi
  const userEmail = useAppSelector((state) => state.cart.userEmail);
  const orderId = useAppSelector((state) => state.cart.id);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations();

  //re-invio dell email di accesso
  const handleResend = async () => {
    setLoading(true);
    setMessage("");

    try {
      const body = JSON.stringify({ userEmail: userEmail, orderId: orderId, lang: currentLanguage.acronym });
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
      <h2 className="text-center">{parse(t('PURCHASE_TITLE'))}</h2>
      <p className="max-4">
        {parse(t('PURCHASE_TITLE'))} <br />
        {parse(t('PURCHASE_ACCESS').replace('$email', userEmail))}
      </p>

      <div className="mt-20 max-4">
        <p>{parse(t('PURCHASE_EMAIL'))}</p>
        <button
          className="my-button w-full"
          onClick={handleResend}
          disabled={loading || cooldown > 0}
        >
          {loading
            ? t('WAITING_SEND')
            : cooldown > 0
            ? `${t('WAITING_WAIT')} ${cooldown}s`
            : t('PURCHASE_LINK')}
        </button>
        {message && <p className="mt-10">{message}</p>}
      </div>
    </div>
  );
}
