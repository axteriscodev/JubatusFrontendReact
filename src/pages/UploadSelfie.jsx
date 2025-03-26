import { useState } from "react";
import { useLoaderData, useNavigate } from 'react-router-dom';

import SelfieUpload from "../components/SelfieUpload";
import MailForm from "../components/MailForm";

/**
 * Pagina di caricamento del selfie e inserimento della email
 *
 * @returns {React.ReactElement}  Pagina di caricamento selfie.
 */
export default function UploadSelfie() {
  // impostare un eventuale loader per caricare nome e logo evento, più eventuali altri dati
  const navigate = useNavigate();
  const date = useLoaderData();

  const [emailFromChild, setEmailFromChild] = useState("");
  const [selfie, setSelfie] = useState();

  const handleEmailFromChild = (data) => {
    setEmailFromChild(data);
  };

  const handleSelfieFromChild = (data) => {
    setSelfie(data);
  };

  function handleSubmit(event) {
    event.preventDefault();

    console.log(emailFromChild);
    console.log(selfie);

    navigate("/processing-selfie", {
      state: { email: emailFromChild, selfie: selfie },
    });
  }

  return (
    <>
      <SelfieUpload onDataChange={handleSelfieFromChild} />
      <MailForm
        onDataChange={handleEmailFromChild}
        submitHandle={handleSubmit}
      />
    </>
  );
}

export async function loader({ request, params }) {
  //TODO - fetch nome evento, logo e altri dati

  const eventName = params.eventName;

  const response = await fetch("");

  if (!response.ok) {
    return Response(JSON.stringify(
      { message: "Errore nel caricamento dell'evento selezionato" },
      { status: 404 }
    ));
  } else {
    return response;
  }
}
