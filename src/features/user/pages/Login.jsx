import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";
import validator from "validator";
import MailForm from "@common/components/MailForm";
import { createFormErrors } from "@common/models/form-errors";
import { resetHeaderData } from "@common/utils/graphics";
import { useTranslations } from "@common/i18n/TranslationProvider";
import LanguageSelect from "@common/components/LanguageSelect";
import parse from "html-react-parser";
import { ROUTES } from "@/routes";

/**
 * Pagina di login
 *
 * @returns {React.ReactElement}  Pagina Login.
 */
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState(createFormErrors());

  // Testi in lingua
  const { t, currentLanguage } = useTranslations();

  useEffect(() => {
    document.documentElement.style.setProperty("--bg-event-color", "");
    document.documentElement.style.setProperty("--font-button-event-color", "");
    document.documentElement.style.setProperty("--primary-event-color", "");
    document.documentElement.style.setProperty("--secondary-event-color", "");

    resetHeaderData();
  }, []);

  async function handleSubmit(event, data) {
    event.preventDefault();

    let formErrors = createFormErrors();

    console.log(data.email);

    formErrors.emailError = !validator.isEmail(data.email);

    if (formErrors.emailError) {
      setFormErrors(formErrors);
      return;
    }

    const response = await fetch(
      import.meta.env.VITE_API_URL + "/auth/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          lang: currentLanguage?.acronym ?? "",
        }),
      },
    );

    if (response.ok) {
      dispatch(userActions.updateEmail(data.email));
      navigate(ROUTES.EMAIL_SENT);
    } else {
      if (response.status === 401) {
        formErrors.emailNotPresent = true;
        setFormErrors(formErrors);
        return;
      }

      throw Response(
        JSON.stringify({ status: response.status, message: response.message }),
      );
    }
  }

  return (
    <div className="form-sm">
      <div className="flex justify-end">
        <LanguageSelect />
      </div>
      <div className="form">
        <h1 className="mb-20">{parse(t("EMAIL_ACCESS"))}</h1>
        <MailForm
          submitHandle={handleSubmit}
          defaultEmail={""}
          showPrivacy={false}
          onErrors={formErrors}
          externalPayment={false}
        />
      </div>
    </div>
  );
}
