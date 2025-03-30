import { useState } from "react";
import PinForm from "../components/PinForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../services/api-services";
import { setAuthToken } from "../utils/auth";

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
      setAuthToken(json.data.jwt);
      navigate('/image-shop');
    }
  }

  return (
    <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 mx-auto">
      <PinForm onDataChange={handlePin} submitHandle={handleSubmit} />
    </div>
  );
}
