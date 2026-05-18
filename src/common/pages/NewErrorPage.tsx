import { useRouteError } from "react-router-dom";
import { useTranslations } from "../i18n/TranslationProvider";
import parse from "html-react-parser";

interface RouteError {
  message?: string;
  statusText?: string;
  status?: number;
  stack?: string;
}

export default function NewErrorPage() {
  const { t } = useTranslations();

  // Recupera l'errore passato da React Router tramite errorElement
  const error = useRouteError() as RouteError | undefined;

  // Corpo dell'email precompilato con i dettagli tecnici dell'errore.
  // I testi introduttivi sono tradotti; le label tecniche (Status, Message, Stack trace)
  // rimangono in inglese perché fanno parte del formato standard degli errori.
  const errorText = [
    t("ERROR_EMAIL_GREETING"),
    t("ERROR_EMAIL_INTRO") + "\n",
    "──────────────────────────────",
    t("ERROR_EMAIL_SECTION_TITLE"),
    "──────────────────────────────",
    error?.status && `• Status: ${error.status}`,
    (error?.message || error?.statusText) &&
      `• Message: ${error?.message ?? error?.statusText}`,
    error?.stack && `• Stack trace:\n\n${error.stack}`,
    "──────────────────────────────",
    `\n${t("ERROR_EMAIL_ADDITIONAL_TITLE")}`,
    t("ERROR_EMAIL_ADDITIONAL_PLACEHOLDER"),
  ]
    .filter(Boolean)
    .join("\n");

  // Se c'è un errore, pre-popola oggetto e corpo dell'email con i dettagli tecnici
  const mailtoHref = error
    ? `mailto:info@jubatus.it?subject=${encodeURIComponent(t("ERROR_EMAIL_SUBJECT"))}&body=${encodeURIComponent(errorText)}`
    : "mailto:info@jubatus.it";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-linear-to-br from-slate-50 via-gray-100 to-stone-200">
      <div
        role="alert"
        aria-labelledby="error-title"
        aria-describedby="error-desc"
        className="bg-white/5 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[2.6px] border border-white/30 flex flex-col lg:flex-row items-center gap-4 py-6 px-6 max-w-6xl w-full"
      >
        {/* Immagine */}
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

        {/* Testo */}
        <div className="w-full lg:w-auto flex flex-col gap-2  items-center lg:items-start text-center lg:text-left">
          <h1
            id="error-title"
            className="text-2xl! md:text-3xl! font-bold text-slate-900!"
          >
            {parse(t("ERROR_PAGE_TITLE"))}
          </h1>
          <p id="error-desc" className="md:text-lg! text-slate-900!">
            {parse(t("ERROR_PAGE_SUBTITLE"))}
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
            {parse(t("ERROR_PAGE_HP"))}
            <a
              href="/"
              aria-label="Torna alla homepage"
              className="relative font-bold text-orange-800 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-orange-800 after:transition-all after:duration-300 hover:after:w-full"
            >
              homepage
            </a>
          </p>
          {/* Pannello dettagli errore: visibile solo se React Router ha fornito un errore */}
          {error && (
            <div className="mt-4 w-full text-left space-y-2">
              <p className="text-sm text-slate-500!">
                {parse(t("ERROR_PAGE_REPORT"))}
              </p>
              {/* Sezione collassabile con i dettagli tecnici */}
              <details className="w-full">
                <summary className="cursor-pointer text-sm font-semibold text-slate-500! hover:text-slate-700!">
                  Error details
                </summary>
                <div className="mt-2 rounded-lg bg-slate-100 p-3 text-xs text-slate-700! font-mono break-all space-y-1">
                  {error.status && (
                    <p>
                      <span className="font-bold">Status:</span> {error.status}
                    </p>
                  )}
                  {(error.message || error.statusText) && (
                    <p>
                      <span className="font-bold">Message:</span>{" "}
                      {error.message ?? error.statusText}
                    </p>
                  )}
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-sans font-semibold text-slate-500!">
                        Stack trace
                      </summary>
                      <pre className="mt-1 whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
