import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@common/store/hooks";
import {
  addCompetition,
  editCompetition,
  deleteCompetition,
  addListToCompetition,
  editListForCompetition,
  deleteListForCompetition,
} from "@features/admin/store/admin-competitions-actions";
import { errorToast, successToast } from "@common/utils/toast-manager";

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
import { EventLocations } from "./components/EventLocations";
import PendingPayments from "./components/PendingPayments";
import LoadingState from "@common/components/ui/LoadingState";
import Button from "@common/components/ui/Button";

// Utilities
import {
  prepareEventInfoData,
  getDefaultPriceLists,
} from "./utils/eventFormHelpers";
import { isOrganizationAdmin } from "@common/utils/auth";
import { ROUTES } from "@/routes";
import type { PriceList } from "@/types/cart";
import type { Competition } from "@/types/competition";
import type { EventBasicInfoProps } from "./components/EventBasicInfo";
import type { PendingPaymentsProps } from "./components/PendingPayments";

type TabKey = "info" | "priceLists" | "locations" | "participants" | "orders";

interface Tab {
  key: TabKey;
  label: string;
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    eventData,
    externalPayment,
    loading: eventLoading,
    error: eventError,
    eventId,
  } = useEventData();

  const readOnly = !!eventId && !eventData && !eventLoading && !eventError;

  const [activeTab, setActiveTab] = useState<TabKey>("info");

  const { formData, handleInputChange, handleTitleChange, handleFileChange } =
    useEventForm(eventData);

  const initialPriceLists = useMemo<PriceList[]>(
    () => eventData?.lists ?? getDefaultPriceLists(),
    [eventData],
  );
  const priceListHandlers = usePriceLists(initialPriceLists);

  const { tagList, loading: tagsLoading } = useTags();
  const { currencyList } = useCurrencies();

  useEffect(() => {
    if (readOnly) {
      setActiveTab("orders");
    }
  }, [readOnly]);

  // Sopprime warning di variabile inutilizzata — tagsLoading usato per futura UI
  void tagsLoading;

  if (eventLoading) {
    return (
      <div className="container mx-auto px-4 text-left">
        <h1 className="text-2xl font-bold mb-4">Gestione evento</h1>
        <LoadingState message="Caricamento evento..." />
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="container mx-auto px-4 text-left">
        <h1 className="text-2xl font-bold mb-4">Gestione evento</h1>
        <p className="text-red-500">Errore nel caricamento dell&apos;evento.</p>
        <Button onClick={() => navigate(ROUTES.ADMIN_EVENTS)} variant="outline">
          Torna alla lista
        </Button>
      </div>
    );
  }

  const handleSubmitEventInfo = async () => {
    const submitData = prepareEventInfoData(formData);

    let result;
    if (submitData.id) {
      result = await dispatch(
        editCompetition(submitData as unknown as Competition),
      );
    } else {
      result = await dispatch(
        addCompetition(submitData as unknown as Partial<Competition>),
      );
    }

    if (result.success) {
      successToast("Info evento salvate con successo!");
      console.log("[CreateEvent] result dopo creazione:", result);
      if (
        !submitData.id &&
        result.data &&
        (result.data as Competition & { data?: { id: number } }).data?.id
      ) {
        navigate(
          ROUTES.ADMIN_EVENT(
            (result.data as Competition & { data: { id: number } }).data.id,
          ),
          {
            replace: true,
          },
        );
      }
    } else {
      errorToast("Si è verificato un errore durante il salvataggio");
    }
  };

  const handleSubmitPriceLists = async () => {
    if (!formData.id) {
      errorToast("Salva prima le info evento prima di poter gestire i listini");
      return;
    }

    const evtId = formData.id;
    const currentLists = priceListHandlers.priceLists;

    const originalIds = new Set(
      (eventData?.lists ?? [])
        .map((l) => l.id)
        .filter((id): id is number => id !== undefined),
    );
    const currentIds = new Set(
      currentLists
        .map((l) => l.id)
        .filter((id): id is number => id !== undefined),
    );
    const idsToDelete = [...originalIds].filter((id) => !currentIds.has(id));

    const promises = [
      ...idsToDelete.map((id) => dispatch(deleteListForCompetition(id))),
      ...currentLists.map((list) =>
        list.id
          ? dispatch(editListForCompetition(list.id, evtId, list))
          : dispatch(addListToCompetition(evtId, list)),
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
    if (confirmDelete && eventData) {
      dispatch(deleteCompetition(eventData));
      navigate(ROUTES.ADMIN);
    }
  };

  const handleReturnToList = () => {
    navigate(ROUTES.ADMIN_EVENTS);
  };

  const tabs: Tab[] = [
    ...(!readOnly ? [{ key: "info" as TabKey, label: "Info evento" }] : []),
    ...(!readOnly && formData.id
      ? [{ key: "priceLists" as TabKey, label: "Listini prezzi" }]
      : []),
    ...(!readOnly && formData.id && isOrganizationAdmin()
      ? [{ key: "locations" as TabKey, label: "Location / POS" }]
      : []),
    ...(formData.id && formData.verifiedAttendanceEvent
      ? [{ key: "participants" as TabKey, label: "Partecipanti" }]
      : []),
    ...(externalPayment !== null && (formData.id || readOnly)
      ? [{ key: "orders" as TabKey, label: "Pagamenti in sospeso" }]
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

        <div className="mt-3">
          {activeTab === "info" && (
            <div>
              <EventBasicInfo
                formData={formData}
                onInputChange={
                  handleInputChange as EventBasicInfoProps["onInputChange"]
                }
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

          {activeTab === "locations" && formData.id && !readOnly && (
            <EventLocations eventId={formData.id} />
          )}

          {activeTab === "participants" &&
            formData.id &&
            formData.verifiedAttendanceEvent && (
              <div>
                <ParticipantsUpload eventId={formData.id} />
                <hr className="my-4 border-gray-200" />
                <PartecipantsTable eventId={formData.id} />
              </div>
            )}

          {activeTab === "orders" && (formData.id || readOnly) && (
            <div>
              <PendingPayments
                eventId={
                  (formData.id ??
                    (eventId
                      ? Number(eventId)
                      : 0)) as PendingPaymentsProps["eventId"]
                }
                initialPayments={
                  externalPayment as PendingPaymentsProps["initialPayments"]
                }
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
