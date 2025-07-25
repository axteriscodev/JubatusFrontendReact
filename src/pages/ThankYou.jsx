import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../services/api-services";

export default function ThankYou() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const userEmail = useSelector((state) => state.cart.userEmail);
  const orderId = useSelector((state) => state.cart.id);

  const submitHandle = (event) => {
    navigate("/");
  };

  //re-invio dell email di accesso
  const handleResend = async () => {
    setLoading(true);
    setMessage("");

    try {
      const body = JSON.stringify({ userEmail: userEmail, orderId: orderId });
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/customer/resend-link",
        method: "POST",
        body: body,
      });

      if (response.ok) {
        setMessage("Un nuovo link è stato inviato alla tua email.");
      } else {
        setMessage("Errore nell'invio dell'email. Riprova più tardi.");
      }
    } catch (error) {
      setMessage("Errore di rete. Controlla la connessione.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-sm text-center">
      <h2>Grazie per il tuo acquisto!</h2>
      <p>
        L'ordine è stato completato con successo. Ti abbiamo inviato un'email
        all'indirizzo {userEmail} con il link di accesso alla tua area
        personale, dove potrai scaricare tutti i contenuti in alta definizione.
      </p>
      <button
        className="my-button w-100 mt-sm"
        onClick={(event) => submitHandle(event)}
      >
        Vai all'area riservata
      </button>

      <div className="mt-md">
        <p>Non hai ricevuto l'email?</p>
        <button
          className="my-button-outline w-100"
          onClick={handleResend}
          disabled={loading}
        >
          {loading ? "Invio in corso..." : "Rigenera link"}
        </button>
        {message && <p className="mt-sm">{message}</p>}
      </div>
    </div>
  );
}
