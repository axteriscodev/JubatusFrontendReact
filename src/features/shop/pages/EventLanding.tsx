import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import validator from "validator";
import { createFormErrors } from "@common/models/form-errors";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import Logo from "@common/components/Logo";
import { cartActions } from "@features/shop/store/cart-slice";
import { fetchPriceList } from "@features/shop/store/cart-actions";
import { setUiPreset, setHeaderData } from "@common/utils/graphics";
import LanguageSelect from "@common/components/LanguageSelect";
import { ROUTES } from "@/routes";
import type { Competition } from "@/types/competition";
import { competitionsActions } from "@/features/shop/store/competitions-slice";
import { useTranslations } from "@common/i18n/TranslationProvider";
import { isAdmin } from "@common/utils/auth";
import PreOrderForm from "../components/PreOrderForm";
import SelfieForm, { type SelfieFormSubmitData } from "../components/SelfieForm";

interface EventData {
  data: Partial<Competition> & {
    id: number;
    logo: string;
    bibNumber: boolean;
    slug: string;
    preOrder: boolean;
  };
}

export default function EventLanding() {
  const navigate = useNavigate();
  const eventData = useLoaderData() as EventData;
  const dispatch = useAppDispatch();
  const { eventSlug, userHash } = useParams<{ eventSlug: string; userHash?: string }>();
  const description = useAppSelector((state) => state.competition?.description);
  const showBibNumber = useAppSelector((state) => state.competition?.bibNumber);
  const { t } = useTranslations();

  const [formErrors, setFormErrors] = useState(createFormErrors());
  const [lastShopUrl, setLastShopUrl] = useState<string | null>(null);

  useEffect(() => {
    dispatch(cartActions.updateEventId(eventData.data.id));
    dispatch(competitionsActions.setCompetitionPreset(eventData.data as unknown as Competition));
    // Pulisce eventuale preordine selezionato in sessioni precedenti (persisted in Redux)
    dispatch(cartActions.unSelectPreorder());

    // Il listino prezzi serve solo per il flusso preordine
    if (eventData.data.preOrder) {
      dispatch(fetchPriceList(eventData.data.id));
    }
  }, []);

  useEffect(() => {
    // Separato dal precedente perché setUiPreset/setHeaderData agiscono sul DOM
    // e devono eseguire indipendentemente dalla logica di store
    setUiPreset(eventData.data as unknown as Competition);
    setHeaderData(eventData.data as unknown as Competition);
    // Recupera l'ultima URL di ricerca salvata per mostrare il pulsante "Torna all'ultima ricerca"
    const savedUrl = localStorage.getItem(`lastShopUrl_${eventSlug}`);
    if (savedUrl) setLastShopUrl(savedUrl);
  }, []);

  useEffect(() => {
    // userHash presente nell'URL significa che l'utente arriva da un link diretto (es. email)
    // con riconoscimento facciale già avviato: si salta il form e si va direttamente al processing
    if (userHash) {
      dispatch(cartActions.resetStore());
      navigate(ROUTES.PROCESSING_SELFIE, {
        state: { eventId: eventData.data.id, eventSlug, userHash },
      });
    }
  }, []);

  async function handleNormalSubmit(data: SelfieFormSubmitData) {
    const errors = createFormErrors({
      emailError: !validator.isEmail(data.email),
      privacyError: !data.privacy,
      // Se il bib number è abilitato e compilato, l'immagine non è obbligatoria
      // (il sistema recupera la foto tramite il numero pettorale)
      imageError: showBibNumber && data.bibNumber ? false : !data.image,
    });

    if (errors.emailError || errors.imageError || errors.privacyError) {
      setFormErrors(errors);
      return;
    }

    dispatch(cartActions.resetStore());
    navigate(ROUTES.PROCESSING_SELFIE, {
      state: {
        eventId: eventData.data.id,
        email: data.email,
        image: data.image,
        bibNumber: data.bibNumber || "",
        eventSlug,
        userHash,
      },
    });
  }

  if (eventData.data.preOrder) {
    return (
      <PreOrderForm
        eventId={eventData.data.id}
        onContinue={(pkg) => {
          dispatch(cartActions.selectPreorder(pkg));
          navigate(ROUTES.PREORDER_SELFIE);
        }}
      />
    );
  }

  return (
    <div className="form-sm">
      <div className="mb-1 sm:mb-3 flex justify-end">
        <LanguageSelect />
      </div>
      <div className="flex justify-center">
        <Logo
          src={import.meta.env.VITE_API_URL + "/" + eventData.data.logo}
          css="mb-3 sm:mb-10"
        />
      </div>
      <SelfieForm
        onSubmit={handleNormalSubmit}
        formErrors={formErrors}
        description={description}
      />
      {lastShopUrl && !isAdmin() && (
        <div className="mt-5">
          <button
            type="button"
            className="my-button w-full mb-4"
            onClick={() => { window.location.href = lastShopUrl; }}
          >
            {t("LAST_SEARCH") || "Torna all'ultima ricerca"}
          </button>
        </div>
      )}
    </div>
  );
}
