import PinForm from "../components/PinForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../services/api-services";
import { setAuthToken } from "../utils/auth";

export default function PinVerification() {
  const navigate = useNavigate();
  const emailValue = useSelector((state) => state.user.email);

  async function handleSubmit(event, data) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("email", emailValue);
    formData.append("token", data.pin);

    const response = await sendRequest(
      import.meta.env.VITE_API_URL + "/auth/validate",
      "POST",
      formData
    );

    if (response.ok) {
      const json = await response.json();
      setAuthToken(json.data.jwt);
      navigate("/image-shop");
    }
  }

  return (
    <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 mx-auto">
      <PinForm submitHandle={handleSubmit} />
    </div>
  );
}
