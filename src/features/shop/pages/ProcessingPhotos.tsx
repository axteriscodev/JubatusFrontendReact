import Logo from "@common/components/Logo";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cartActions } from "@features/shop/store/cart-slice";
import { setUiPreset } from "@common/utils/graphics";
import { listenSSE } from "@common/services/api-services";
import ProgressBar from "@common/components/ProgressBar";
import { useTranslations } from "@common/i18n/TranslationProvider";
import parse from 'html-react-parser';
import { ROUTES } from "@/routes";
import { personalActions } from "@/features/user/store/personal-slice";

export default function ProcessingPhotos() {
  const eventPreset = useAppSelector((state) => state.competition);
  const orderId = useAppSelector((state) => state.cart.id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslations();

  useEffect(() => {
    //impostazioni evento
    setUiPreset(eventPreset);

    //sse elaborazione dati
    listenSSE(
      import.meta.env.VITE_API_URL + "/shop/purchased-contents/" + orderId,

      (data) => {
        const jsonData = JSON.parse(data);
        dispatch(cartActions.setPurchasedItems(jsonData.contents));
        dispatch(personalActions.updatePurchased(jsonData.otherContents));
        navigate(ROUTES.PURCHASED, { replace: true });
      },
      () => {
        console.log(`Errore nel recupero dei contenuti ordine: ${orderId}`);
        navigate(ROUTES.CONTENT_ERROR);
      }
    );
  }, []);

  //pagina timeout
  useEffect(() => {
    const timeOut = setTimeout(() => {
      navigate("/content-error");
    }, 8000);

    // cleanup function
    return () => clearTimeout(timeOut);
  }, []);

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
