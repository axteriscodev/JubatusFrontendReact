import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { listenSSE, sendRequest } from "../services/api-services";

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
    <>
      <h1>Processing Selfie</h1>
    </>
  );
}
