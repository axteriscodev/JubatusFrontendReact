import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setAuthToken, setLevel, setRole } from "@common/utils/auth";
import { useTranslations } from "@common/i18n/TranslationProvider";
import { ROUTES } from "@/routes";
import { apiRequest } from "@common/services/api-services";
import { API } from "@common/services/api-endpoints";

// Pagina di atterraggio per il link magico inviato via email.
// Il token è passato come parametro URL e viene verificato al backend per ottenere il JWT.
export default function PinVerification() {
  const navigate = useNavigate();
  const userPin = useParams(); // contiene il token estratto dall'URL
  const { t } = useTranslations();

  useEffect(() => {
    async function verifyPin() {
      const response = await apiRequest({
        api: API.AUTH_VALIDATE,
        method: "POST",
        body: JSON.stringify({
          token: userPin,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        // Salva JWT, livello e ruolo in localStorage tramite gli helper di auth
        setAuthToken(json.data.jwt);
        setLevel(json.data.levelId);
        setRole(json.data.role);
        navigate(ROUTES.HOME);
      } else {
        // 401 = token non valido o scaduto: resta sulla pagina senza navigare
        if (response.status === 401) {
          return;
        }
        throw new Response(String(response.status), { status: response.status });
      }
    }

    verifyPin();
  }, []);

  return (
    <div className="form form-sm">
      <h1>{t("PERSONAL_PIN")}</h1>
    </div>
  );
}
