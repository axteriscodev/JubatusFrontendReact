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
import { FormLabel } from "../shared/components/ui/Form";
import Input from "../shared/components/ui/Input";

export default function MailConfirmation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.cart.userId);
  const orderId = useSelector((state) => state.cart.id);
  const userEmail = useSelector((state) => state.cart.userEmail);
  const fullName = useSelector((state) => state.cart.fullName);
  //const userSurname = useSelector((state) => state.cart.userSurname);
  const { currentLanguage } = useLanguage();
  const [formErrors, setFormErrors] = useState(new FormErrors());
  const [name, setName] = useState(fullName ?? "");
  //const [surname, setSurname] = useState(userSurname ?? "");
  const [nameError, setNameError] = useState(false);
  //const [surnameError, setSurnameError] = useState(false);
  const { t } = useTranslations();
  
  const isEmailEmpty = !userEmail || userEmail.trim() === "";
  const isNameEmpty = !fullName || fullName.trim() === "";
  //const isSurnameEmpty = !userSurname || userSurname.trim() === "";

  //TODO - recupero nome e cognome da risposta Stripe

  async function handleSubmit(event, data) {
    event.preventDefault();
    try {
      const { email } = data;
      let formErrors = new FormErrors();
      
      console.log(data.email);
      console.log(name);
      //console.log(surname);
      console.log(data.privacy);
      
      // Validazione
      formErrors.emailError = !validator.isEmail(data.email);
      const isNameValid = name && name.trim() !== "";
      //const isSurnameValid = surname && surname.trim() !== "";
      
      setNameError(!isNameValid);
      //setSurnameError(!isSurnameValid);
      
      if (formErrors.emailError || !isNameValid ) {
        setFormErrors(formErrors);
        return;
      }
      
      let body = JSON.stringify({ 
        userId, 
        orderId, 
        email, 
        fullname: name.trim(),
        //surname: surname.trim(),
        lang: currentLanguage.acronym 
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
        if(json.data.emailDuplicated){
          formErrors.emailDuplicated = true;
          setFormErrors(formErrors);
          return;
        }
        
        if (json.data.emailModified) {
          dispatch(cartActions.updateUserEmail(email));
        }
        if (json.data.nameModified) {
          dispatch(cartActions.updateUserName(name.trim()));
        }
        // if (json.data.surnameModified) {
        //   dispatch(cartActions.updateUserSurname(surname.trim()));
        // }
        
        navigate("/thank-you");
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
            <h2 className="mb-10">{t('PAYMENT_COMPLETED')}</h2>
            <h4 className="">{t('EMAIL_ENTER')}</h4>
            <p>
              {t('EMAIL_AREA')}
            </p>
          </>
        ) : (
          <>
            <h2 className="mb-10">{t('PAYMENT_COMPLETED')}</h2>
            <p>
              {parse(t('PAYMENT_ACCESS').replace("$email", userEmail))} <br />
              {t('PAYMENT_CORRECT')}
            </p>
          </>
        )}
      </div>
      
      <div className="mb-3 text-left">
        <FormLabel htmlFor="name">
          {t('NAME_CONFIRM_LABEL')}
        </FormLabel>
        <Input
          type="text"
          className={`${nameError ? 'is-invalid' : ''}`}
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(false);
          }}
          placeholder={t('NAME_PLACEHOLDER')}
        />
        {nameError && (
          <div className="invalid-feedback">
            {t('NAME_REQUIRED')}
          </div>
        )}
      </div>

      {/* <div className="mb-3">
        <label htmlFor="surname" className="form-label">
          {t('SURNAME_CONFIRM_LABEL')}
        </label>
        <input
          type="text"
          className={`form-control ${surnameError ? 'is-invalid' : ''}`}
          id="surname"
          value={surname}
          onChange={(e) => {
            setSurname(e.target.value);
            setSurnameError(false);
          }}
          placeholder={t('SURNAME_PLACEHOLDER')}
        />
        {surnameError && (
          <div className="invalid-feedback">
            {t('SURNAME_REQUIRED')}
          </div>
        )}
      </div> */}

      <MailForm
        submitHandle={handleSubmit}
        defaultEmail={userEmail ?? ""}
        showPrivacy={false}
        onErrors={formErrors}
      />
    </div>
  );
}