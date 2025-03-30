import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { listenSSE, sendRequest } from "../services/api-services";
import Logo from "../components/Logo";
import { cartActions } from "../repositories/cart/cart-slice";

/**
 * Pagina di elaborazione selfie
 *
 * @returns {React.ReactElement}  Pagina di elaborazione selfie.
 */
export default function ProcessingSelfie() {
  const receivedData = useLocation().state;
  const eventId = useSelector((state) => state.cart.eventId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  //upload della foto
  useEffect(() => {
    async function ProcessSelfie() {
      //sezione upload email e selfie
      const formData = new FormData();

      formData.append("eventId", receivedData.eventId);
      formData.append("email", receivedData.email);
      formData.append("image", receivedData.selfie);

      //caricamento selfie
      const response = await sendRequest(
        "http://localhost:8080/contents/fetch",
        "POST",
        formData
      );

      if(response.ok) {
        const json = await response.json();
        dispatch(cartActions.updateContents(json.data.items));
      }

      await fetchPriceList(eventId);

      navigate("/image-shop"); //TODO - da rimuovere

      //sezione elaborazione selfie e attesa risposte dal server S3
      listenSSE(
        "http://localhost:8080/contents/test-sse",
        () => {
          navigate("/image-shop");
        },
        () => {
          console.log("Errore!");
        }
      );
    }

    ProcessSelfie();
  }, []);


  async function fetchPriceList(eventId) {
    const response = await fetch('http://localhost:8080/contents/event-list/' + eventId);

    if(response.ok) {
      const json = await response.json();
      dispatch(cartActions.updatePriceList(json.data.items));
    }
  }

  return (
    <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 mx-auto">
      <Logo size="logo-sm" css="mb-sm" />
      <h2>Ciao <span>atleta!</span></h2>
      <h2>aspetta qualche secondo...</h2>
      <h2>stiamo trovando le <span>tue</span> foto</h2>
      <h2>🌊 📸 🏄🏻</h2>
      <div className="progress mt-md" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
          <div className="progress-bar" style={{width: '25%'}}></div>
      </div>
      Caricamento
    </div>
  );
}
