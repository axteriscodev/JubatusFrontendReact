import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from "../services/api-services";
import { cartActions } from "../repositories/cart/cart-slice";
import { useTranslations } from "../features/TranslationProvider";
import MailForm from "../components/MailForm";
import FormErrors from "../models/form-errors";
import { useLanguage } from "../features/LanguageContext";
import { FormLabel } from "../shared/components/ui/Form";
import Input from "../shared/components/ui/Input";
import { ROUTES } from "../routes";

export default function PayAtCounter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslations();
  const { currentLanguage } = useLanguage();

  const userId = useSelector((state) => state.cart.userId);
  const orderId = useSelector((state) => state.cart.id);
  const userEmail = useSelector((state) => state.cart.userEmail);
  const fullName = useSelector((state) => state.cart.fullName);
  const eventSlug = useSelector((state) => state.competition.slug);

  const [formErrors, setFormErrors] = useState(new FormErrors());
  const [name, setName] = useState(fullName ?? "");
  const [nameError, setNameError] = useState(false);

  async function handleSubmit(event, data) {
    event.preventDefault();
    try {
      const { email } = data;
      let errors = new FormErrors();

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
