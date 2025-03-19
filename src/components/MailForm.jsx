import { useState } from "react";

export default function MailForm({ submitHandle, onDataChange }) {
  const [emailValue, setEmailValue] = useState("");

  const handleChange = (event) => {
    const newValue = event.target.value;
    setEmailValue(newValue);
    onDataChange(newValue);
  }

  return (
    <>
      <input type="email" value={emailValue} onChange={handleChange} name="email" />
      <button onClick={submitHandle}>Avanti</button>
    </>
  );
}
