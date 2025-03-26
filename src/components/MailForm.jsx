import { useState } from "react";
import Form from 'react-bootstrap/Form';


export default function MailForm({ submitHandle, onDataChange }) {
  const [emailValue, setEmailValue] = useState("");

  const handleEmailChange = (event) => {
    const newValue = event.target.value;
    setEmailValue(newValue);
    onDataChange(newValue);
  };

  return (
    <>
      <Form.Control
        type="email"
        value={emailValue}
        onChange={handleEmailChange}
        name="email"
      />
      <button onClick={submitHandle}>Avanti</button>
    </>
  );
}
