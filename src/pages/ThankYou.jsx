import { useNavigate } from "react-router-dom";

export default function ThankYou() {
  const navigate = useNavigate();

  const submitHandle = (event) => {
    navigate("/");
  };

  return (
    <div className="form-sm text-center">
      <h2>Grazie per il tuo acquisto!</h2>
      <p>
        Potrai accedere alla tua area personale usando l'email confermata e
        trovare i tuoi contenuti disponibili.
      </p>
      <button
        className="my-button w-100 mt-sm"
        onClick={(event) => submitHandle(event)}
      >
        Vai all'area riservata
      </button>
    </div>
  );
}
