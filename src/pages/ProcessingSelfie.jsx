import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { cartActions } from "../repositories/cart/cart-slice";
import { apiRequest, listenSSE } from "../services/api-services";
import { setUiPreset } from "../utils/graphics";
import { toast, Bounce } from "react-toastify";
import { fetchPriceList } from "../repositories/cart/cart-actions";
import ProgressBar from "../components/ProgressBar";
import { errorToast } from "../utils/toast-manager";

/**
 * Pagina di elaborazione selfie
 *
 * @returns {React.ReactElement}  Pagina di elaborazione selfie.
 */
export default function ProcessingSelfie() {
  const receivedData = useLocation().state;
  const eventId = useSelector((state) => state.cart.eventId);
  const eventPreset = useSelector((state) => state.competition);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  //upload della foto
  useEffect(() => {
    async function ProcessSelfie() {
      let response;

      /**
       * Se c'è l'hash, l'utente ha già fatto una ricerca ed è
       * in attesa di riceve ulteriori contenuti
       */
      if (receivedData.userHash) {
        response = await apiRequest({
          api: import.meta.env.VITE_API_URL + "/contents/fetch-hash",
          method: "POST",
          body: JSON.stringify({ hashId: receivedData.userHash }),
        });
      } else {
        //sezione upload email e selfie
        const formData = new FormData();

        formData.append("eventId", receivedData.eventId);
        formData.append("email", receivedData.email);
        formData.append("image", receivedData.image);

        //caricamento selfie
        response = await apiRequest({
          api: import.meta.env.VITE_API_URL + "/contents/fetch",
          method: "POST",
          body: formData,
        });
      }

      //impostare l'id ricerca

      if (response.ok) {
        const json = await response.json();

        await dispatch(fetchPriceList(eventId));

        //sezione elaborazione selfie e attesa risposte dal server S3
        listenSSE(
          import.meta.env.VITE_API_URL + "/contents/sse/" + json.data,
          (data) => {
            const jsonData = JSON.parse(data);
            dispatch(cartActions.updateProducts(jsonData.contents));
            dispatch(cartActions.updateHasPhoto(jsonData.hasPhoto ?? false));
            dispatch(cartActions.updateHasVideo(jsonData.hasVideo ?? false));
            dispatch(cartActions.updateUserId(jsonData.userId));

            if (jsonData.contents.length > 0 || jsonData.hasVideo) {
              navigate("/image-shop", { replace: true });
            } else {
              navigate("/content-unavailable", { replace: true });
            }
          },
          () => {
            errorToast("Si è verificato un errore");
            console.log(`Errore per la ricerca ${json.data}`);
            navigate("/event/" + eventPreset.slug, { replace: true });
          }
        );
      } else {
        throw Response(
          JSON.stringify({ status: response.status, message: response.message })
        );
      }
    }

    ProcessSelfie();
    setUiPreset(eventPreset);
  }, []);

  //pagina timeout
  useEffect(() => {
    const timeOut = setInterval(() => {
      errorToast("Si è verificato un errore");
      navigate("/event/" + eventPreset.slug, { replace: true });
    }, 60000);

    // cleanup function
    return () => clearInterval(timeOut);
  }, []);

  return (
    <div className="form-sm">
      <Logo
        src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
        size="logo-sm"
        css="mb-sm"
      />
      <h2>
        Ciao <span>atleta!</span>
      </h2>
      <h2>aspetta qualche secondo...</h2>
      <h2>
        stiamo trovando il <span>tuo</span> video
      </h2>
      <h2>{eventPreset.emoji ?? "🚴 📸 🏃"}</h2>
      <ProgressBar />
      Caricamento
    </div>
  );
}
