import { useState } from "react";
import Form from "react-bootstrap/Form";

export default function MailForm({
  submitHandle,
  showPrivacy = true,
  onErrors,
}) {
  const [emailValue, setEmailValue] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleEmailChange = (event) => {
    const newValue = event.target.value;
    setEmailValue(newValue);
    //onEmailDataChange(newValue);
  };

  const handlePrivacyChange = (event) => {
    const newValue = event.target.checked;
    setIsChecked(newValue);
    //onPrivacyDataChange(newValue);
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
      {onErrors.emailError && (
        <p className="on-error">Inserisci una mail valida</p>
      )}
      <div className="my-xs">
        {showPrivacy && (
          <div className="form-check form-switch text-start">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              checked={isChecked}
              onChange={handlePrivacyChange}
            />
            <label class="form-check-label" for="flexSwitchCheckDefault">
              Accettare
            </label>{" "}
            <a href="#">Termini e Policy</a>
          </div>
        )}
        {onErrors.privacyError && (
          <p className="on-error">Devi accettare la privacy policy</p>
        )}
      </div>
      <button
        className="my-button w-100"
        onClick={(event) => submitHandle(event, { email: emailValue, privacy: isChecked })}
      >
        Avanti &gt;
      </button>
    </div>
  );
}
