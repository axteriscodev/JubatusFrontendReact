import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setAuthToken, setLevel, setRole } from "@common/utils/auth";
import { useTranslations } from "@common/i18n/TranslationProvider";
import { ROUTES } from "@/routes";
import { apiRequest } from "@common/services/api-services";
import { API } from "@common/services/api-endpoints";
import { errorToast } from "@common/utils/toast-manager";
import Spinner from "@common/components/ui/Spinner";

// Pagina di atterraggio per il link magico inviato via email.
// Il token è passato come parametro URL e viene verificato al backend per ottenere il JWT.
export default function PinVerification() {
  const navigate = useNavigate();
  const userPin = useParams();
  const { t, loadingTranslations } = useTranslations();

  useEffect(() => {
    if (loadingTranslations) return;

    async function verifyPin() {
      const response = await apiRequest({
        api: API.AUTH_VALIDATE,
        method: "POST",
        body: JSON.stringify({ token: userPin }),
      });

      if (response.ok) {
        const json = await response.json();
        setAuthToken(json.data.jwt);
        setLevel(json.data.levelId);
        setRole(json.data.role);
        navigate(ROUTES.HOME);
      } else if (response.status === 401) {
        errorToast(t("PIN_ERROR_401"));
        navigate(ROUTES.HOME);
      } else if (response.status === 500) {
        errorToast(t("PIN_ERROR_500"));
        navigate(ROUTES.HOME);
      } else {
        throw new Response(String(response.status), { status: response.status });
      }
    }

    verifyPin();
  }, [loadingTranslations, navigate, t, userPin]);

  if (loadingTranslations) {
    return (
      <div className="form form-sm flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="form form-sm">
      <h1>{t("PERSONAL_PIN")}</h1>
    </div>
  );
}
