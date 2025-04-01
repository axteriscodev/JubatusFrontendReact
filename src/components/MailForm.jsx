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
    <div>
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
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              checked={isChecked}
              onChange={handlePrivacyChange}
            />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
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
        onClick={(event) => submitHandle(event, { email: email.current.value, privacy: isChecked })}
      >
        Avanti &gt;
      </button>
    </div>
  );
}
