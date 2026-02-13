import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  addCompetition,
  editCompetition,
  deleteCompetition,
  addListToCompetition,
  editListForCompetition,
  deleteListForCompetition,
} from "../../repositories/admin-competitions/admin-competitions-actions";
import { errorToast, successToast } from "../../utils/toast-manager";

// Hooks personalizzati
import { useEventForm } from "./hooks/useEventForm";
import { usePriceLists } from "./hooks/usePriceLists";
import { useTags } from "./hooks/useTags";
import { useCurrencies } from "./hooks/useCurrencies";
import { useEventData } from "./hooks/useEventData";

// Componenti
import { EventBasicInfo } from "./components/EventBasicInfo";
import { EventDates } from "./components/EventDates";
import { EventColors } from "./components/EventColors";
import { EventLogo } from "./components/EventLogo";
import { PriceListSection } from "./components/PriceListSection";
import { FormActions } from "./components/FormActions";
import { ParticipantsUpload } from "./components/ParticipantsUpload";
import { PartecipantsTable } from "./components/PartecipantsTable";
import PendingPayments from "./components/PendingPayments";
import LoadingState from "../../shared/components/ui/LoadingState";
import Button from "../../shared/components/ui/Button";

// Utilities
import {
  prepareEventInfoData,
  getDefaultPriceLists,
} from "./utils/eventFormHelpers";

/**
 * Pagina per la creazione/modifica dell'evento
 */
export default function CreateEvent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch dei dati completi dell'evento (se in edit mode)
  const {
    eventData,
    externalPayment,
    loading: eventLoading,
    error: eventError,
    eventId,
  } = useEventData();

  // Se siamo in edit mode ma eventData è null (e il caricamento è finito), l'utente non ha permessi di modifica
  const readOnly = !!eventId && !eventData && !eventLoading && !eventError;

  // State per gestire le tab
  const [activeTab, setActiveTab] = useState("info");

  // Custom hooks per gestire lo stato
  const { formData, handleInputChange, handleTitleChange, handleFileChange } =
    useEventForm(eventData);

  const initialPriceLists = useMemo(
    () => eventData?.lists || getDefaultPriceLists(),
    [eventData],
  );
  const priceListHandlers = usePriceLists(initialPriceLists);

  const { tagList, loading: tagsLoading } = useTags();
  const { currencyList } = useCurrencies();

  // Se readOnly, forza la tab su "orders"
  useEffect(() => {
    if (readOnly) {
      setActiveTab("orders");
    }
  }, [readOnly]);

  // Effetto per aggiungere/rimuovere classe admin al body
  useEffect(() => {
    document.body.classList.add("admin");
    return () => {
      document.body.classList.remove("admin");
    };
  }, []);

  // Loading state durante il caricamento dell'evento
  if (eventLoading) {
    return (
      <div className="container mx-auto px-4 text-left">
        <h1 className="text-2xl font-bold mb-4">Gestione evento</h1>
        <LoadingState message="Caricamento evento..." />
      </div>
    );
  }

  // Error state se il caricamento fallisce
  if (eventError) {
    return (
      <div className="container mx-auto px-4 text-left">
        <h1 className="text-2xl font-bold mb-4">Gestione evento</h1>
        <p className="text-red-500">Errore nel caricamento dell'evento.</p>
        <Button onClick={() => navigate("/admin")} variant="outline">
          Torna alla lista
        </Button>
      </div>
    );
  }

  /**
   * Gestisce il salvataggio delle info evento (tab 1)
   */
  const handleSubmitEventInfo = async () => {
    const submitData = prepareEventInfoData(formData);

    let result;
    if (submitData.id) {
      result = await dispatch(editCompetition(submitData));
    } else {
      result = await dispatch(addCompetition(submitData));
    }

    if (result.success) {
      successToast("Info evento salvate con successo!");
      console.log("[CreateEvent] result dopo creazione:", result);
      if (!submitData.id && result.data?.data.id) {
        navigate(`/admin/event/${result.data.data.id}`, {
          replace: true,
        });
      }
    } else {
      errorToast("Si è verificato un errore durante il salvataggio");
    }
  };

  /**
   * Gestisce il salvataggio dei listini prezzi (tab 2).
   * Per ogni listino: crea (POST) se nuovo, aggiorna (PUT) se esistente.
   * Elimina (DELETE) i listini rimossi rispetto all'originale.
   */
  const handleSubmitPriceLists = async () => {
    if (!formData.id) {
      errorToast("Salva prima le info evento prima di poter gestire i listini");
      return;
    }

    const eventId = formData.id;
    const currentLists = priceListHandlers.priceLists;

    // Calcola i listini eliminati confrontando gli ID originali con quelli correnti
    const originalIds = new Set(
      (eventData?.lists || []).map((l) => l.id).filter(Boolean),
    );
    const currentIds = new Set(currentLists.map((l) => l.id).filter(Boolean));
    const idsToDelete = [...originalIds].filter((id) => !currentIds.has(id));

    const promises = [
      ...idsToDelete.map((id) => dispatch(deleteListForCompetition(id))),
      ...currentLists.map((list) =>
        list.id
          ? dispatch(editListForCompetition(list.id, eventId, list))
          : dispatch(addListToCompetition(eventId, list)),
      ),
    ];

    const results = await Promise.all(promises);
    const allSuccess = results.every((r) => r.success);

    if (allSuccess) {
      successToast("Listini salvati con successo!");
    } else {
      errorToast(
        "Si è verificato un errore durante il salvataggio dei listini",
      );
    }
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Sei sicuro di voler rimuovere l'evento?",
    );
    if (confirmDelete) {
      dispatch(deleteCompetition(eventData));
      navigate("/admin");
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
    ...(!readOnly ? [{ key: "info", label: "Info evento" }] : []),
    ...(!readOnly && formData.id
      ? [{ key: "priceLists", label: "Listini prezzi" }]
      : []),
    // Tab partecipanti condizionale
    ...(formData.id && formData.verifiedAttendanceEvent
      ? [{ key: "participants", label: "Partecipanti" }]
      : []),
    ...(externalPayment !== null && (formData.id || readOnly)
      ? [{ key: "orders", label: "Pagamenti in sospeso" }]
      : []),
  ];

  return (
    <div className="container mx-auto px-4 text-left">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestione evento</h1>
        <FormActions
          readOnly={readOnly}
          onDelete={handleDelete}
          onCancel={handleReturnToList}
        />
      </div>

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
                currencyList={currencyList}
              />
              <EventDates
                formData={formData}
                onInputChange={handleInputChange}
              />
              <EventColors
                formData={formData}
                onInputChange={handleInputChange}
              />
              <EventLogo
                formData={formData}
                receivedComp={eventData}
                onFileChange={handleFileChange}
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitEventInfo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Salva info evento
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Listini prezzi */}
          {activeTab === "priceLists" && (
            <div>
              <PriceListSection
                priceLists={priceListHandlers.priceLists}
                handlers={priceListHandlers}
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitPriceLists}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Salva listini prezzi
                </button>
              </div>
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

          {/* Tab 4: Pagamenti in sospeso (condizionale) */}
          {activeTab === "orders" && (formData.id || readOnly) && (
            <div>
              <PendingPayments
                eventId={formData.id || eventId}
                initialPayments={externalPayment}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
