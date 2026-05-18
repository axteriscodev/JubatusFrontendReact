import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import validator from "validator";
import { createFormErrors } from "@common/models/form-errors";
import Logo from "@common/components/Logo";
import LanguageSelect from "@common/components/LanguageSelect";
import { useLanguage } from "@common/i18n/LanguageContext";
import { apiRequest } from "@common/services/api-services";
import { API } from "@common/services/api-endpoints";
import { ROUTES } from "@/routes";
import { cartActions } from "../store/cart-slice";
import SelfieForm, { type SelfieFormSubmitData } from "../components/SelfieForm";

export default function PreOrderSelfie() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const eventPreset = useAppSelector((state) => state.competition);
  const showBibNumber = useAppSelector((state) => state.competition?.bibNumber);
  const { currentLanguage } = useLanguage();

  const [formErrors, setFormErrors] = useState(createFormErrors());
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Se l'utente arriva qui senza aver selezionato un pacchetto, torna alla pagina evento
  useEffect(() => {
    if (!cart.selectedPreorder) {
      navigate(ROUTES.EVENT(eventPreset.slug), { replace: true });
    }
  }, []);

  async function handleSubmit(data: SelfieFormSubmitData) {
    setApiError(null);

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

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("eventId", String(cart.eventId));
      formData.append("priceListItemId", String(cart.selectedPreorder!.id));
      formData.append("email", data.email);
      formData.append("lang", currentLanguage.acronym);
      if (data.image) formData.append("selfie", data.image);
      if (data.bibNumber) formData.append("bibNumber", data.bibNumber);

      // Il preordine è pubblico: non richiede autenticazione
      const res = await apiRequest({
        api: API.CREATE_PREORDER,
        method: "POST",
        body: formData,
        needAuth: false,
      });

      if (!res.ok) throw new Error("Errore nella creazione del preordine.");

      const result = await res.json();
      const { orderId, isFree, payments } = result.data;

      dispatch(cartActions.updateOrderId(orderId));

      // replace:true impedisce di tornare indietro con il tasto "back" dopo la sottomissione
      if (isFree) {
        navigate(ROUTES.MAIL_CONFIRMATION, { replace: true });
      } else if (payments?.some((p: { id: number }) => p.id === 2)) {
        // payment id 2 = contanti: nessun gateway, si mostra solo la conferma via mail
        navigate(ROUTES.MAIL_CONFIRMATION, { replace: true, state: { isCash: true, orderId } });
      } else {
        navigate(ROUTES.CHECKOUT, { replace: true, state: { paymentId: payments[0].id, orderId } });
      }
    } catch (error) {
      console.error("Errore preordine:", error);
      setApiError("Si è verificato un errore. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="form-sm">
      <div className="mb-1 sm:mb-3 flex justify-end">
        <LanguageSelect />
      </div>
      <div className="flex justify-center">
        <Logo
          src={import.meta.env.VITE_API_URL + "/" + eventPreset.logo}
          css="mb-3 sm:mb-10"
        />
      </div>
      <SelfieForm
        onSubmit={handleSubmit}
        formErrors={formErrors}
        description={eventPreset.description}
        isLoading={isLoading}
      />
      {apiError && <p className="on-error text-center mt-4">{apiError}</p>}
    </div>
  );
}
