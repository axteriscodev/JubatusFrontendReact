import Logo from "@common/components/Logo";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { useNavigate } from "react-router-dom";
import { cartActions } from "@features/shop/store/cart-slice";
import { setUiPreset, } from "@common/utils/graphics";
import ProgressBar from "@common/components/ProgressBar";
import { useTranslations } from "@common/i18n/TranslationProvider";
import parse from 'html-react-parser';
import { useTimeoutRedirect } from "@common/hooks/useTimeoutRedirect";
import { useSSEListener } from "@common/hooks/useSSEListener";
import { useEffect } from "react";
import { API } from "@common/services/api-endpoints";
import { ROUTES } from "@/routes";
import { personalActions } from "@/features/user/store/personal-slice";

export default function ProcessingPhotos() {
  const eventPreset = useAppSelector((state) => state.competition);
  const orderId = useAppSelector((state) => state.cart.id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslations();

  useEffect(() => {
    setUiPreset(eventPreset);
  }, []);

  useSSEListener(
    API.PURCHASED_CONTENTS(orderId),
    (data) => {
      const jsonData = JSON.parse(data);
      dispatch(cartActions.setPurchasedItems(jsonData.contents));
      dispatch(personalActions.updatePurchased(jsonData.otherContents));
      navigate(ROUTES.PURCHASED, { replace: true });
    },
    () => {
      console.log(`Errore nel recupero dei contenuti ordine: ${orderId}`);
      navigate(ROUTES.CONTENT_ERROR);
    },
  );

  // Fallback di sicurezza: se il backend non invia l'evento SSE entro 8 secondi
  // (timeout di elaborazione o connessione silenziosa fallita), reindirizza all'errore.
  // Il redirect dell'SSE avviene prima e annulla questo timeout in caso di successo.
  useTimeoutRedirect(ROUTES.CONTENT_ERROR, 8000);

  return (
    <div className="form-sm">
      <Logo
        src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
        size="logo-sm"
        css="mx-auto mb-10"
      />
      <h2>
        {parse(t("PROCESSING_TITLE"))}
      </h2>
      <h4 className="mt-10 mb-20">
        {parse(t("PROCESSING_CONTENT"))}
        <br />
        {eventPreset.emoji ?? "🚴 📸 🏃"}
      </h4>
      <ProgressBar />
      {t("PROCESSING_LOADING")}
    </div>
  );
}
