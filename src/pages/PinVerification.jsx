import { useState } from "react";
import PinForm from "../components/PinForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userActions } from "../repositories/user/user-slice";
import { sendRequest } from "../services/api-services";

export default function PinVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pinValue, setPinValue] = useState("");
  const emailValue = useSelector((state) => state.user.email);

  const handlePin = (data) => {
    setPinValue(data);
  };

  async function handleSubmit(event) {
    event.preventDefault();

    console.log(pinValue);

    const formData = new FormData();
    formData.append('email', emailValue);
    formData.append('token', pinValue);

    const response = await sendRequest(
      "http://localhost:8080/auth/validate",
      "POST",
      formData
    );

    if (response.ok) {
      const json = await response.json();
      dispatch(userActions.updateJwt(json.data.jwt));
      navigate('/image-shop');
    }
  }

  return (
    <>
      <PinForm onDataChange={handlePin} submitHandle={handleSubmit} />
    </>
  );
}
