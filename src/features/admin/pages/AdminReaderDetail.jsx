import { ArrowLeft, Pencil, Check, X, ChevronDown, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { ROUTES } from "@/routes";
import Badge from "@common/components/ui/Badge";
import Form from "@common/components/ui/Form";
import { apiRequest } from "@common/services/api-services";
import {
  fetchReaders,
  associateReaderToEvent,
  toggleReaderActive,
  updateReaderLabel,
} from "../store/admin-readers-actions";

/**
 * Pagina di dettaglio di un Reader POS Stripe
 *
 * @returns {React.ReactElement} admin reader detail panel
 */
export default function AdminReaderDetail() {
  const { readerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const readers = useSelector((state) => state.adminReaders.readers);
  const reader = readers.find((r) => r.id === Number(readerId));

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [savingEvent, setSavingEvent] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  // Label editing
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const [savingLabel, setSavingLabel] = useState(false);

  // Event dropdown with search
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (readers.length === 0) {
      dispatch(fetchReaders());
    }
  }, []);

  useEffect(() => {
    apiRequest({
      api: import.meta.env.VITE_API_URL + "/events/fetch",
      method: "GET",
      needAuth: true,
    })
      .then((res) => res.ok && res.json())
      .then((data) => data && setEvents(data.data || []))
      .catch(() => console.error("Errore nel caricamento degli eventi"));
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setSearchQuery("");
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const filteredEvents = events.filter((event) => {
    const q = searchQuery.toLowerCase();
    return (
      (event.slug || "").toLowerCase().includes(q) ||
      (event.name || "").toLowerCase().includes(q)
    );
  });

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const handleAssociateEvent = async () => {
    if (!selectedEventId) return;
    setSavingEvent(true);
    const result = await dispatch(
      associateReaderToEvent(reader.id, Number(selectedEventId)),
    );
    if (result?.success) {
      setSelectedEventId("");
    }
    setSavingEvent(false);
  };

  const handleToggleActive = async () => {
    setSavingStatus(true);
    await dispatch(toggleReaderActive(reader.id, !reader.active));
    setSavingStatus(false);
  };

  const handleStartEditLabel = () => {
    setLabelValue(reader.label);
    setEditingLabel(true);
  };

  const handleSaveLabel = async () => {
    if (!labelValue.trim() || labelValue === reader.label) {
      setEditingLabel(false);
      return;
    }
    setSavingLabel(true);
    updateReaderLabel(reader.id, labelValue.trim(), reader)(dispatch).finally(
      () => {
        setSavingLabel(false);
        setEditingLabel(false);
      },
    );
  };

  const handleCancelLabel = () => {
    setEditingLabel(false);
    setLabelValue("");
  };

  if (!reader) {
    return (
      <div className="container text-left">
        <p className="text-gray-500">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="container text-left">
      <button
        type="button"
        onClick={() => navigate(ROUTES.ADMIN_READERS)}
        className="inline-flex items-center gap-1.5 mb-6 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={16} /> Readers
      </button>

      <div className="mb-8 flex items-center gap-3">
        <h1>
          Reader #{reader.id} — {reader.label}
        </h1>
        <Badge bg={reader.active ? "success" : "secondary"}>
          {reader.active ? "Attivo" : "Inattivo"}
        </Badge>
      </div>

      {/* Dati Reader */}
      <div className="bg-white border border-gray-200 rounded-xl mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-700">Dati Reader</h2>
        </div>
        <div className="px-6 py-4 space-y-3">
          {/* Label — editabile */}
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-500 w-28">Label</span>
            {editingLabel ? (
              <div className="flex items-center gap-2">
                <Form.Control
                  value={labelValue}
                  onChange={(e) => setLabelValue(e.target.value)}
                  className="text-sm py-1 h-auto"
                  disabled={savingLabel}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveLabel();
                    if (e.key === "Escape") handleCancelLabel();
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveLabel}
                  disabled={savingLabel}
                  className="inline-flex items-center justify-center p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                  title="Salva"
                >
                  <Check size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleCancelLabel}
                  disabled={savingLabel}
                  className="inline-flex items-center justify-center p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                  title="Annulla"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {reader.label}
                </span>
                <button
                  type="button"
                  onClick={handleStartEditLabel}
                  className="inline-flex items-center justify-center p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="Modifica label"
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <span className="text-sm text-gray-500 w-28">Stripe ID</span>
            <span className="text-sm font-mono text-gray-900">
              {reader.stripeReaderId}
            </span>
          </div>
          <div className="flex gap-4">
            <span className="text-sm text-gray-500 w-28">Evento</span>
            <span className="text-sm text-gray-900">
              {reader.events?.length > 0 ? (
                reader.events[0].slug
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Associa Evento */}
      <div className="bg-white border border-gray-200 rounded-xl mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-700">
            Associa a un evento
          </h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Dropdown con ricerca */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center justify-between gap-2 min-w-50 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <span className={selectedEvent ? "text-gray-900" : "text-gray-400"}>
                  {selectedEvent
                    ? selectedEvent.slug || selectedEvent.name || `Evento #${selectedEvent.id}`
                    : "Seleziona un evento..."}
                </span>
                <ChevronDown size={14} className="text-gray-400 shrink-0" />
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 border-b border-gray-100">
                    <div className="flex items-center gap-1.5 px-2 py-1 border border-gray-300 rounded-md bg-white focus-within:ring-1 focus-within:ring-secondary-event/50 focus-within:border-secondary-event">
                      <Search size={13} className="text-gray-400 shrink-0" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Cerca evento..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-sm bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto py-1">
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => {
                            setSelectedEventId(event.id);
                            setDropdownOpen(false);
                            setSearchQuery("");
                          }}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${
                            selectedEventId === event.id
                              ? "bg-gray-50 font-medium text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {event.slug || event.name || `Evento #${event.id}`}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-gray-400">
                        Nessun risultato
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAssociateEvent}
              disabled={!selectedEventId || savingEvent}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 border border-green-500 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingEvent ? "Associo..." : "Associa"}
            </button>
          </div>
        </div>
      </div>

      {/* Gestione stato */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-700">
            Gestione stato
          </h2>
        </div>
        <div className="px-6 py-4">
          <button
            type="button"
            onClick={handleToggleActive}
            disabled={savingStatus}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              reader.active
                ? "text-red-600 border-red-500 hover:bg-red-50"
                : "text-green-600 border-green-500 hover:bg-green-50"
            }`}
          >
            {savingStatus
              ? "Aggiornamento..."
              : reader.active
                ? "Disattiva reader"
                : "Riattiva reader"}
          </button>
        </div>
      </div>
    </div>
  );
}
