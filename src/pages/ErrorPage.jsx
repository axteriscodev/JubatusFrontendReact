import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <>
      <div className="container">
        <h3>Qualcosa non ha funzionato</h3>
        <p>
          <strong>Errore {error.status ?? ''} - </strong>
          {error.data.message ?? 'Si è verificato un errore, si prega di riprovare.'}
        </p>
      </div>
    </>
  );
}
