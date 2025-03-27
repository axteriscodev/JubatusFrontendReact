import { useState } from "react";
import PinForm from "../components/PinForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userActions } from "../repositories/user/user-slice";

export default function PinVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pinValue, setPinValue] = useState("");
  const photoItems = useSelector((state) => state.user.email);

  const handlePin = (data) => {
    setPinValue(data);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    console.log(pinValue);

    const formData = new FormData();
    formData.append("email", emailValue);
    formData.append("token", tokenValue);
    
    const response = await sendRequest('http://localhost:8080/auth/validate', 'POST', formData);

    if(response.ok) {
      dispatch(userActions.updateJwl({jwt: emailValue}));
      navigate('/image-shop');
    }

  }


  return (
    <>
      <PinForm onDataChange={handlePin} submitHandle={handleSubmit} />
    </>
  );
}
