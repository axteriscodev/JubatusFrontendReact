import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import validator from "validator";
import { createFormErrors } from "@common/models/form-errors";

import { useLoaderData, useNavigate, useParams } from "react-router-dom";

import MailForm from "@common/components/MailForm";
import Logo from "@common/components/Logo";
import { cartActions } from "@features/shop/store/cart-slice";
import { setUiPreset, setHeaderData } from "@common/utils/graphics";
import LanguageSelect from "@common/components/LanguageSelect";
import { ROUTES } from "@/routes";

import type { Competition } from "@/types/competition";
import { competitionsActions } from "@/features/shop/store/competitions-slice";
import SelfieUpload from "@/features/shop/components/SelfieUpload";

interface EventData {
  data: Partial<Competition> & {
    id: number;
    logo: string;
    bibNumber: boolean;
    slug: string;
  };
}

interface SelfieData {
  image: File | null;
  bibNumber: string;
}

export default function UploadSelfie() {
  const navigate = useNavigate();
  const eventData = useLoaderData() as EventData;
  const dispatch = useAppDispatch();
  const { eventSlug, userHash } = useParams<{
    eventSlug: string;
    userHash?: string;
  }>();
  const showBibNumber = useAppSelector((state) => state.competition?.bibNumber);
  const description = useAppSelector((state) => state.competition?.description);

  const [selfie, setSelfie] = useState<SelfieData>({
    image: null,
    bibNumber: "",
  });
  const [formErrors, setFormErrors] = useState(createFormErrors());

  // inserisco l'eventId nello store redux
  dispatch(cartActions.updateEventId(eventData.data.id));
  // inserisco il preset per l'evento nello store redux
  dispatch(
    competitionsActions.setCompetitionPreset(
      eventData.data as unknown as Competition,
    ),
  );

  //carico tema evento
  useEffect(() => {
    setUiPreset(eventData.data as unknown as Competition);
    setHeaderData(eventData.data as unknown as Competition);
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
  const handleSelfieFromChild = (data: SelfieData) => {
    setSelfie(data);
  };

  //invio del selfie
  async function handleSubmit(data: { email: string; privacy?: boolean }) {
    let errors = createFormErrors();

    console.log(data.email);
    console.log(data.privacy);

    errors.emailError = !validator.isEmail(data.email);

    // For motorsport events (tagId === 1), image is optional if license plate is provided
    if (showBibNumber && selfie.bibNumber) {
      errors.imageError = false;
    } else {
      errors.imageError = !selfie.image;
    }

    errors.privacyError = !data.privacy;

    if (errors.imageError || errors.emailError || errors.privacyError) {
      setFormErrors(errors);
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
        description={description}
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
