import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendRequest } from "../services/api-services";
import { userActions } from "../repositories/user/user-slice";
import validator from "validator";
import MailForm from "../components/MailForm";
import FormErrors from "../models/form-errors";

/**
 * Pagina di login
 *
 * @returns {React.ReactElement}  Pagina Login.
 */
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState(new FormErrors());

  async function handleSubmit(event, data) {
    event.preventDefault();

    let formErrors = new FormErrors();

    console.log(data.email);

    formErrors.emailError = !validator.isEmail(data.email);

    if (formErrors.emailError) {
      setFormErrors(formErrors);
      return;
    }

    const formData = new FormData();
    formData.append('email', data.email);

    const response = await sendRequest(
      import.meta.env.VITE_API_URL + '/auth/signin',
      'POST',
      formData
    );

    if (response.ok) {
      dispatch(userActions.updateEmail(data.email));
      navigate('/pin-verification');
    } else {
      throw Response(
        JSON.stringify({ status: response.status, message: response.message })
      );
    }
  }

  return (
    <div className="form form-sm">
      <h1 className="mb-md">Accedi ai tuoi contenuti!</h1>
      <MailForm
        submitHandle={handleSubmit}
        showPrivacy={false}
        onErrors={formErrors}
      />
      <Link to="/event/nova-eroica">Selfie upload</Link>
      <Link to="/checkout">Checkout</Link>
    </div>
  );
}
