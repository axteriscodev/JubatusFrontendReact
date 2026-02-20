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
import { FormLabel } from "@common/components/ui/Form";
import Input from "@common/components/ui/Input";
import { ROUTES } from "@/routes";

export default function PayAtCounter() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslations();
  const { currentLanguage } = useLanguage();

  const userId = useAppSelector((state) => state.cart.userId);
  const orderId = useAppSelector((state) => state.cart.id);
  const userEmail = useAppSelector((state) => state.cart.userEmail);
  const fullName = useAppSelector((state) => state.cart.fullName);
  const eventSlug = useAppSelector((state) => state.competition.slug);

  const [formErrors, setFormErrors] = useState(createFormErrors());
  const [name, setName] = useState(fullName ?? "");
  const [nameError, setNameError] = useState(false);

  async function handleSubmit(event: React.FormEvent, data: { email: string; privacy?: boolean }) {
    event.preventDefault();
    try {
      const { email } = data;
      let errors = createFormErrors();

      errors.emailError = !validator.isEmail(email);
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

      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/customer/confirm-email",
        method: "POST",
        body,
      });

      if (response.ok) {
        const json = await response.json();

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

        navigate(ROUTES.EVENT(eventSlug), { replace: true });
      }
    } catch (err) {
      console.error(`Errore invio aggiornamento dati: ${err}`);
    }
  }

  return (
    <div className="form-sm justify-center gap-4 px-6">
      <div className="my-8 text-left">
        <h2 className="mb-4">{t("EXTERNAL_PAYMENT_TITLE")}</h2>
        <p>{t("EXTERNAL_PAYMENT_TEXT")}</p>
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
        externalPayment={true}
      />
    </div>
  );
}
