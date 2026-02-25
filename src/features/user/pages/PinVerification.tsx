import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setAuthToken, setLevel } from "@common/utils/auth";
import { useTranslations } from "@common/i18n/TranslationProvider";
import { ROUTES } from "@/routes";

export default function PinVerification() {
  const navigate = useNavigate();
  const userPin = useParams();
  const { t } = useTranslations();

  useEffect(() => {
    async function verifyPin() {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/auth/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: userPin,
          }),
        },
      );

      if (response.ok) {
        const json = await response.json();
        setAuthToken(json.data.jwt);
        setLevel(json.data.levelId);
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
