import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslations } from "../features/TranslationProvider";

export default function ErrorPage() {
  const error = useRouteError();
  const { t } = useTranslations();

  const message =
    error?.message || "Si è verificato un errore, si prega di riprovare.";

  const status = error?.status;

  return (
    <>
      <div className="container">
        <h3>{t("ERROR_WORK")}</h3>
        <p>
          <strong>Error {status ?? ""} - </strong>
          {message}
        </p>
      </div>
      <Link to="/">{t("ERROR_BACK")}</Link>
    </>
  );
}
