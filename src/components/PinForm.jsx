import { useState } from "react";
import Form from 'react-bootstrap/Form';

export default function PinForm({ submitHandle, onDataChange }) {
    const [pinValue, setPinValue] = useState("");

    const handlePinChange = (event) => {
      const newValue = event.target.value;
      setPinValue(newValue);
      onDataChange(newValue);
    };
  
    return (
      <>
        <h1>Inserisci il PIN ricevuto via mail</h1>
        <Form.Control
          type="text"
          value={pinValue}
          onChange={handlePinChange}
          name="pin"
        />
        <button onClick={submitHandle}>Avanti</button>
      </>
    );
}