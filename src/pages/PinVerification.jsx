import PinForm from "../components/PinForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../services/api-services";
import { setAuthToken, setLevel } from "../utils/auth";

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
      setLevel(json.data.levelId);
      if (json.levelId <= 1) {
        navigate("/admin");
      } else {
        navigate("/personal");
      }
    } else {
      throw Response(
        JSON.stringify({ status: response.status, message: response.message })
      );
    }
  }

  return (
    <div className="form form-sm">
      <h1 className="mb-md">Accedi ai tuoi contenuti!</h1>
      <PinForm submitHandle={handleSubmit} />
    </div>
  );
}
