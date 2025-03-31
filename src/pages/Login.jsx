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
    }
  }

  return (
    <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 mx-auto">
      <h1>Login</h1>
      <MailForm
        submitHandle={handleSubmit}
        showPrivacy={false}
        onErrors={formErrors}
      />
      <Link to="/event/evento-test-mod">Selfie upload</Link>
      <Link to="/checkout">Checkout</Link>
    </div>
  );
}
