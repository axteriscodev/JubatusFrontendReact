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
    <>
      <h1>Processing Selfie</h1>
    </>
  );
}
