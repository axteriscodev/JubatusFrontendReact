import { CreditCard, Monitor, CheckCircle, AlertCircle } from "lucide-react";
import Modal from "@common/components/ui/Modal";
import Spinner from "@common/components/ui/Spinner";
import Alert from "@common/components/ui/Alert";
import EmptyState from "@common/components/ui/EmptyState";
import LoadingState from "@common/components/ui/LoadingState";

interface Payment {
  currency?: { symbol: string } | string;
}

export interface Reader {
  id: number;
  stripeReaderId: string;
  label: string;
  registrationCode?: string | null;
  active: boolean;
  terminalLocationId: number;
  hide: boolean;
  location?: {
    id: number;
    displayName: string;
  };
}

export interface POSModalProps {
  posStep: 0 | 1 | 2 | 3;
  posPayment: Payment | null;
  posAmount: number;
  readers: Reader[];
  loadingReaders: boolean;
  selectedReader: Reader | null;
  posError: string | null;
  posSuccess: boolean;
  onClose: () => void;
  onSelectReader: (reader: Reader) => void;
  onRetry: () => void;
  onCancel: () => void;
  onDismissError: () => void;
}

function getCurrencySymbol(currency?: Payment["currency"]): string {
  if (!currency) return "€";
  if (typeof currency === "string") return currency;
  return currency.symbol;
}

export default function POSModal({
  posStep,
  posPayment,
  posAmount,
  readers,
  loadingReaders,
  selectedReader,
  posError,
  posSuccess,
  onClose,
  onSelectReader,
  onRetry,
  onCancel,
  onDismissError,
}: POSModalProps) {
  return (
    <Modal show={posStep > 0} onHide={onClose} centered size="xl">
      {/* Step 1 — Selezione reader */}
      {posStep === 1 && (
        <>
          <Modal.Header closeButton onHide={onClose}>
            <Modal.Title>
              <CreditCard size={16} className="inline mr-2" />
              Pagamento POS — Seleziona reader
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {posError && (
              <Alert variant="danger" onDismiss={onDismissError}>
                {posError}
              </Alert>
            )}
            {loadingReaders && (
              <LoadingState message="Caricamento reader disponibili..." />
            )}
            {!loadingReaders && readers.length === 0 && !posError && (
              <EmptyState
                icon={Monitor}
                title="Nessun reader disponibile"
                subtitle="Non ci sono reader attivi da selezionare"
              />
            )}
            {!loadingReaders && readers.length > 0 && (
              <div className="space-y-2">
                {posPayment && (
                  <p className="text-sm text-gray-500 mb-3">
                    Importo da addebitare:{" "}
                    <span className="font-semibold text-gray-800">
                      {getCurrencySymbol(posPayment.currency)}
                      {posAmount.toFixed(2)}
                    </span>
                  </p>
                )}
                {readers.map((reader) => (
                  <button
                    key={reader.id}
                    type="button"
                    onClick={() => onSelectReader(reader)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <Monitor size={20} className="text-blue-600 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {reader.label}
                      </p>
                      {reader.location && (
                        <p className="text-xs text-gray-500">
                          {reader.location.displayName}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Annulla
            </button>
          </Modal.Footer>
        </>
      )}

      {/* Step 2 — Invio in corso */}
      {posStep === 2 && (
        <>
          <Modal.Header>
            <Modal.Title>
              <CreditCard size={16} className="inline mr-2" />
              Pagamento POS — Invio in corso
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col items-center gap-4 py-6">
              <Spinner size="lg" />
              <p className="text-sm text-gray-600 text-center">
                Invio pagamento al reader{" "}
                <span className="font-semibold">{selectedReader?.label}</span>
                ...
              </p>
            </div>
          </Modal.Body>
        </>
      )}

      {/* Step 3 — In attesa / risultato */}
      {posStep === 3 && (
        <>
          <Modal.Header closeButton={posSuccess || !!posError} onHide={onClose}>
            <Modal.Title>
              <CreditCard size={16} className="inline mr-2" />
              {posSuccess
                ? "Pagamento POS — Completato"
                : posError
                  ? "Pagamento POS — Errore"
                  : "Pagamento POS — In attesa..."}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!posSuccess && !posError && (
              <div className="flex flex-col items-center gap-4 py-6">
                <Spinner size="lg" />
                <p className="text-sm text-gray-600 text-center">
                  In attesa di conferma dal reader{" "}
                  <span className="font-semibold">{selectedReader?.label}</span>
                  .<br />
                  Il cliente può presentare la carta.
                </p>
              </div>
            )}
            {posSuccess && (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle size={48} className="text-green-500" />
                <p className="text-base font-semibold text-green-700">
                  Pagamento riuscito!
                </p>
              </div>
            )}
            {posError && (
              <div className="flex flex-col items-center gap-3 py-6">
                <AlertCircle size={48} className="text-red-500" />
                <p className="text-sm text-red-700 text-center">{posError}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {!posSuccess && !posError && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                Annulla pagamento
              </button>
            )}
            {posSuccess && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Chiudi
              </button>
            )}
            {posError && (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Riprova
                </button>
              </>
            )}
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
