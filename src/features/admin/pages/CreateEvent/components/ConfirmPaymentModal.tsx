import { CheckCircle, CreditCard } from "lucide-react";
import Modal from "@common/components/ui/Modal";
import Spinner from "@common/components/ui/Spinner";

interface FileTypeCount {
  count: number;
  fileTypeName: string;
}

export interface Payment {
  idOrdine: number;
  email?: string;
  amount: number;
  currency?: { symbol: string } | string;
  fileTypeCounts?: FileTypeCount[];
}

export interface ConfirmPaymentModalProps {
  payment: Payment | null;
  discountPercent: number;
  markingPaid: number | null;
  onHide: () => void;
  onDiscountChange: (value: number) => void;
  onConfirm: () => void;
  onOpenPOS: () => void;
}

function getCurrencySymbol(currency?: Payment["currency"]): string {
  if (!currency) return "€";
  if (typeof currency === "string") return currency;
  return currency.symbol;
}

function formatFileTypeCounts(fileTypeCounts?: FileTypeCount[]): string {
  if (!fileTypeCounts || fileTypeCounts.length === 0) return "—";
  return (
    fileTypeCounts
      .filter((ft) => ft.count > 0)
      .map((ft) => `${ft.count} ${ft.fileTypeName}`)
      .join(", ") || "—"
  );
}

export default function ConfirmPaymentModal({
  payment,
  discountPercent,
  markingPaid,
  onHide,
  onDiscountChange,
  onConfirm,
  onOpenPOS,
}: ConfirmPaymentModalProps) {
  return (
    <Modal show={!!payment} onHide={onHide} centered size="xl">
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Conferma pagamento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {payment && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Ordine</span>
              <span className="text-gray-900">{payment.idOrdine}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Email</span>
              <span className="text-gray-900">{payment.email || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Importo</span>
              <span className="text-gray-900">
                {getCurrencySymbol(payment.currency)}
                {payment.amount?.toFixed(2) ?? "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Contenuti</span>
              <span className="text-gray-900">
                {formatFileTypeCounts(payment.fileTypeCounts)}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-medium text-gray-600">Sconto (%)</label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[5, 10, 15, 20].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() =>
                          onDiscountChange(
                            discountPercent === preset ? 0 : preset,
                          )
                        }
                        className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                          discountPercent === preset
                            ? "bg-green-600 text-white border-green-600"
                            : "border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600"
                        }`}
                      >
                        {preset}%
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={discountPercent}
                    onChange={(e) =>
                      onDiscountChange(
                        Math.min(100, Math.max(0, Number(e.target.value))),
                      )
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            {discountPercent > 0 && (
              <>
                <div className="flex justify-between items-center pt-1 text-green-700 font-semibold">
                  <span>Importo finale</span>
                  <span>
                    {getCurrencySymbol(payment.currency)}
                    {(payment.amount * (1 - discountPercent / 100)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span>Risparmio</span>
                  <span>
                    -{getCurrencySymbol(payment.currency)}
                    {(payment.amount * (discountPercent / 100)).toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          onClick={onHide}
          className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          Annulla
        </button>
        <button
          type="button"
          onClick={onOpenPOS}
          disabled={markingPaid === payment?.idOrdine}
          className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard size={14} className="inline mr-1" />
          Paga POS
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={markingPaid === payment?.idOrdine}
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {markingPaid === payment?.idOrdine ? (
            <>
              <Spinner size="sm" className="inline mr-1" />
              Conferma...
            </>
          ) : (
            <>
              <CheckCircle size={14} className="inline mr-1" />
              Pagato cash
            </>
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
