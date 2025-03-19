import { useState } from 'react';

import SelfieUpload from "../components/SelfieUpload";
import MailForm from "../components/MailForm";

export default function UploadSelfie() {
    const [emailFromChild, setEmailFromChild] = useState('');

    const handleEmailFromChild = (data) => {
        setEmailFromChild(data);
    }


    function handleSubmit(event) {
        event.preventDefault();

        console.log(emailFromChild);
    }

  return (
    <>
      <SelfieUpload />
      <MailForm onDataChange={handleEmailFromChild} submitHandle={handleSubmit}/>
    </>
  );
}
