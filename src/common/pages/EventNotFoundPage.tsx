import { useRouteError } from "react-router-dom";
import { useTranslations } from "../i18n/TranslationProvider";
import parse from "html-react-parser";

interface EventLoaderError {
  status: number;
  active?: boolean | null;
}

export default function EventNotFoundPage() {
  const { t } = useTranslations();
  const error = useRouteError() as EventLoaderError;
  const isInactive = error?.status === 404 && error?.active === false;

  const title = isInactive
    ? t("EVENT_UNAVAILABLE_TITLE") || "Evento non disponibile"
    : t("EVENT_NOT_FOUND_TITLE") || "Evento non trovato";

  const subtitle = isInactive
    ? t("EVENT_UNAVAILABLE_SUBTITLE") ||
      "Questo evento non è attivo nel periodo corrente."
    : t("EVENT_NOT_FOUND_SUBTITLE") ||
      "Nessun evento corrisponde all'indirizzo richiesto.";

  const mailtoHref = "mailto:info@jubatus.it";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-linear-to-br from-slate-50 via-gray-100 to-stone-200">
      <div
        role="alert"
        aria-labelledby="event-error-title"
        aria-describedby="event-error-desc"
        className="bg-white/5 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[2.6px] border border-white/30 flex flex-col lg:flex-row items-center gap-4 py-6 px-6 max-w-6xl w-full"
      >
        <div
          className="w-full aspect-4/3 lg:w-1/2 lg:aspect-auto lg:mx-5 rounded-lg overflow-hidden"
          aria-hidden="true"
        >
          <img
            src="/nuvoletta_trasparente.png"
            alt=""
            className="w-full h-auto"
          />
        </div>

        <div className="w-full lg:w-auto flex flex-col gap-2 items-center lg:items-start text-center lg:text-left">
          <h1
            id="event-error-title"
            className="text-2xl! md:text-3xl! font-bold text-slate-900!"
          >
            {parse(title)}
          </h1>
          <p id="event-error-desc" className="md:text-lg! text-slate-900!">
            {parse(subtitle)}
          </p>
          <p className="flex gap-1 items-center md:text-lg! text-slate-700!">
            {parse(t("ERROR_PAGE_CONTACTS"))}
            <a
              href={mailtoHref}
              aria-label="Invia una email a info@jubatus.it"
              className="relative font-bold text-orange-800 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-orange-800 after:transition-all after:duration-300 hover:after:w-full"
            >
              info@jubatus.it
            </a>{" "}
          </p>
          <p className="flex items-center flex-wrap gap-1 md:text-lg! text-slate-700!">
            {parse(t("ERROR_PAGE_HP") || "Torna alla")}
            <a
              href="/"
              aria-label="Torna alla homepage"
              className="relative font-bold text-orange-800 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-orange-800 after:transition-all after:duration-300 hover:after:w-full"
            >
              homepage
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
