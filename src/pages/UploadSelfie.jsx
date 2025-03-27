import { useState } from "react";
import { useLoaderData, useNavigate } from 'react-router-dom';

import SelfieUpload from "../components/SelfieUpload";
import MailForm from "../components/MailForm";
import Stack from 'react-bootstrap/Stack';


/**
 * Pagina di caricamento del selfie e inserimento della email
 *
 * @returns {React.ReactElement}  Pagina di caricamento selfie.
 */
export default function UploadSelfie() {
  // impostare un eventuale loader per caricare nome e logo evento, più eventuali altri dati
  const navigate = useNavigate();
  const eventData = useLoaderData();

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
    <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 mx-auto">
      <img src="/images/oceanman_logo.jpeg" className="rounded-circle mb-sm"/>
      <SelfieUpload onDataChange={handleSelfieFromChild} />
      <MailForm
        onDataChange={handleEmailFromChild}
        submitHandle={handleSubmit}
      />
    </div>
  );
}

/**
 * Loader per caricare i dati dell'evento da visualizzare nella pagina
 * 
 * @param {*} request 
 * @param {String} params - i parametri passati all'url 
 * @returns 
 */
export async function loader({ request, params }) {

  const eventName = params.eventSlug;

  const response = await fetch(`http://localhost:8080/contents/event-data/${eventName}`);

  if (!response.ok) {
    return Response(JSON.stringify(
      { message: "Errore nel caricamento dell'evento selezionato" },
      { status: 404 }
    ));
  } else {
    return response;
  }
}
