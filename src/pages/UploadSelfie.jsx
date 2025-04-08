import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import validator from "validator";
import FormErrors from "../models/form-errors";

import { useLoaderData, useNavigate } from "react-router-dom";

import SelfieUpload from "../components/SelfieUpload";
import MailForm from "../components/MailForm";
import Logo from "../components/Logo";
import { cartActions } from "../repositories/cart/cart-slice";
import { competitionsActions } from "../repositories/competitions/competitions-slice";
import { setUiPreset } from "../utils/graphics";

export default function UploadSelfie() {
  // impostare un eventuale loader per caricare nome e logo evento, più eventuali altri dati
  const navigate = useNavigate();
  const eventData = useLoaderData();
  const dispatch = useDispatch();

  const [selfie, setSelfie] = useState();

  const [formErrors, setFormErrors] = useState(new FormErrors());

  // inserisco l'eventId nello store redux
  dispatch(cartActions.updateEventId(eventData.data.id));
  // inserisco il preset per l'evento nello store redux
  dispatch(competitionsActions.setCompetitionPreset(eventData.data));

  useEffect(() => {
    setUiPreset(eventData.data);
  }, []);

  // callback selfie
  const handleSelfieFromChild = (data) => {
    setSelfie(data);
  };

  //invio del selfie
  async function handleSubmit(event, data) {
    event.preventDefault();

    let formErrors = new FormErrors();

    console.log(data.email);
    console.log(data.privacy);

    formErrors.emailError = !validator.isEmail(data.email);
    formErrors.imageError = !selfie ? true : false;
    formErrors.privacyError = !data.privacy;

    if (
      formErrors.imageError ||
      formErrors.emailError ||
      formErrors.privacyError
    ) {
      setFormErrors(formErrors);
      return;
    }

    // reset del carrello
    dispatch(cartActions.resetStore());

    navigate("/processing-selfie", {
      state: {
        eventId: eventData.data.id,
        email: data.email,
        image: selfie,
      },
    });
  }

  return (
    <div className="form-sm">
      <Logo
        src={import.meta.env.VITE_API_URL + "/" + eventData.data.logo}
        css="mb-sm"
      />
      <SelfieUpload
        onDataChange={handleSelfieFromChild}
        onError={formErrors.imageError}
      />
      <MailForm submitHandle={handleSubmit} onErrors={formErrors} />
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
    import.meta.env.VITE_API_URL + `/contents/event-data/${eventName}`
  );

  if (!response.ok) {
    let message = "Si è verificato un errore o l'evento non è presente";
 
    if (response.status === 204) {
      message = "Nessun contenuto presente";
    }

    throw new Response(message, { status: response.status });
  } else {
    return response;
  }
}
