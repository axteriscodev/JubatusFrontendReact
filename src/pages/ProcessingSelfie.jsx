import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { listenSSE, sendRequest } from "../services/api-services";
import Logo from "../components/Logo";
import { cartActions } from "../repositories/cart/cart-slice";
import { setUiPreset } from "../utils/graphics";

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
      //sezione upload email e selfie
      const formData = new FormData();

      formData.append("eventId", receivedData.eventId);
      formData.append("email", receivedData.email);
      formData.append("image", receivedData.image);

      //caricamento selfie
      const response = await sendRequest(
        import.meta.env.VITE_API_URL + "/contents/fetch",
        "POST",
        formData
      );

      //impostare l'id ricerca

      if (response.ok) {
        const json = await response.json();

        await fetchPriceList(eventId);

        //sezione elaborazione selfie e attesa risposte dal server S3
        // import.meta.env.VITE_API_URL + "/contents/sse/" + json.data,
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
            console.log("Errore!");
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

  async function fetchPriceList(eventId) {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/contents/event-list/" + eventId
    );

    if (response.ok) {
      const json = await response.json();
      dispatch(cartActions.updatePriceList(json.data.items));
    }
  }

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
      <h2>🌊 📸 🏄🏻</h2>
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
