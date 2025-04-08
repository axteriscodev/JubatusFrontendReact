import { useRouteError } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  let message = "Si è verificato un errore, si prega di riprovare.";

  if (error.data.message) {
    message = error.data.message;
  }

  return (
    <>
      <div className="container">
        <h3>Qualcosa non ha funzionato</h3>
        <p>
          <strong>Errore {error.status ?? ""} - </strong>
          {message}
        </p>
      </div>
      <Link to="/">Torna alla home</Link>
    </>
  );
}
