import { useState } from "react";
import { useDispatch } from "react-redux";
import validator from "validator";
import FormErrors from "../models/form-errors";

import { useLoaderData, useNavigate } from "react-router-dom";

import SelfieUpload from "../components/SelfieUpload";
import MailForm from "../components/MailForm";
import Logo from "../components/Logo";
import { cartActions } from "../repositories/cart/cart-slice";

/**
 * Pagina di caricamento del selfie e inserimento della email
 *
 * @returns {React.ReactElement}  Pagina di caricamento selfie.
 */
export default function UploadSelfie() {
  // impostare un eventuale loader per caricare nome e logo evento, più eventuali altri dati
  const navigate = useNavigate();
  const eventData = useLoaderData();
  const dispatch = useDispatch();

  const [emailFromChild, setEmailFromChild] = useState("");
  const [selfie, setSelfie] = useState();
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);

  const [formErrors, setFormErrors] = useState(new FormErrors());

  // inserisco l'eventId nello store redux
  dispatch(cartActions.updateEventId(eventData.data.id));

  // callback email
  const handleEmailFromChild = (data) => {
    setEmailFromChild(data);
  };

  // callback privacy policy
  const handlePrivacyPolicy = (data) => {
    setAcceptPrivacyPolicy(data);
  };

  // callback selfie
  const handleSelfieFromChild = (data) => {
    setSelfie(data);
  };

  //invio del selfie
  async function handleSubmit(event) {
    event.preventDefault();

    let formErrors = new FormErrors();

    console.log(emailFromChild);
    console.log(selfie);

    formErrors.emailError = !validator.isEmail(emailFromChild);
    formErrors.imageError = !selfie ? true : false;
    formErrors.privacyError = !acceptPrivacyPolicy;

    if (
      formErrors.imageError ||
      formErrors.emailError ||
      formErrors.privacyError
    ) {
      setFormErrors(formErrors);
      return;
    }

    navigate("/processing-selfie", {
      state: {
        eventId: eventData.data.id,
        email: emailFromChild,
        image: selfie,
      },
    });
  }

  return (
    <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 mx-auto">
      <Logo css="mb-sm" />
      <SelfieUpload
        onDataChange={handleSelfieFromChild}
        onError={formErrors.imageError}
      />
      <MailForm
        onEmailDataChange={handleEmailFromChild}
        onPrivacyDataChange={handlePrivacyPolicy}
        submitHandle={handleSubmit}
        onErrors={formErrors}
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

  const response = await fetch(
    `http://localhost:8080/contents/event-data/${eventName}`
  );

  if (!response.ok) {
    let message;

    if (response.status === 204) {
      message = "Nessun contenuto presente";
    }

    throw Response(
      JSON.stringify({ message: message }, { status: response.status })
    );
  } else {
    return response;
  }
}
