import { useState, type ChangeEvent } from "react";
import validator from "validator";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { apiRequest } from "@common/services/api-services";
import { cartActions } from "../store/cart-slice";
import { createFormErrors } from "@common/models/form-errors";
import { useLanguage } from "@common/i18n/LanguageContext";
import { API } from "@common/services/api-endpoints";

interface SubmitData {
  email: string;
  privacy?: boolean;
}

/**
 * Hook per la conferma/modifica di email e nome dopo il pagamento.
 * Usato da MailConfirmation e PayAtCounter.
 * Chiama il backend per aggiornare i dati utente sull'ordine e invoca onSuccess() al completamento.
 */
export function useEmailConfirmation(onSuccess: () => void) {
  const dispatch = useAppDispatch();
  const { currentLanguage } = useLanguage();

  const userId = useAppSelector((state) => state.cart.userId);
  const orderId = useAppSelector((state) => state.cart.id);
  const fullName = useAppSelector((state) => state.cart.fullName);

  const [formErrors, setFormErrors] = useState(createFormErrors());
  const [name, setName] = useState(fullName ?? "");
  const [nameError, setNameError] = useState(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError(false);
  };

  const handleSubmit = async (data: SubmitData) => {
    try {
      const { email } = data;
      const errors = createFormErrors();

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
        api: API.CONFIRM_EMAIL,
        method: "POST",
        body,
      });

      if (response.ok) {
        const json = await response.json();

        // L'email è già associata a un altro utente sull'evento
        if (json.data.emailDuplicated) {
          errors.emailDuplicated = true;
          setFormErrors(errors);
          return;
        }

        // Aggiorna lo store solo se il backend ha effettivamente modificato i dati
        if (json.data.emailModified) {
          dispatch(cartActions.updateUserEmail(email));
        }
        if (json.data.nameModified) {
          dispatch(cartActions.updateUserName(name.trim()));
        }

        onSuccess();
      }
    } catch (err) {
      console.error(`Errore invio aggiornamento dati: ${err}`);
    }
  };

  return { name, nameError, formErrors, handleNameChange, handleSubmit };
}
