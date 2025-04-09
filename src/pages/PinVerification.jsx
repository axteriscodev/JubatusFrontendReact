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

    const response = await fetch(
      import.meta.env.VITE_API_URL + "/auth/validate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
          token: data.pin,
        }),
      }
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
      throw new Response(response.message, { status: response.status });
    }
  }

  return (
    <div className="form form-sm">
      <h1 className="mb-md">Accedi ai tuoi contenuti!</h1>
      <PinForm submitHandle={handleSubmit} />
    </div>
  );
}
