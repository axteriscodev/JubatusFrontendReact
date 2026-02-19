import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { ROUTES } from "@/routes";
import Badge from "@common/components/ui/Badge";
import Button from "@common/components/ui/Button";
import Form from "@common/components/ui/Form";
import { apiRequest } from "@common/services/api-services";
import {
  fetchReaders,
  associateReaderToEvent,
  toggleReaderActive,
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
          <div className="flex gap-4">
            <span className="text-sm text-gray-500 w-28">Label</span>
            <span className="text-sm font-medium text-gray-900">
              {reader.label}
            </span>
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
            <Form.Select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="max-w-xs"
            >
              <option value="">Seleziona un evento...</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.slug || event.name || `Evento #${event.id}`}
                </option>
              ))}
            </Form.Select>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAssociateEvent}
              disabled={!selectedEventId || savingEvent}
            >
              {savingEvent ? "Associo..." : "Associa"}
            </Button>
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
          <Button
            variant={reader.active ? "danger" : "success"}
            size="sm"
            onClick={handleToggleActive}
            disabled={savingStatus}
          >
            {savingStatus
              ? "Aggiornamento..."
              : reader.active
                ? "Disattiva reader"
                : "Riattiva reader"}
          </Button>
        </div>
      </div>
    </div>
  );
}
