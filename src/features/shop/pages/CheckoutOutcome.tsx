import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { useNavigate } from "react-router-dom";
import { cartActions } from "../store/cart-slice";
import { useTranslations } from "@common/i18n/TranslationProvider";
import { useLanguage } from "@common/i18n/LanguageContext";
import ProgressBar from "@common/components/ProgressBar";
import { ROUTES } from "@/routes";

const PAYMENT_COMPLETE = "complete";
const PAYMENT_OPEN = "open";

export default function CheckoutOutcome() {
  const [status, setStatus] = useState<string | null>(null);
  const eventPreset = useAppSelector((state) => state.competition);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations();

  // fetch dell'esito
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");
    const orderId = urlParams.get("order_id");

    dispatch(cartActions.updateOrderId(Number(orderId)));

    fetch(
      import.meta.env.VITE_API_URL +
        `/shop/session-status?session_id=${sessionId}&order_id=${orderId}&lang=${currentLanguage.acronym}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Response(String(res.status), { status: res.status });
        }

        return res.json();
      })
      .then((data) => {
        setStatus(data.data.status);
        dispatch(cartActions.updateUserName(data.data.fullname));
      });
  }, []);

  // redirect in base all'esito
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        // il pagamento è completo, vado a richiedere le foto reali
        if (status === PAYMENT_COMPLETE) {
          if (eventPreset.preOrder)
            navigate(ROUTES.PRE_ORDER_PURCHASED);
          else
            navigate(ROUTES.MAIL_CONFIRMATION);
        }

        // il pagamento risulta ancora in sospeso, ritorno al checkout
        if (status === PAYMENT_OPEN) {
          navigate(ROUTES.CHECKOUT);
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  if (status === PAYMENT_COMPLETE) {
    return (
      <>
        <h3>{t('PAYMENT_COMPLETED')}</h3>
      </>
    );
  }

  if (status === PAYMENT_OPEN) {
    return (
      <>
        <h3>{t('ERROR')}</h3>
      </>
    );
  }

  if (!status) {
    return (
      <>
        <ProgressBar />
      </>
    );
  }

  return null;
}
