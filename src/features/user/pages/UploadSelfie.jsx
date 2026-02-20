import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import { createFormErrors } from "@common/models/form-errors";

import { useLoaderData, useNavigate, useParams } from "react-router-dom";

import SelfieUpload from "../components/SelfieUpload";
import MailForm from "@common/components/MailForm";
import Logo from "@common/components/Logo";
import { cartActions } from "@features/shop/store/cart-slice";
import { competitionsActions } from "../store/competitions-slice";
import { setUiPreset, setHeaderData } from "@common/utils/graphics";
import LanguageSelect from "@common/components/LanguageSelect";
import { ROUTES } from "@/routes";

export default function UploadSelfie() {
  // impostare un eventuale loader per caricare nome e logo evento, più eventuali altri dati
  const navigate = useNavigate();
  const eventData = useLoaderData();
  const dispatch = useDispatch();
  const { eventSlug, userHash } = useParams();
  const showBibNumber = useSelector((state) => state.competition?.bibNumber);

  const [selfie, setSelfie] = useState({ image: null, bibNumber: "" });

  const [formErrors, setFormErrors] = useState(createFormErrors());

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
      navigate(ROUTES.PROCESSING_SELFIE, {
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

    let formErrors = createFormErrors();

    console.log(data.email);
    console.log(data.privacy);

    formErrors.emailError = !validator.isEmail(data.email);

    // For motorsport events (tagId === 1), image is optional if license plate is provided
    if (showBibNumber && selfie.bibNumber) {
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

    navigate(ROUTES.PROCESSING_SELFIE, {
      state: {
        eventId: eventData.data.id,
        email: data.email,
        image: selfie.image,
        bibNumber: selfie.bibNumber || "",
        eventSlug: eventSlug,
        userHash: userHash,
      },
    });
  }

  return (
    <div className="form-sm">
      <div className="mb-3 flex justify-end">
        <LanguageSelect />
      </div>
      <div className="flex justify-center">
        <Logo
          src={import.meta.env.VITE_API_URL + "/" + eventData.data.logo}
          css="mb-10"
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
        externalPayment={false}
      />
    </div>
  );
}
