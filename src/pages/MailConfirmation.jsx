import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from "../services/api-services";
import { cartActions } from "../repositories/cart/cart-slice";

import MailForm from "../components/MailForm";
import FormErrors from "../models/form-errors";

export default function MailConfirmation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.cart.userId);
  const orderId = useSelector((state) => state.cart.id);
  const userEmail = useSelector((state) => state.cart.userEmail);
  const [formErrors, setFormErrors] = useState(new FormErrors());

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

      let body = JSON.stringify({ userId, orderId, email });
      console.log(`body: ${body}`);
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/customer/confirm-email",
        method: "POST",
        body: body,
      });
      if (response.ok) {
        console.log("risposta ok");
        dispatch(cartActions.updateUserEmail(email));
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
            <h2 className="mb-sm">Acquisto completato!</h2>
            <h4 className="">Inserisci la tua email</h4>
            <p>
              Per accedere alla tua area personale è necessario un indirizzo
              email valido.
            </p>
          </>
        ) : (
          <>
            <h2 className="mb-sm">Acquisto completato!</h2>
            <p>
              Con l’email <strong>{userEmail}</strong> potrai accedere alla tua
              area personale. <br />
              Se è sbagliata, puoi correggerla ora.
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
