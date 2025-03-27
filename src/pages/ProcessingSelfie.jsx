import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

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

      const response = await fetch("http://localhost:8080/contents/fetch", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Errore nel caricamento del selfie");
        return;
      } else {
        console.log("Selfie caricato correttamente");
      }

      //sezione elaborazione selfie e attesa risposte dal selfie
      const sse = new EventSource("http://localhost:8080/contents/test-sse");

      sse.onmessage = (e) => {
        console.log(e.data);
        navigate("/image-shop");
        sse.close();
      };
      sse.onerror = () => {
        console.log("Errore!");
        sse.close();
      };
      return () => {
        console.log("Chiuso!");
        sse.close();
      };
    }

    ProcessSelfie();
  }, []);

  return (
    <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 mx-auto">
      <img src="/images/oceanman_logo.jpeg" className="rounded-circle mb-md logo-sm"/>
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
