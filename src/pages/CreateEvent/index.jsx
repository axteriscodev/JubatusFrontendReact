import { useEffect } from "react";
import { Form } from "react-bootstrap";
import { useNavigate, useLocation, redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  addCompetition,
  editCompetition,
} from "../../repositories/admin-competitions/admin-competitions-actions";
import { isAdmin } from "../../utils/auth";
import { errorToast, successToast } from "../../utils/toast-manager";

// Hooks personalizzati
import { useEventForm } from "./hooks/useEventForm";
import { usePriceLists } from "./hooks/usePriceLists";
import { useTags } from "./hooks/useTags";

// Componenti
import { EventBasicInfo } from "./components/EventBasicInfo";
import { EventDates } from "./components/EventDates";
import { EventColors } from "./components/EventColors";
import { EventLogo } from "./components/EventLogo";
import { PriceListSection } from "./components/PriceListSection";
import { FormActions } from "./components/FormActions";

// Utilities
import { prepareSubmitData, getDefaultPriceLists } from "./utils/eventFormHelpers";

/**
 * Pagina per la creazione/modifica dell'evento
 */
export default function CreateEvent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const receivedComp = useLocation().state;

  // Custom hooks per gestire lo stato
  const {
    formData,
    handleInputChange,
    handleTitleChange,
    handleFileChange,
  } = useEventForm(receivedComp);

  const priceListHandlers = usePriceLists(
    receivedComp?.lists || getDefaultPriceLists()
  );

  const { tagList, loading: tagsLoading } = useTags();

  // Effetto per aggiungere/rimuovere classe admin al body
  useEffect(() => {
    document.body.classList.add("admin");
    return () => {
      document.body.classList.remove("admin");
    };
  }, []);

  /**
   * Gestisce il submit del form
   */
  const handleSubmit = async () => {
    const submitData = prepareSubmitData(formData, priceListHandlers.priceLists);

    let outcome = false;
    if (submitData.id) {
      outcome = await dispatch(editCompetition(submitData));
    } else {
      outcome = await dispatch(addCompetition(submitData));
    }

    if (outcome) {
      successToast("Evento salvato con successo!");
      navigate("/admin");
    } else {
      errorToast("Si è verificato un errore durante il salvataggio");
    }
  };

  /**
   * Gestisce il ritorno alla lista eventi
   */
  const handleReturnToList = () => {
    navigate("/admin");
  };

  return (
    <div className="container text-start">
      <h1>Gestione evento</h1>
      
      <Form>
        {/* Informazioni base */}
        <EventBasicInfo
          formData={formData}
          onInputChange={handleInputChange}
          onTitleChange={handleTitleChange}
          tagList={tagList}
        />

        {/* Date */}
        <EventDates formData={formData} onInputChange={handleInputChange} />

        {/* Colori */}
        <EventColors formData={formData} onInputChange={handleInputChange} />

        {/* Logo */}
        <EventLogo
          formData={formData}
          receivedComp={receivedComp}
          onFileChange={handleFileChange}
        />

        {/* Listini prezzi */}
        <PriceListSection
          priceLists={priceListHandlers.priceLists}
          handlers={priceListHandlers}
        />

        {/* Azioni */}
        <FormActions onSubmit={handleSubmit} onCancel={handleReturnToList} />
      </Form>
    </div>
  );
}

/**
 * Loader per verificare i permessi admin
 */
export function loader() {
  if (!isAdmin()) {
    return redirect("/");
  }
  return null;
}