import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "@common/components/Logo";
import { cartActions } from "@features/shop/store/cart-slice";
import { apiRequest, listenSSE } from "@common/services/api-services";
import { setUiPreset } from "@common/utils/graphics";
import { fetchPriceList } from "@features/shop/store/cart-actions";
import ProgressBar from "@common/components/ProgressBar";
import { errorToast } from "@common/utils/toast-manager";
import { useTranslations } from "@common/i18n/TranslationProvider";
import parse from "html-react-parser";
import { ROUTES } from "@/routes";

interface ProcessingSelfieState {
  eventId: number;
  email?: string;
  image?: File | null;
  bibNumber?: string;
  eventSlug?: string;
  userHash?: string;
}

export default function ProcessingSelfie() {
  const receivedData = useLocation().state as ProcessingSelfieState;
  const eventId = useAppSelector((state) => state.cart.eventId);
  const eventPreset = useAppSelector((state) => state.competition);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslations();

  //upload della foto
  useEffect(() => {
    async function ProcessSelfie() {
      let response: Response;

      dispatch(cartActions.updateUserEmail(receivedData.email ?? ""));

      /**
       * Se c'è l'hash, l'utente ha già fatto una ricerca ed è
       * in attesa di riceve ulteriori contenuti
       */
      if (receivedData.userHash) {
        response = await apiRequest({
          api: import.meta.env.VITE_API_URL + "/contents/fetch-hash",
          method: "POST",
          body: JSON.stringify({ hashId: receivedData.userHash }),
          needAuth: true,
        });
      } else {
        //sezione upload email e selfie
        const formData = new FormData();

        formData.append("eventId", String(receivedData.eventId));
        formData.append("email", receivedData.email ?? "");

        // Image may be null when license plate is provided
        if (receivedData.image) {
          formData.append("image", receivedData.image);
        }

        // Add bib number field - backend will handle placeholder creation
        formData.append("bibNumber", receivedData.bibNumber || "");
        formData.append("lang", currentLanguage?.acronym ?? "");

        //caricamento selfie
        response = await apiRequest({
          api: import.meta.env.VITE_API_URL + "/contents/fetch",
          method: "POST",
          body: formData,
          needAuth: true,
        });
      }

      if (response.ok) {
        const json = await response.json();
        await dispatch(fetchPriceList(eventId));
        dispatch(cartActions.updateSearchId(json.data));

        if (eventPreset.preOrder) {
          navigate(ROUTES.PRE_ORDER, { replace: true });
        } else {
          //sezione elaborazione selfie e attesa risposte dal server S3
          listenSSE(
            import.meta.env.VITE_API_URL + "/contents/sse/" + json.data,
            (data) => {
              const jsonData = JSON.parse(data);
              dispatch(cartActions.updateProducts(jsonData.contents));
              dispatch(cartActions.updateHasPhoto(jsonData.hasPhoto ?? false));
              dispatch(cartActions.updateHasVideo(jsonData.hasVideo ?? false));
              dispatch(cartActions.updateUserId(jsonData.userId));
              dispatch(cartActions.updateUserEmail(jsonData.userEmail));
              dispatch(
                cartActions.updatePreviousAllPhotosPurchase(
                  jsonData.previousAllPhotosPurchase ?? false,
                ),
              );

              if (jsonData.contents.length > 0 || jsonData.hasVideo) {
                navigate(ROUTES.IMAGE_SHOP, { replace: true });
              } else {
                navigate(ROUTES.CONTENT_UNAVAILABLE, { replace: true });
              }
            },
            () => {
              errorToast("Si è verificato un errore");
              console.log(`Errore per la ricerca ${json.data}`);
              navigate(ROUTES.EVENT(eventPreset.slug), { replace: true });
            },
          );
        }
      } else if (response.status === 401) {
        errorToast(t("INVALID_MAIL_FOR_EVENT"), 10000);
        navigate("/event/" + eventPreset.slug, { replace: true });
      } else {
        throw new Response(
          JSON.stringify({
            status: response.status,
          }),
          { status: response.status },
        );
      }
    }

    ProcessSelfie();
    setUiPreset(eventPreset);
  }, []);

  //pagina timeout
  useEffect(() => {
    const timeOut = setTimeout(
      () => {
        errorToast("Si è verificato un errore");
        navigate("/event/" + eventPreset.slug, { replace: true });
      },
      Number(import.meta.env.VITE_PROCESSING_SELFIE_TIMEOUT) || 12000,
    );

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
      {parse(t("WAITING_SEARCH"))}
      <h2>{eventPreset.emoji ?? "🚴 📸 🏃"}</h2>
      <ProgressBar
        duration={
          Number(import.meta.env.VITE_PROCESSING_SELFIE_LOADING) || 10000
        }
      />
      {t("PROCESSING_LOADING")}
    </div>
  );
}
