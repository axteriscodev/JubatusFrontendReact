import { useState, useRef } from "react";
import Form from "react-bootstrap/Form";

export default function MailForm({
  submitHandle,
  showPrivacy = true,
  onErrors,
}) {
  const [isChecked, setIsChecked] = useState(false);
  const email = useRef();

  const handlePrivacyChange = (event) => {
    const newValue = event.target.checked;
    setIsChecked(newValue);
  };

  return (
    <div className="text-start">
      <Form.Label>E-mail</Form.Label>
      <Form.Control
        ref={email}
        type="email"
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
        className="my-button w-100 mt-sm"
        onClick={(event) => submitHandle(event, { email: email.current.value, privacy: isChecked })}
      >
        Avanti &gt;
      </button>
    </div>
  );
}
