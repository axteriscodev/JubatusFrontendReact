import { ArrowLeft, Pencil, Check, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { useEffect, useState } from "react";
import { ROUTES } from "@/routes";
import Badge from "@common/components/ui/Badge";
import Form from "@common/components/ui/Form";
import {
  fetchReaders,
  toggleReaderActive,
  updateReaderLabel,
} from "../store/admin-readers-actions";

export default function AdminReaderDetail() {
  const { readerId } = useParams<{ readerId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const readers = useAppSelector((state) => state.adminReaders.readers);
  const reader = readers.find((r) => r.id === Number(readerId));

  const [savingStatus, setSavingStatus] = useState(false);

  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const [savingLabel, setSavingLabel] = useState(false);

  useEffect(() => {
    if (readers.length === 0) {
      dispatch(fetchReaders());
    }
  }, [dispatch, readers.length]);

  const handleToggleActive = async () => {
    if (!reader) return;
    setSavingStatus(true);
    await dispatch(toggleReaderActive(reader.id, !reader.active));
    setSavingStatus(false);
  };

  const handleStartEditLabel = () => {
    if (!reader) return;
    setLabelValue(reader.label);
    setEditingLabel(true);
  };

  const handleSaveLabel = async () => {
    if (!reader) return;
    if (!labelValue.trim() || labelValue === reader.label) {
      setEditingLabel(false);
      return;
    }

    setSavingLabel(true);
    updateReaderLabel(
      reader.id,
      labelValue.trim(),
      reader,
    )(dispatch).finally(() => {
      setSavingLabel(false);
      setEditingLabel(false);
    });
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
  const location = reader.location;

  return (
    <div className="container text-left">
      <button
        type="button"
        onClick={() => navigate(ROUTES.ADMIN_READERS)}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <ArrowLeft size={16} /> Readers
      </button>

      <div className="overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 md:px-6">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Reader #{reader.id}
            </p>
            <h1 className="mt-1 truncate text-xl font-semibold text-gray-900">
              {reader.label}
            </h1>
          </div>
          <Badge bg={reader.active ? "success" : "secondary"}>
            {reader.active ? "Attivo" : "Inattivo"}
          </Badge>
        </div>

        <div className="space-y-6 px-5 py-5 md:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Label
              </p>
              {editingLabel ? (
                <div className="mt-2 flex items-center gap-2">
                  <Form.Control
                    value={labelValue}
                    onChange={(e) => setLabelValue(e.target.value)}
                    className="h-auto py-1.5 text-sm"
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
                    className="inline-flex items-center justify-center rounded p-1 text-green-600 transition-colors hover:bg-green-50 hover:text-green-700 disabled:opacity-50"
                    title="Salva"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelLabel}
                    disabled={savingLabel}
                    className="inline-flex items-center justify-center rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                    title="Annulla"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {reader.label}
                  </p>
                  <button
                    type="button"
                    onClick={handleStartEditLabel}
                    className="inline-flex items-center justify-center rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    title="Modifica label"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Stripe ID
              </p>
              <p className="mt-1.5 truncate text-sm font-mono text-gray-900">
                {reader.stripeReaderId}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Evento corrente
              </p>
              <p className="mt-1.5 truncate text-sm text-gray-900">
                {reader.event ? (
                  reader.event.title
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Location associata
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-500">Nome</p>
                  <p className="text-sm font-medium text-gray-900">
                    {location?.displayName || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Stripe Location ID</p>
                  <p className="text-sm font-mono text-gray-900">
                    {location?.stripeLocationId || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Stato</p>
                  <p className="text-sm text-gray-900">
                    {location ? (location.active ? "Attiva" : "Disattiva") : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Indirizzo</p>
                  <p className="text-sm text-gray-900">
                    {location?.addressLine1 || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Citta</p>
                  <p className="text-sm text-gray-900">{location?.city || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">CAP / Provincia</p>
                  <p className="text-sm text-gray-900">
                    {location
                      ? `${location.postalCode || "-"}${
                          location.state ? ` - ${location.state}` : ""
                        }`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleActive}
              disabled={savingStatus}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                reader.active
                  ? "border-red-500 text-red-600 hover:bg-red-50"
                  : "border-green-500 text-green-600 hover:bg-green-50"
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
    </div>
  );
}
