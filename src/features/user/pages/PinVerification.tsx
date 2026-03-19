import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setAuthToken, setLevel, setRole } from "@common/utils/auth";
import { useTranslations } from "@common/i18n/TranslationProvider";
import { ROUTES } from "@/routes";
import { apiRequest } from "@common/services/api-services";
import { API } from "@common/services/api-endpoints";

export default function PinVerification() {
  const navigate = useNavigate();
  const userPin = useParams();
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
        setAuthToken(json.data.jwt);
        setLevel(json.data.levelId);
        setRole(json.data.role);
        navigate(ROUTES.HOME);
      } else {
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
