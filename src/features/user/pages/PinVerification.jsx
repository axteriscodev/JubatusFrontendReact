import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setAuthToken, setLevel } from "@common/utils/auth";
import PinForm from "../components/PinForm";
import { createFormErrors } from "@common/models/form-errors";
import { useTranslations } from "@common/i18n/TranslationProvider";
import { ROUTES } from "@/routes";

export default function PinVerification() {
  const navigate = useNavigate();
  //const [formErrors, setFormErrors] = useState(createFormErrors());
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
            //email: emailValue,
            //token: data.pin,
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
          let formErrors = createFormErrors();
          formErrors.pinError = true;
          return;
        }
        throw new Response(response.message, { status: response.status });
      }
    }

    verifyPin();
  }, []);

  return (
    <div className="form form-sm">
      {/* <h1 className="mb-20">Accedi ai tuoi contenuti!</h1> */}
      <h1>{t("PERSONAL_PIN")}</h1>
      {/* <PinForm submitHandle={handleSubmit} onErrors={formErrors} /> */}
    </div>
  );
}
