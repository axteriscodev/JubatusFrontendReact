import { useState, useEffect, useRef } from "react";
import { RefreshCw, Inbox, CheckCircle } from "lucide-react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { apiRequest } from "@common/services/api-services";
import { getAuthToken } from "@common/utils/auth";
import Spinner from "@common/components/ui/Spinner";
import EmptyState from "@common/components/ui/EmptyState";
import LoadingState from "@common/components/ui/LoadingState";
import Alert from "@common/components/ui/Alert";
import Pagination from "@common/components/ui/Pagination";
import ConfirmPaymentModal from "./ConfirmPaymentModal";
import POSModal, { type Reader } from "./POSModal";

interface FileTypeCount {
  count: number;
  fileTypeName: string;
}

interface Payment {
  idOrdine: number;
  email?: string;
  amount: number;
  currency?: { symbol: string } | string;
  fileTypeCounts?: FileTypeCount[];
}

interface PaginationData {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

interface InitialPayments {
  data: Payment[];
  pagination?: PaginationData;
}

export interface PendingPaymentsProps {
  eventId: string | number;
  initialPayments?: InitialPayments | null;
}

export default function PendingPayments({
  eventId,
  initialPayments,
}: PendingPaymentsProps) {
  const [payments, setPayments] = useState<Payment[]>(
    initialPayments?.data || [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markingPaid, setMarkingPaid] = useState<number | null>(null);
  const [confirmPayment, setConfirmPayment] = useState<Payment | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  const [currentPage, setCurrentPage] = useState(
    initialPayments?.pagination?.page || 1,
  );
  const [pageSize, setPageSize] = useState(
    initialPayments?.pagination?.limit || 10,
  );
  const [totalPages, setTotalPages] = useState(
    initialPayments?.pagination?.totalPages || 1,
  );
  const [totalItems, setTotalItems] = useState(
    initialPayments?.pagination?.total || 0,
  );

  const [filterEmail, setFilterEmail] = useState("");
  const [filterAmount, setFilterAmount] = useState("");

  // POS state
  const [posStep, setPosStep] = useState<0 | 1 | 2 | 3>(0);
  const [posPayment, setPosPayment] = useState<Payment | null>(null);
  const [posAmount, setPosAmount] = useState(0);
  const [readers, setReaders] = useState<Reader[]>([]);
  const [loadingReaders, setLoadingReaders] = useState(false);
  const [selectedReader, setSelectedReader] = useState<Reader | null>(null);
  const [posDiscountPercent, setPosDiscountPercent] = useState(0);
  const [posError, setPosError] = useState<string | null>(null);
  const [posSuccess, setPosSuccess] = useState(false);
  const [posPaymentIntentId, setPosPaymentIntentId] = useState<string | null>(null);
  const sseAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (initialPayments) {
      setPayments(initialPayments.data || []);
      setTotalPages(initialPayments.pagination?.totalPages || 1);
      setTotalItems(initialPayments.pagination?.total || 0);
      setCurrentPage(initialPayments.pagination?.page || 1);
      setPageSize(initialPayments.pagination?.limit || 10);
    }
  }, [initialPayments]);

