import { useState, useRef } from "react";
import Form from "react-bootstrap/Form";

export default function PinForm({ submitHandle }) {
  const pin = useRef();

  return (
    <div className="text-start">
      <Form.Label>PIN</Form.Label>
      <Form.Control ref={pin} type="text" name="pin" placeholder="PIN ricevuto per e-mail" />
      <button
        className="my-button w-100 mt-sm"
        onClick={(event) => submitHandle(event, { pin: pin.current.value })}
      >
        Avanti
      </button>
    </div>
  );
}
