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
import parse from 'html-react-parser';

export default function MailConfirmation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.cart.userId);
  const orderId = useSelector((state) => state.cart.id);
  const userEmail = useSelector((state) => state.cart.userEmail);
  const { currentLanguage } = useLanguage();
  const [formErrors, setFormErrors] = useState(new FormErrors());
  const { t } = useTranslations();

  const isEmailEmpty = !userEmail || userEmail.trim() === "";

  async function handleSubmit(event, data) {
    event.preventDefault();

    try {
      const { email } = data;
      let formErrors = new FormErrors();

      console.log(data.email);
      console.log(data.privacy);

      formErrors.emailError = !validator.isEmail(data.email);

      if (formErrors.emailError) {
        setFormErrors(formErrors);
        return;
      }

      let body = JSON.stringify({ userId, orderId, email, lang: currentLanguage.acronym });
      console.log(`body: ${body}`);
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/customer/confirm-email",
        method: "POST",
        body: body,
      });
      if (response.ok) {
        const json = await response.json();
        console.log("risposta ok");
        if(json.data.emailModified){
          dispatch(cartActions.updateUserEmail(email));
        }
        navigate("/thank-you");
      }
    } catch (err) {
      console.error(`Errore invio aggiornamento email: ${err}`);
    }
  }

  return (
    <div className="form-sm">
      <div className="my-md text-start">
        {isEmailEmpty ? (
          <>
            <h2 className="mb-sm">{t('PAYMENT_COMPLETED')}</h2>
            <h4 className="">{t('EMAIL_ENTER')}</h4>
            <p>
             {t('EMAIL_AREA')}
            </p>
          </>
        ) : (
          <>
            <h2 className="mb-sm">{t('PAYMENT_COMPLETED')}</h2>
            <p>
              {parse(t('PAYMENT_ACCESS').replace("$email", userEmail))} <br />
              {t('PAYMENT_CORRECT')}
            </p>
          </>
        )}
      </div>
      <MailForm
        submitHandle={handleSubmit}
        defaultEmail={userEmail ?? ""}
        showPrivacy={false}
        onErrors={formErrors}
      />
    </div>
  );
}
