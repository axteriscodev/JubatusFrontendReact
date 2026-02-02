import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import FormErrors from "../models/form-errors";

import { useLoaderData, useNavigate, useParams } from "react-router-dom";

import SelfieUpload from "../components/SelfieUpload";
import MailForm from "../components/MailForm";
import Logo from "../components/Logo";
import { cartActions } from "../repositories/cart/cart-slice";
import { competitionsActions } from "../repositories/competitions/competitions-slice";
import { setUiPreset, setHeaderData } from "../utils/graphics";
import LanguageSelect from "../components/LanguageSelect";

export default function UploadSelfie() {
  // impostare un eventuale loader per caricare nome e logo evento, più eventuali altri dati
  const navigate = useNavigate();
  const eventData = useLoaderData();
  const dispatch = useDispatch();
  const { eventSlug, userHash } = useParams();
  const tagId = useSelector((state) => state.competition?.tagId);

  const [selfie, setSelfie] = useState({ image: null, licensePlate: "" });

  const [formErrors, setFormErrors] = useState(new FormErrors());

  // inserisco l'eventId nello store redux
  dispatch(cartActions.updateEventId(eventData.data.id));
  // inserisco il preset per l'evento nello store redux
  dispatch(competitionsActions.setCompetitionPreset(eventData.data));

  //carico tema evento
  useEffect(() => {
    setUiPreset(eventData.data);
    setHeaderData(eventData.data);
  }, []);

  //se l'utente ha già fatto una ricerca precedente ed aspetta solo il video
  //lo mando subito alla fase successiva
  useEffect(() => {
    if (userHash) {
      // reset del carrello
      dispatch(cartActions.resetStore());
      navigate("/processing-selfie", {
        state: {
          eventId: eventData.data.id,
          eventSlug: eventSlug,
          userHash: userHash,
        },
      });
    }
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

    // For motorsport events (tagId === 1), image is optional if license plate is provided
    if (tagId === 2 && selfie.licensePlate) {
      formErrors.imageError = false;
    } else {
      formErrors.imageError = !selfie.image ? true : false;
    }

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
        image: selfie.image,
        licensePlate: selfie.licensePlate || "",
        eventSlug: eventSlug,
        userHash: userHash,
      },
    });
  }

  return (
    <div className="form-sm">
      <div className="mb-3 d-flex justify-content-end">
        <LanguageSelect />
      </div>
      <div className="d-flex justify-content-center">
        <Logo
          src={import.meta.env.VITE_API_URL + "/" + eventData.data.logo}
          css="mb-sm"
        />
      </div>
      <SelfieUpload
        onDataChange={handleSelfieFromChild}
        onError={formErrors.imageError}
      />
      <MailForm
        submitHandle={handleSubmit}
        defaultEmail={""}
        onErrors={formErrors}
      />
    </div>
  );
}
