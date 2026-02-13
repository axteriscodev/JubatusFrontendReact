import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setAuthToken, setLevel } from "../utils/auth";
import PinForm from "../components/PinForm";
import FormErrors from "../models/form-errors";
import { useTranslations } from "../features/TranslationProvider";
import { ROUTES } from "../routes";

export default function PinVerification() {
  const navigate = useNavigate();
  const emailValue = useSelector((state) => state.user.email);
  //const [formErrors, setFormErrors] = useState(new FormErrors());
  const userPin = useParams();
  const {t} = useTranslations();

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
        }
      );

      if (response.ok) {
        const json = await response.json();
        setAuthToken(json.data.jwt);
        setLevel(json.data.levelId);
        if (json.levelId <= 1) {
          navigate(ROUTES.ADMIN);
        } else {
          navigate(ROUTES.PERSONAL);
        }
      } else {
        if (response.status === 401) {
          let formErrors = new FormErrors();
          formErrors.pinError = true;
          setFormErrors(formErrors);
          return;
        }
        throw new Response(response.message, { status: response.status });
      }
    }

    verifyPin();
  }, []);

  async function handleSubmit(event, data) {
    event.preventDefault();

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
      }
    );

    if (response.ok) {
      const json = await response.json();
      setAuthToken(json.data.jwt);
      setLevel(json.data.levelId);
      if (json.levelId <= 1) {
        navigate("/admin");
      } else {
        navigate("/personal");
      }
    } else {
      if (response.status === 401) {
        let formErrors = new FormErrors();
        formErrors.pinError = true;
        setFormErrors(formErrors);
        return;
      }
      throw new Response(response.message, { status: response.status });
    }
  }

  return (
    <div className="form form-sm">
      {/* <h1 className="mb-20">Accedi ai tuoi contenuti!</h1> */}
      <h1>{t("PERSONAL_PIN")}</h1>
      {/* <PinForm submitHandle={handleSubmit} onErrors={formErrors} /> */}
    </div>
  );
}
