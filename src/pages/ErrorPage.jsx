import { useRouteError } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useTranslations } from "../features/TranslationProvider";

export default function ErrorPage() {
  const error = useRouteError();
  const { t } = useTranslations();

  let message = "Si è verificato un errore, si prega di riprovare.";

  if (error.data.message) {
    message = error.data.message;
  }

  return (
    <>
      <div className="container">
        <h3>{t("ERROR_WORK")}</h3>
        <p>
          <strong>Error {error.status ?? ""} - </strong>
          {message}
        </p>
      </div>
      <Link to="/">{t("ERROR_BACK")}</Link>
    </>
  );
}
