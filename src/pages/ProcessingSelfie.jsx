import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { cartActions } from "../repositories/cart/cart-slice";
import { apiRequest, listenSSE } from "../services/api-services";
import { setUiPreset } from "../utils/graphics";
import { toast, Bounce } from "react-toastify";
import { fetchPriceList } from "../repositories/cart/cart-actions";
import { objectToFormData } from "../utils/form-data-converters";

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
  // Stato per il progresso della barra (da 0 a 100)
  const [progress, setProgress] = useState(0);

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
        // const formData = new FormData();

        // formData.append("eventId", receivedData.eventId);
        // formData.append("email", receivedData.email);
        // formData.append("image", receivedData.image);

        //caricamento selfie
        response = await apiRequest({
          api: import.meta.env.VITE_API_URL + "/contents/fetch",
          method: "POST",
          body: objectToFormData(receivedData),
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
            dispatch(cartActions.updateUserId(jsonData.userId));

            if (jsonData.contents.length > 0) {
              navigate("/image-shop", { replace: true });
            } else {
              navigate("/content-unavailable", { replace: true });
            }
          },
          () => {
            //console.log("Errore!");
            toast.error("Si è verificato un errore", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
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

  useEffect(() => {
    // Funzione che incrementa il progresso
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 99) {
          clearInterval(interval);
          return 99;
        }
        const newValue = prevProgress + 100 / 6;

        return newValue < 99 ? newValue : 99;
      });
    }, 1000);

    // cleanup function
    return () => clearInterval(interval);
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
        stiamo trovando le <span>tue</span> foto
      </h2>
      <h2>{eventPreset.emoji ?? "🚴 📸 🏃"}</h2>
      <div
        className="progress mt-md"
        role="progressbar"
        aria-label="Basic example"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      Caricamento
    </div>
  );
}
