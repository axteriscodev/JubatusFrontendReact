import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { sendRequest } from "../services/api-services";
import { userActions } from "../repositories/user/user-slice";
import MailForm from "../components/MailForm";

/**
 * Pagina di login
 *
 * @returns {React.ReactElement}  Pagina Login.
 */
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailValue, setEmailValue] = useState("");


  const handleEmail = (data) => {
    setEmailValue(data);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    console.log(emailValue);

    const formData = new FormData();
    formData.append('email', emailValue);
    
    const response = await sendRequest('http://localhost:8080/auth/signin', 'POST', formData);

    if(response.ok) {
      dispatch(userActions.updateEmail(emailValue));
      navigate('/pin-verification');
    }

  }

  return (
    <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 mx-auto">
      <h1>Login</h1>
      <MailForm onDataChange={handleEmail} submitHandle={handleSubmit} showPrivacy={false}/>
      <Link to="/event/evento-test-mod">Selfie upload</Link>
      <Link to="/checkout">Checkout</Link>
    </div>
  );
}
