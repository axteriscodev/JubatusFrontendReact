import { useEffect, useState } from "react";
import { Form, Tabs, Tab } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  addCompetition,
  editCompetition,
} from "../../repositories/admin-competitions/admin-competitions-actions";
import { errorToast, successToast } from "../../utils/toast-manager";

// Hooks personalizzati
import { useEventForm } from "./hooks/useEventForm";
import { usePriceLists } from "./hooks/usePriceLists";
import { useTags } from "./hooks/useTags";
import { useCurrencies } from "./hooks/useCurrencies";
import { useListItemLabels } from "./hooks/useListItemLabels";
import { useFormValidation } from "./hooks/useFormValidation";

// Componenti
import { EventBasicInfo } from "./components/EventBasicInfo";
import { EventDates } from "./components/EventDates";
import { EventColors } from "./components/EventColors";
import { EventLogo } from "./components/EventLogo";
import { PriceListSection } from "./components/PriceListSection";
import { FormActions } from "./components/FormActions";
import { ParticipantsUpload } from "./components/ParticipantsUpload";
import { PartecipantsTable } from "./components/PartecipantsTable";

// Utilities
import { prepareSubmitData, getDefaultPriceLists } from "./utils/eventFormHelpers";

/**
 * Pagina per la creazione/modifica dell'evento
 */
export default function CreateEvent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const receivedComp = useLocation().state;

  // State per gestire le tab
  const [activeTab, setActiveTab] = useState("info");

  // Custom hooks per gestire lo stato
  const {
    formData,
    handleInputChange,
    handleTitleChange,
    handleFileChange,
    updateField,
  } = useEventForm(receivedComp);

  const priceListHandlers = usePriceLists(
    receivedComp?.lists || getDefaultPriceLists()
  );

  const { tagList, loading: tagsLoading } = useTags();
  const { currencyList, loading: currenciesLoading } = useCurrencies();
  const { labelList, loading: labelsLoading } = useListItemLabels();
  const { errors, validateForm, clearFieldError } = useFormValidation();

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
    // Validazione form
    if (!validateForm(formData)) {
      errorToast("Compila tutti i campi obbligatori");
      setActiveTab("info"); // Torna alla tab info per mostrare gli errori
      return;
    }

    const submitData = prepareSubmitData(formData, priceListHandlers.priceLists);

    let result;
    if (submitData.id) {
      result = await dispatch(editCompetition(submitData));
    } else {
      result = await dispatch(addCompetition(submitData));
    }

    if (result.success) {
      successToast("Evento salvato con successo!");

      // Se è un nuovo evento, aggiornare formData con l'ID
      if (!submitData.id && result.data?.id) {
        updateField('id', result.data.id);
      }

      // Rimaniamo sulla pagina - NON navighiamo verso /admin
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
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          {/* Tab 1: Info evento */}
          <Tab eventKey="info" title="Info evento">
            <div className="mt-3">
              <EventBasicInfo
                formData={formData}
                onInputChange={handleInputChange}
                onTitleChange={handleTitleChange}
                tagList={tagList}
                currencyList={currencyList}
                errors={errors}
                onClearError={clearFieldError}
              />
              <EventDates formData={formData} onInputChange={handleInputChange} errors={errors} onClearError={clearFieldError} />
              <EventColors formData={formData} onInputChange={handleInputChange} />
              <EventLogo
                formData={formData}
                receivedComp={receivedComp}
                onFileChange={handleFileChange}
              />
            </div>
          </Tab>

          {/* Tab 2: Listini prezzi */}
          <Tab eventKey="priceLists" title="Listini prezzi">
            <div className="mt-3">
              <PriceListSection
                priceLists={priceListHandlers.priceLists}
                handlers={priceListHandlers}
                currencySymbol={currencyList.find(c => c.id === Number(formData.currencyId))?.symbol || "€"}
                labelList={labelList}
              />
            </div>
          </Tab>

          {/* Tab 3: Partecipanti (condizionale) */}
          {formData.id && formData.verifiedAttendanceEvent && (
            <Tab eventKey="participants" title="Partecipanti">
              <div className="mt-3">
                <ParticipantsUpload eventId={formData.id} />

                <hr className="my-4" />

                <PartecipantsTable eventId={formData.id} />
              </div>
            </Tab>
          )}
        </Tabs>

        {/* Azioni sempre visibili fuori dalle tab */}
        <FormActions onSubmit={handleSubmit} onCancel={handleReturnToList} />
      </Form>
    </div>
  );
}

