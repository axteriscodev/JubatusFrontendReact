import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { apiRequest } from "@common/services/api-services";
import { cartActions } from "../store/cart-slice";
import { useTranslations } from "@common/i18n/TranslationProvider";
import MailForm from "@common/components/MailForm";
import { createFormErrors } from "@common/models/form-errors";
import { useLanguage } from "@common/i18n/LanguageContext";
import parse from "html-react-parser";
import { FormLabel } from "@common/components/ui/Form";
import Input from "@common/components/ui/Input";
import { ROUTES } from "@/routes";

export default function MailConfirmation() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.cart.userId);
  const orderId = useAppSelector((state) => state.cart.id);
  const userEmail = useAppSelector((state) => state.cart.userEmail);
  const fullName = useAppSelector((state) => state.cart.fullName);
  const { currentLanguage } = useLanguage();
  const [formErrors, setFormErrors] = useState(createFormErrors());
  const [name, setName] = useState(fullName ?? "");
  const [nameError, setNameError] = useState(false);
  const { t } = useTranslations();

  const isEmailEmpty = !userEmail || userEmail.trim() === "";
  const isNameEmpty = !fullName || fullName.trim() === "";

  //TODO - recupero nome e cognome da risposta Stripe

  async function handleSubmit(data: { email: string; privacy?: boolean }) {
    try {
      const { email } = data;
      let errors = createFormErrors();

      console.log(data.email);
      console.log(name);
      console.log(data.privacy);

      // Validazione
      errors.emailError = !validator.isEmail(data.email);
      const isNameValid = name && name.trim() !== "";

      setNameError(!isNameValid);

      if (errors.emailError || !isNameValid) {
        setFormErrors(errors);
        return;
      }

      const body = JSON.stringify({
        userId,
        orderId,
        email,
        fullname: name.trim(),
        lang: currentLanguage.acronym,
      });

      console.log(`body: ${body}`);

      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/customer/confirm-email",
        method: "POST",
        body: body,
      });

      if (response.ok) {
        const json = await response.json();
        console.log("risposta ok");

        // Email già esistente
        if (json.data.emailDuplicated) {
          errors.emailDuplicated = true;
          setFormErrors(errors);
          return;
        }

        if (json.data.emailModified) {
          dispatch(cartActions.updateUserEmail(email));
        }
        if (json.data.nameModified) {
          dispatch(cartActions.updateUserName(name.trim()));
        }

        navigate(ROUTES.THANK_YOU);
      }
    } catch (err) {
      console.error(`Errore invio aggiornamento dati: ${err}`);
    }
  }

  return (
    <div className="form-sm">
      <div className="my-20 text-left">
        {isEmailEmpty || isNameEmpty ? (
          <>
            <h2 className="mb-10">{t("PAYMENT_COMPLETED")}</h2>
            <h4 className="">{t("EMAIL_ENTER")}</h4>
            <p>{t("EMAIL_AREA")}</p>
          </>
        ) : (
          <>
            <h2 className="mb-10">{t("PAYMENT_COMPLETED")}</h2>
            <p>
              {parse(t("PAYMENT_ACCESS").replace("$email", userEmail))} <br />
              {t("PAYMENT_CORRECT")}
            </p>
          </>
        )}
      </div>

      <div className="mb-3 text-left">
        <FormLabel htmlFor="name">{t("NAME_CONFIRM_LABEL")}</FormLabel>
        <Input
          type="text"
          className={`${nameError ? "is-invalid" : ""}`}
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(false);
          }}
          placeholder={t("NAME_PLACEHOLDER")}
        />
        {nameError && (
          <div className="invalid-feedback">{t("NAME_REQUIRED")}</div>
        )}
      </div>

      <MailForm
        submitHandle={handleSubmit}
        defaultEmail={userEmail ?? ""}
        showPrivacy={false}
        onErrors={formErrors}
        externalPayment={false}
      />
    </div>
  );
}
