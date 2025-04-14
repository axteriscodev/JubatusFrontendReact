import { useRef } from "react";
import Form from "react-bootstrap/Form";

export default function PinForm({ submitHandle, onErrors }) {
  const pin = useRef();

  return (
    <div className="text-start">
      <Form.Label>PIN</Form.Label>
      <Form.Control
        ref={pin}
        type="text"
        name="pin"
        placeholder="PIN ricevuto per e-mail"
      />
      {onErrors.pinError && <p className="on-error">Pin non valido</p>}

      <button
        className="my-button w-100 mt-sm"
        onClick={(event) => submitHandle(event, { pin: pin.current.value?.trim() })}
      >
        Avanti
      </button>
    </div>
  );
}
