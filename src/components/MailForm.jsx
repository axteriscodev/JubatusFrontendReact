import { useState } from "react";
import Form from "react-bootstrap/Form";

export default function MailForm({
  submitHandle,
  onDataChange,
  showPrivacy = true,
}) {
  const [emailValue, setEmailValue] = useState("");

  const handleEmailChange = (event) => {
    const newValue = event.target.value;
    setEmailValue(newValue);
    onDataChange(newValue);
  };

  return (
    <div>
      <Form.Control
        type="email"
        value={emailValue}
        onChange={handleEmailChange}
        name="email"
        placeholder="Inserisci la tua e-mail"
      />
      <div className="my-xs">
        {showPrivacy && (
          <div className="form-check form-switch text-start">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
            />
            <label class="form-check-label" for="flexSwitchCheckDefault">
              Accettare
            </label>{" "}
            <a href="#">Termini e Policy</a>
          </div>
        )}
      </div>
      <button className="my-button w-100" onClick={submitHandle}>
        Avanti &gt;
      </button>
    </div>
  );
}
