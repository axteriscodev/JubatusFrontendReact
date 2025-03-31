import { useState, useRef } from "react";
import Form from "react-bootstrap/Form";

export default function PinForm({ submitHandle }) {
  const pin = useRef();

  return (
    <>
      <h3>Inserisci il PIN ricevuto via mail</h3>
      <Form.Control ref={pin} type="text" name="pin" />
      <button
        onClick={(event) => submitHandle(event, { pin: pin.current.value })}
      >
        Avanti
      </button>
    </>
  );
}
