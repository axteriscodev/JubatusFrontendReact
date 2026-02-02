import { useEffect, useState } from "react";
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
        updateField("id", result.data.id);
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

  // Definizione delle tab
  const tabs = [
    { key: "info", label: "Info evento" },
    { key: "priceLists", label: "Listini prezzi" },
    // Tab partecipanti condizionale
    ...(formData.id && formData.verifiedAttendanceEvent
      ? [{ key: "participants", label: "Partecipanti" }]
      : []),
  ];

  return (
    <div className="container mx-auto px-4 text-left">
      <h1 className="text-2xl font-bold mb-4">Gestione evento</h1>

      <form>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-3">
          <nav className="flex gap-1" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors
                  ${
                    activeTab === tab.key
                      ? "bg-white border border-b-white border-gray-200 -mb-px text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-3">
          {/* Tab 1: Info evento */}
          {activeTab === "info" && (
            <div>
              <EventBasicInfo
                formData={formData}
                onInputChange={handleInputChange}
                onTitleChange={handleTitleChange}
                tagList={tagList}
              />
              <EventDates formData={formData} onInputChange={handleInputChange} />
              <EventColors formData={formData} onInputChange={handleInputChange} />
              <EventLogo
                formData={formData}
                receivedComp={receivedComp}
                onFileChange={handleFileChange}
              />
            </div>
          )}

          {/* Tab 2: Listini prezzi */}
          {activeTab === "priceLists" && (
            <div>
              <PriceListSection
                priceLists={priceListHandlers.priceLists}
                handlers={priceListHandlers}
              />
            </div>
          )}

          {/* Tab 3: Partecipanti (condizionale) */}
          {activeTab === "participants" &&
            formData.id &&
            formData.verifiedAttendanceEvent && (
              <div>
                <ParticipantsUpload eventId={formData.id} />

                <hr className="my-4 border-gray-200" />

                <PartecipantsTable eventId={formData.id} />
              </div>
            )}
        </div>

        {/* Azioni sempre visibili fuori dalle tab */}
        <FormActions onSubmit={handleSubmit} onCancel={handleReturnToList} />
      </form>
    </div>
  );
}