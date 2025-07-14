import { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function MailForm({
  userEmail,
  submitHandle,
  showPrivacy = true,
  onErrors,
}) {
  const [isChecked, setIsChecked] = useState(false);
  const email = useRef();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (event) => {
    setShow(true);
    event.preventDefault();
  }

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
        value={userEmail}
        placeholder="Inserisci la tua e-mail"
      />
      {onErrors.emailError && (
        <p className="on-error">Inserisci una mail valida</p>
      )}
      {onErrors.emailNotPresent && (<p className="on-error">La mail inserita non è presente. Effettua il tuo primo acquisto.</p>)}
      <div className="my-xs">
        {showPrivacy && (
          <>
            <div className="form-check form-switch switch-scale">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
                checked={isChecked}
                onChange={handlePrivacyChange}
              />
              <label className="form-check-label text-10" htmlFor="flexSwitchCheckDefault">
                Accettare
              </label>{" "}
              <a href="#" className="text-10" onClick={handleShow}>Termini e Policy</a>
            </div>
            <Modal show={show} onHide={handleClose} animation={false}>
              <Modal.Header closeButton>
                <Modal.Title><font className="text-black">Informativa sul trattamento dei dati personali</font></Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className="text-black">Ai sensi del Regolamento UE 2016/679, i dati personali raccolti tramite questo form saranno trattati da Jubatus S.r.l. per rispondere alla tua richiesta e per l’erogazione dei servizi richiesti. I dati potranno essere usati per finalità contrattuali, amministrative e, previo consenso, per comunicazioni promozionali.</p>
                <p className="text-black">Per maggiori dettagli consulta l’<a href="https://www.jubatus.it/utility/privacy-policy" target="_blank" className="text-primary">Informativa Privacy</a>.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="dark" onClick={handleClose}>Chiudi</Button>
              </Modal.Footer>
            </Modal>
          </>
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
