import { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function MailForm({
  submitHandle,
  showPrivacy = true,
  onErrors,
}) {
  const [isChecked, setIsChecked] = useState(false);
  const email = useRef();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
            <Button variant="link" onClick={handleShow}>Termini e Policy</Button>
            <Modal show={show} onHide={handleClose} animation={false}>
              <Modal.Header closeButton>
                <Modal.Title>Informativa privacy policy</Modal.Title>
              </Modal.Header>
              <Modal.Body>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Modal.Body>
              <Modal.Footer>
                <Button variant="dark" onClick={handleClose}>Chiudi</Button>
              </Modal.Footer>
            </Modal>
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
