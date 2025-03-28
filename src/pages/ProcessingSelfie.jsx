import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { listenSSE, sendRequest } from "../services/api-services";
import Logo from "../components/Logo";

/**
 * Pagina di elaborazione selfie
 *
 * @returns {React.ReactElement}  Pagina di elaborazione selfie.
 */
export default function ProcessingSelfie() {
  const receivedData = useLocation().state;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  //upload della foto
  useEffect(() => {
    async function ProcessSelfie() {
      //sezione upload email e selfie
      const formData = new FormData();

      formData.append("email", receivedData.email);
      formData.append("image", receivedData.selfie);

      //caricamento selfie
      const response = await sendRequest(
        "http://localhost:8080/contents/fetch",
        "POST",
        formData
      );

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
