import { useCallback, useEffect, useState } from "react";
import { Monitor, Trash2, Plus } from "lucide-react";
import { apiRequest } from "@common/services/api-services";
import { errorToast, successToast } from "@common/utils/toast-manager";
import LoadingState from "@common/components/ui/LoadingState";

interface EventReader {
  id: number;
  stripeReaderId: string;
  label: string;
  active: boolean;
  hide: boolean;
  eventId: number;
  terminalLocationId: number;
  location?: {
    id: number;
    displayName: string;
  };
}

interface ReaderWithEvent {
  id: number;
  stripeReaderId: string;
  label: string;
  terminalLocationId: number;
  location?: {
    id: number;
    displayName: string;
    city: string;
    country: string;
  };
  event?: {
    id: number;
    title: string;
  };
}

export interface EventReadersProps {
  eventId: string | number;
}

export function EventReaders({ eventId }: EventReadersProps) {
  const [eventReaders, setEventReaders] = useState<EventReader[]>([]);
  const [allReaders, setAllReaders] = useState<ReaderWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReaderId, setSelectedReaderId] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const BASE = import.meta.env.VITE_API_URL;

  const fetchEventReaders = useCallback(async () => {
    const res = await apiRequest({
      api: `${BASE}/events/event/${eventId}/readers`,
      method: "GET",
      needAuth: true,
    });
    if (res.ok) {
      const data = (await res.json()) as { data: { readers: EventReader[] } };
      setEventReaders(data.data?.readers ?? []);
    }
  }, [BASE, eventId]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventReadersRes, allReadersRes] = await Promise.all([
        apiRequest({
          api: `${BASE}/events/event/${eventId}/readers`,
          method: "GET",
          needAuth: true,
        }),
        apiRequest({
          api: `${BASE}/terminal/readers/with-events`,
          method: "GET",
          needAuth: true,
        }),
      ]);

      if (eventReadersRes.ok) {
        const data = (await eventReadersRes.json()) as { data: { readers: EventReader[] } };
        setEventReaders(data.data?.readers ?? []);
      }
      if (allReadersRes.ok) {
        const data = (await allReadersRes.json()) as {
          data: { readers: ReaderWithEvent[] };
        };
        setAllReaders(data.data?.readers ?? []);
      }
    } catch {
      console.error("Errore nel caricamento dei reader");
    } finally {
      setLoading(false);
    }
  }, [BASE, eventId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const eventReaderIds = new Set(eventReaders.map((r) => r.id));

  const availableReaders = allReaders.filter(
    (r) => !eventReaderIds.has(r.id),
  );

  const handleAddReader = async () => {
    if (!selectedReaderId) return;
    setAdding(true);
    try {
      const res = await apiRequest({
        api: `${BASE}/terminal/events/${eventId}/readers/${selectedReaderId}`,
        method: "POST",
        needAuth: true,
      });
      if (!res.ok) {
        errorToast("Errore nell'associazione del POS all'evento");
        return;
      }
      successToast("POS associato all'evento");
      setSelectedReaderId("");
      await fetchEventReaders();
    } catch {
      errorToast("Errore nell'associazione del POS");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveReader = async (readerId: number) => {
    setRemovingId(readerId);
    try {
      const res = await apiRequest({
        api: `${BASE}/terminal/events/${eventId}/readers/${readerId}`,
        method: "DELETE",
        needAuth: true,
      });
      if (!res.ok) {
        errorToast("Errore nella rimozione del POS dall'evento");
        return;
      }
      successToast("POS rimosso dall'evento");
      await fetchEventReaders();
    } catch {
      errorToast("Errore nella rimozione del POS");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return <LoadingState message="Caricamento reader..." />;
  }

  return (
    <div>
      <div className="shadow-sm rounded-lg bg-white mb-4">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="bg-cyan-500/10 rounded-xl p-3 mr-3">
              <Monitor size={24} className="text-blue-600" />
            </div>
            <div>
              <h5 className="mb-1 font-bold text-lg">POS / Reader</h5>
              <p className="text-gray-500 mb-0 text-sm">
                Reader Stripe Terminal associati all'evento
              </p>
            </div>
          </div>

          {eventReaders.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              Nessun reader associato all'evento.
            </p>
          ) : (
            <ul className="flex flex-col gap-2 mb-4">
              {eventReaders.map((reader) => (
                <li
                  key={reader.id}
                  className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2"
                >
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <Monitor size={14} className="text-gray-400 shrink-0" />
                    <span className="font-semibold">{reader.label}</span>
                    <span className="text-gray-400 font-mono text-xs">
                      {reader.stripeReaderId}
                    </span>
                    {reader.location && (
                      <span className="text-gray-500 text-xs">
                        — {reader.location.displayName}
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveReader(reader.id)}
                    disabled={removingId === reader.id}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={11} />
                    {removingId === reader.id ? "Rimozione..." : "Rimuovi"}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-2 items-center mt-3">
            <select
              value={selectedReaderId}
              onChange={(e) => setSelectedReaderId(e.target.value)}
              disabled={availableReaders.length === 0}
              className="flex-1 min-w-48 border-2 border-gray-200 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">
                {availableReaders.length === 0
                  ? "Nessun POS disponibile"
                  : "Seleziona POS da aggiungere..."}
              </option>
              {availableReaders.map((r) => (
                <option key={r.id} value={String(r.id)}>
                  {r.label}
                  {r.location ? ` — ${r.location.displayName}` : ""}
                  {r.event ? ` (evento: ${r.event.title})` : ""}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddReader}
              disabled={!selectedReaderId || adding}
              className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={12} />
              {adding ? "Aggiunta..." : "Aggiungi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
