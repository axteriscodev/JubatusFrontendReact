import { useState } from 'react';

import SelfieUpload from "../components/SelfieUpload";
import MailForm from "../components/MailForm";

export default function UploadSelfie() {
    const [emailFromChild, setEmailFromChild] = useState('');
    const [selfie, setSelfie] = useState();

    const handleEmailFromChild = (data) => {
        setEmailFromChild(data);
    }

    const handleSelfieFromChild = (data) => {
        setSelfie(data);
    }


    function handleSubmit(event) {
        event.preventDefault();

        console.log(emailFromChild);
        console.log(selfie);
    }

  return (
    <>
      <SelfieUpload onDataChange={handleSelfieFromChild} />
      <MailForm onDataChange={handleEmailFromChild} submitHandle={handleSubmit}/>
    </>
  );
}
