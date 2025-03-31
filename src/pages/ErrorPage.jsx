import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  let message = error.data.message;

  return (
    <>
      <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 mx-auto">
        <h3>Qualcosa non ha funzionato</h3>
        <p>
          <strong>Errore {error.status} - </strong>
          {message}
        </p>
      </div>
    </>
  );
}
