import { useState } from 'react';

import SelfieUpload from "../components/SelfieUpload";
import MailForm from "../components/MailForm";


/**
 * Pagina di caricamento del selfie e inserimento della email
 * 
 * @returns {React.ReactElement}  Pagina di caricamento selfie.
 */
export default function UploadSelfie() {
  // impostare un eventuale loader per caricare nome e logo evento, più eventuali altri dati

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

        const formData = new FormData();

        formData.append('email', emailFromChild);
        formData.append('image', selfie);

        fetch('http://localhost:8080/contents/fetch', {
            method: 'POST',
            body: formData
        });

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
