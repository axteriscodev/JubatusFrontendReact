import { useRouteError, Link } from "react-router-dom";
import { useTranslations } from "../i18n/TranslationProvider";
import { ROUTES } from "@/routes";

interface RouteError {
  message?: string;
  status?: number;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
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
      <Link to={ROUTES.HOME}>{t("ERROR_BACK")}</Link>
    </>
  );
}
