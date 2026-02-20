import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import {
  MapPin,
  Monitor,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { apiRequest } from "@common/services/api-services";
import { errorToast, successToast } from "@common/utils/toast-manager";
import LoadingState from "@common/components/ui/LoadingState";

interface LocationReader {
  id: string;
  label: string;
  stripeReaderId: string;
}

interface EventLocation {
  id: string;
  displayName: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  readers?: LocationReader[];
}

interface Reader {
  id: string | number;
  stripeReaderId: string;
  label: string;
  terminalLocationId: string | number;
  location?: {
    id: string | number;
    displayName: string;
    city: string;
    country: string;
  };
}

interface NewLocationForm {
  displayName: string;
  line1: string;
  city: string;
  country: string;
  postalCode: string;
  state: string;
}

const EMPTY_NEW_LOCATION_FORM: NewLocationForm = {
  displayName: "",
  line1: "",
  city: "",
  country: "IT",
  postalCode: "",
  state: "",
};

export interface EventLocationsProps {
  eventId: string | number;
}

export function EventLocations({ eventId }: EventLocationsProps) {
  const [eventLocations, setEventLocations] = useState<EventLocation[]>([]);
  const [allReaders, setAllReaders] = useState<Reader[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedReaderIds, setSelectedReaderIds] = useState<
    Record<string, string>
  >({});
  const [addingForLocation, setAddingForLocation] = useState<string | null>(
    null,
  );

  const [showNewLocationForm, setShowNewLocationForm] = useState(false);
  const [newLocationForm, setNewLocationForm] = useState<NewLocationForm>(
    EMPTY_NEW_LOCATION_FORM,
  );
  const [creating, setCreating] = useState(false);

  const BASE = import.meta.env.VITE_API_URL;

  const fetchEventLocations = useCallback(async () => {
    try {
      const eventLocRes = await apiRequest({
        api: `${BASE}/events/event/${eventId}/locations`,
        method: "GET",
        needAuth: true,
      });
      if (eventLocRes.ok) {
        const data = (await eventLocRes.json()) as {
          data: { locations: EventLocation[] };
        };
        setEventLocations(data.data.locations ?? []);
      }
    } catch {
      console.error("Errore nel caricamento delle location");
    }
  }, [BASE, eventId]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventLocRes, readersRes] = await Promise.all([
        apiRequest({
          api: `${BASE}/events/event/${eventId}/locations`,
          method: "GET",
          needAuth: true,
        }),
        apiRequest({
          api: `${BASE}/terminal/readers`,
          method: "GET",
          needAuth: true,
        }),
      ]);

      if (eventLocRes.ok) {
        const data = (await eventLocRes.json()) as {
          data: { locations: EventLocation[] };
        };
        setEventLocations(data.data.locations ?? []);
      }
      if (readersRes.ok) {
        const data = (await readersRes.json()) as {
          data: { readers: Reader[] };
        };
        setAllReaders(data.data.readers ?? []);
      }
    } catch {
      console.error("Errore nel caricamento dei dati");
    } finally {
      setLoading(false);
    }
  }, [BASE, eventId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const associatedReaderIds = new Set(
    eventLocations.flatMap((loc) =>
      (loc.readers ?? []).map((r) => String(r.id)),
    ),
  );

  const getAvailableReaders = () =>
    allReaders.filter((r) => !associatedReaderIds.has(String(r.id)));

  const handleAddReader = async (locId: string) => {
    const readerId = selectedReaderIds[locId];
    if (!readerId) return;
    setAddingForLocation(locId);
    try {
      const reader = allReaders.find((r) => String(r.id) === readerId);
      if (reader && String(reader.terminalLocationId) !== String(locId)) {
        const relocRes = await apiRequest({
          api: `${BASE}/terminal/readers/${readerId}/location`,
          method: "PUT",
          needAuth: true,
          body: JSON.stringify({ locationId: Number(locId) }),
        });
        if (!relocRes.ok) {
          errorToast("Errore nel riassegnamento del POS alla location");
          return;
        }
      }
      successToast("POS associato all'evento");
      setSelectedReaderIds((prev) => ({ ...prev, [locId]: "" }));
      await fetchEventLocations();
    } catch {
      errorToast("Errore nell'associazione del POS");
    } finally {
      setAddingForLocation(null);
    }
  };

  const handleRemoveReader = async (_readerId: string) => {
    successToast("POS rimosso dall'evento");
    await fetchEventLocations();
  };

  const handleNewLocationFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLocationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateLocation = async () => {
    if (
      !newLocationForm.displayName ||
      !newLocationForm.line1 ||
      !newLocationForm.city ||
      !newLocationForm.postalCode ||
      !newLocationForm.country
    ) {
      errorToast("Compila tutti i campi obbligatori");
      return;
    }
    setCreating(true);
    try {
      const res = await apiRequest({
        api: `${BASE}/terminal/locations`,
        method: "POST",
        needAuth: true,
        body: JSON.stringify({
          displayName: newLocationForm.displayName,
          address: {
            line1: newLocationForm.line1,
            city: newLocationForm.city,
            country: newLocationForm.country,
            postalCode: newLocationForm.postalCode,
            state: newLocationForm.state || null,
          },
          eventId,
        }),
      });
      if (res.ok) {
        successToast("Location creata e associata all'evento");
        setNewLocationForm(EMPTY_NEW_LOCATION_FORM);
        setShowNewLocationForm(false);
        await fetchData();
      } else {
        errorToast("Errore nella creazione della location");
      }
    } catch {
      errorToast("Errore nella creazione della location");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <LoadingState message="Caricamento location..." />;
  }

  const inputClass =
    "w-full border-2 border-gray-300 rounded-md px-3 py-2 text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white";

  const newLocationFormFields = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="lg:col-span-2">
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Nome visualizzato
        </label>
        <input
          type="text"
          name="displayName"
          value={newLocationForm.displayName}
          onChange={handleNewLocationFormChange}
          placeholder="Es. Sede Milano"
          required
          className={inputClass}
        />
      </div>
      <div className="lg:col-span-2">
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Indirizzo
        </label>
        <input
          type="text"
          name="line1"
          value={newLocationForm.line1}
          onChange={handleNewLocationFormChange}
          placeholder="Es. Via Roma 10"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Città
        </label>
        <input
          type="text"
          name="city"
          value={newLocationForm.city}
          onChange={handleNewLocationFormChange}
          placeholder="Es. Milano"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          CAP
        </label>
        <input
          type="text"
          name="postalCode"
          value={newLocationForm.postalCode}
          onChange={handleNewLocationFormChange}
          placeholder="Es. 20100"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Paese
        </label>
        <input
          type="text"
          name="country"
          value={newLocationForm.country}
          onChange={handleNewLocationFormChange}
          placeholder="Es. IT"
          maxLength={2}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Provincia / Stato{" "}
          <span className="text-gray-400 font-normal">(opzionale)</span>
        </label>
        <input
          type="text"
          name="state"
          value={newLocationForm.state}
          onChange={handleNewLocationFormChange}
          placeholder="Es. MI"
          className={inputClass}
        />
      </div>
      <div className="lg:col-span-2 flex justify-end">
        <button
          type="button"
          onClick={handleCreateLocation}
          disabled={creating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} />
          {creating ? "Creazione..." : "Crea e associa"}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Location list */}
      <div className="shadow-sm rounded-lg bg-white mb-4">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="bg-cyan-500/10 rounded-xl p-3 mr-3">
              <MapPin size={24} className="text-blue-600" />
            </div>
            <div>
              <h5 className="mb-1 font-bold text-lg">Location e POS</h5>
              <p className="text-gray-500 mb-0 text-sm">
                Location Stripe Terminal associate all'evento
              </p>
            </div>
          </div>

          {eventLocations.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              Nessuna location associata all'evento.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {eventLocations.map((loc) => {
                const availableReaders = getAvailableReaders();
                const isAdding = addingForLocation === loc.id;
                const selectedReaderId = selectedReaderIds[loc.id] ?? "";

                return (
                  <div
                    key={loc.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-gray-500 shrink-0" />
                      <span className="font-semibold text-sm">
                        {loc.displayName}
                      </span>
                      <span className="text-gray-400 text-sm">
                        — {loc.addressLine1}, {loc.city} {loc.postalCode}
                      </span>
                    </div>

                    {(loc.readers ?? []).length === 0 ? (
                      <p className="text-gray-400 text-xs italic ml-5 mb-2">
                        Nessun POS associato a questa location.
                      </p>
                    ) : (
                      <ul className="flex flex-col gap-1 ml-5 mb-3">
                        {loc.readers!.map((reader) => (
                          <li
                            key={reader.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="flex items-center gap-2 text-gray-700">
                              <Monitor size={13} className="text-gray-400" />
                              {reader.label}
                              <span className="text-gray-400 text-xs font-mono">
                                {reader.stripeReaderId}
                              </span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveReader(reader.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={11} />
                              Rimuovi
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="ml-5 flex flex-wrap gap-2 items-center">
                      <select
                        value={selectedReaderId}
                        onChange={(e) =>
                          setSelectedReaderIds((prev) => ({
                            ...prev,
                            [loc.id]: e.target.value,
                          }))
                        }
                        disabled={availableReaders.length === 0}
                        className="flex-1 min-w-36 border-2 border-gray-200 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <option value="">
                          {availableReaders.length === 0
                            ? "Nessun POS disponibile"
                            : "Aggiungi POS..."}
                        </option>
                        {availableReaders.map((r) => (
                          <option key={String(r.id)} value={String(r.id)}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAddReader(loc.id)}
                        disabled={!selectedReaderId || isAdding}
                        className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={12} />
                        {isAdding ? "Aggiunta..." : "Aggiungi"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New location form: always expanded if no locations, collapsible otherwise */}
      <div className="shadow-sm rounded-lg bg-white mb-4">
        <div className="p-4">
          {eventLocations.length === 0 ? (
            <>
              <h6 className="font-semibold text-sm text-gray-700 mb-3">
                Crea nuova location e associala all'evento
              </h6>
              {newLocationFormFields}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowNewLocationForm((v) => !v)}
                className="flex items-center gap-2 font-semibold text-sm text-gray-700 w-full text-left"
              >
                {showNewLocationForm ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
                Crea nuova location e associala all'evento
              </button>
              {showNewLocationForm && (
                <div className="mt-4">{newLocationFormFields}</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