  const fetchPendingPayments = async (
    page = currentPage,
    email = filterEmail,
    amount = filterAmount,
    limit = pageSize,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (email) params.append("email", email);
      if (amount !== "") params.append("amount", amount);

      const response = await apiRequest({
        api: `${import.meta.env.VITE_API_URL}/events/event/${eventId}/payments?${params}`,
        method: "GET",
        needAuth: true,
      });

      const responseData = (await response.json()) as {
        message?: string;
        data: { data: Payment[]; pagination: PaginationData };
      };

      if (!response.ok) {
        throw new Error(
          responseData.message || "Errore durante il caricamento",
        );
      }

      const paginatedData = responseData.data;
      setPayments(paginatedData.data || []);
      setTotalPages(paginatedData.pagination?.totalPages || 1);
      setTotalItems(paginatedData.pagination?.total || 0);
      setCurrentPage(paginatedData.pagination?.page || page);
      setPageSize(paginatedData.pagination?.limit || limit);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Errore durante il caricamento",
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmMarkPaid = async () => {
    if (!confirmPayment) return;

    const payment = confirmPayment;
    setMarkingPaid(payment.idOrdine);

    try {
      const discountedAmount =
        discountPercent > 0
          ? payment.amount * (1 - discountPercent / 100)
          : null;

      const response = await apiRequest({
        api: `${import.meta.env.VITE_API_URL}/orders/order/${payment.idOrdine}/confirm-payment`,
        method: "PUT",
        needAuth: true,
        body: JSON.stringify({
          amount: payment.amount,
          discountPercent: discountPercent,
          discountedAmount:
            discountedAmount !== null
              ? Number(discountedAmount.toFixed(2))
              : payment.amount,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        data: { paymentSaved: boolean };
      };

      if (!response.ok) {
        throw new Error(data.message || "Errore durante il salvataggio");
      }
      if (!data.data.paymentSaved) {
        setError("Impossibile salvare il pagamento. Riprova più tardi.");
        return;
      }

      setPayments((prev) =>
        prev.filter((p) => p.idOrdine !== payment.idOrdine),
      );
      setTotalItems((prev) => Math.max(0, prev - 1));
      handleCloseModal();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Errore durante il salvataggio",
      );
    } finally {
      setMarkingPaid(null);
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchPendingPayments(1, filterEmail, filterAmount, pageSize);
  };

  const handleResetFilters = () => {
    setFilterEmail("");
    setFilterAmount("");
    setCurrentPage(1);
    fetchPendingPayments(1, "", "", pageSize);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchPendingPayments(newPage, filterEmail, filterAmount, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    fetchPendingPayments(1, filterEmail, filterAmount, newSize);
  };

  const handleCloseModal = () => {
    setConfirmPayment(null);
    setDiscountPercent(0);
  };

  const handleRefresh = () => {
    fetchPendingPayments(currentPage, filterEmail, filterAmount, pageSize);
  };

  const handleOpenPOS = async () => {
    if (!confirmPayment) return;

    const finalAmount =
      discountPercent > 0
        ? Number(
            (confirmPayment.amount * (1 - discountPercent / 100)).toFixed(2),
          )
        : confirmPayment.amount;

    setPosPayment(confirmPayment);
    setPosAmount(finalAmount);
    setPosDiscountPercent(discountPercent);
    handleCloseModal();
    setPosStep(1);
    setSelectedReader(null);
    setPosError(null);
    setPosSuccess(false);

    setLoadingReaders(true);
    try {
      const response = await apiRequest({
        api: `${import.meta.env.VITE_API_URL}/events/event/${eventId}/readers`,
        method: "GET",
        needAuth: true,
      });
      const data = (await response.json()) as {
        data: { readers: Reader[] };
        message?: string;
      };
      if (!response.ok)
        throw new Error(data.message || "Errore nel caricamento dei reader");
      setReaders(data.data.readers || []);
    } catch (err) {
      setPosError(
        err instanceof Error
          ? err.message
          : "Impossibile caricare i reader disponibili",
      );
      setReaders([]);
    } finally {
      setLoadingReaders(false);
    }
  };

  const stopSSE = () => {
    if (sseAbortRef.current) {
      sseAbortRef.current.abort();
      sseAbortRef.current = null;
    }
  };

  const startSSEResult = (payment: Payment) => {
    const controller = new AbortController();
    sseAbortRef.current = controller;
    const token = getAuthToken();

    fetchEventSource(
      `${import.meta.env.VITE_API_URL}/orders/order/${payment.idOrdine}/reader-result`,
      {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          Authorization: token ? `Bearer ${token}` : "",
        },
        signal: controller.signal,
        async onmessage(msg) {
          try {
            const data = JSON.parse(msg.data) as {
              status?: string;
              success?: boolean;
            };
            const succeeded =
              data.status === "succeeded" || data.success === true;
            const failed =
              data.status === "failed" ||
              data.status === "canceled" ||
              data.success === false;

            if (succeeded) {
              stopSSE();
              setPayments((prev) =>
                prev.filter((p) => p.idOrdine !== payment.idOrdine),
              );
              setTotalItems((prev) => Math.max(0, prev - 1));
              setPosSuccess(true);
            } else if (failed) {
              stopSSE();
              setPosError("Pagamento non riuscito. Riprova.");
              setPosStep(1);
            }
          } catch {
            /* ignora errori di parsing */
          }
        },
        onerror(err) {
          if (controller.signal.aborted) return;
          console.error("Errore SSE reader-result:", err);
          setPosError("Errore nella connessione al reader.");
          setPosStep(1);
          throw err;
        },
      },
    );
  };

  const handleSelectReader = async (reader: Reader) => {
    setSelectedReader(reader);
    setPosStep(2);
    setPosError(null);

    try {
      const response = await apiRequest({
        api: `${import.meta.env.VITE_API_URL}/orders/order/${posPayment?.idOrdine}/reader-payment`,
        method: "POST",
        needAuth: true,
        body: JSON.stringify({
          amount: posPayment?.amount,
          discountPercent: posDiscountPercent,
          discountedAmount: posAmount,
          readerId: reader.id,
        }),
      });
      const data = (await response.json()) as {
        message?: string;
        data: { paymentIntentId: string; readerState: unknown };
      };
      if (!response.ok) {
        throw new Error(
          data.message || "Errore durante l'invio del pagamento al reader",
        );
      }
      setPosPaymentIntentId(data.data.paymentIntentId);
      setPosStep(3);
      if (posPayment) startSSEResult(posPayment);
    } catch (err) {
      setPosError(
        err instanceof Error ? err.message : "Errore di connessione al reader",
      );
      setPosStep(1);
    }
  };

  const handleClosePOS = () => {
    stopSSE();
    setPosStep(0);
    setPosPayment(null);
    setPosError(null);
    setPosSuccess(false);
    setSelectedReader(null);
    setPosPaymentIntentId(null);
  };

  const handlePOSRetry = () => {
    stopSSE();
    setPosError(null);
    setPosSuccess(false);
    setSelectedReader(null);
    setPosPaymentIntentId(null);
    setPosStep(1);
  };

  const handlePOSCancel = async () => {
    stopSSE();
    if (posPayment && posPaymentIntentId) {
      try {
        await apiRequest({
          api: `${import.meta.env.VITE_API_URL}/orders/order/${posPayment.idOrdine}/payment/${posPaymentIntentId}`,
          method: "DELETE",
          needAuth: true,
        });
      } catch {
        /* il pagamento viene annullato lato UI comunque */
      }
    }
    setPosError(null);
    setPosSuccess(false);
    setSelectedReader(null);
    setPosPaymentIntentId(null);
    setPosStep(1);
  };

  const formatFileTypeCounts = (fileTypeCounts?: FileTypeCount[]): string => {
    if (!fileTypeCounts || fileTypeCounts.length === 0) return "—";
    return (
      fileTypeCounts
        .filter((ft) => ft.count > 0)
        .map((ft) => `${ft.count} ${ft.fileTypeName}`)
        .join(", ") || "—"
    );
  };

  const getCurrencySymbol = (currency?: Payment["currency"]): string => {
    if (!currency) return "€";
    if (typeof currency === "string") return currency;
    return currency.symbol;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-3">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold">Pagamenti in sospeso</h4>
            <p className="text-gray-500 mb-0">
              Ordini in attesa di conferma pagamento
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="px-3 py-1.5 text-sm border border-blue-600 text-blue-600 rounded-md shadow-sm
                       hover:bg-blue-600 hover:text-white transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Caricamento...
              </>
            ) : (
              <>
                <RefreshCw size={14} className="inline mr-2" />
                Aggiorna
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="text"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
              placeholder="Filtra per email"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Importo
            </label>
            <input
              type="number"
              value={filterAmount}
              onChange={(e) => setFilterAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
              placeholder="Filtra per importo esatto"
              min="0"
              step="0.01"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={handleApplyFilters}
              disabled={loading}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Applica
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              disabled={loading}
              className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Totale: <span className="font-semibold">{totalItems}</span> pagamenti
        </p>
      </div>

      {error && (
        <Alert variant="danger" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && !error && (
        <LoadingState message="Caricamento pagamenti in sospeso..." />
      )}

      {!loading && !error && payments.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="Nessun pagamento in sospeso"
          subtitle="Tutti i pagamenti sono stati confermati"
        />
      )}

      {!loading && !error && payments.length > 0 && (
        <div className="overflow-x-auto shadow-sm rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-15 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Ordine
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Importo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Contenuti
                </th>
                <th className="w-35 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <tr
                  key={payment.idOrdine}
                  className="hover:bg-gray-50 transition-colors even:bg-gray-50"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {payment.idOrdine}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {payment.email || "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {getCurrencySymbol(payment.currency)}
                    {payment.amount?.toFixed(2) ?? "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatFileTypeCounts(payment.fileTypeCounts)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <button
                      type="button"
                      onClick={() => setConfirmPayment(payment)}
                      disabled={markingPaid === payment.idOrdine}
                      title="Segna come pagato"
                      className="px-3 py-1.5 text-sm border border-green-600 text-green-600 rounded-md
                                 hover:bg-green-600 hover:text-white transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {markingPaid === payment.idOrdine ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          <CheckCircle size={14} className="inline mr-1" />
                          Gestisci
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && payments.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Righe per pagina:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              disabled={loading}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        </div>
      )}

      <ConfirmPaymentModal
        payment={confirmPayment}
        discountPercent={discountPercent}
        markingPaid={markingPaid}
        onHide={handleCloseModal}
        onDiscountChange={setDiscountPercent}
        onConfirm={confirmMarkPaid}
        onOpenPOS={handleOpenPOS}
      />

      <POSModal
        posStep={posStep}
        posPayment={posPayment}
        posAmount={posAmount}
        readers={readers}
        loadingReaders={loadingReaders}
        selectedReader={selectedReader}
        posError={posError}
        posSuccess={posSuccess}
        onClose={handleClosePOS}
        onSelectReader={handleSelectReader}
        onRetry={handlePOSRetry}
        onCancel={handlePOSCancel}
        onDismissError={() => setPosError(null)}
      />
    </div>
  );
}
