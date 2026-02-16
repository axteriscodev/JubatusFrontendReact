import { useState, useEffect } from "react";
import { RefreshCw, Inbox, CheckCircle } from "lucide-react";
import { apiRequest } from "../../../services/api-services";
import Spinner from "../../../shared/components/ui/Spinner";
import EmptyState from "../../../shared/components/ui/EmptyState";
import LoadingState from "../../../shared/components/ui/LoadingState";
import Alert from "../../../shared/components/ui/Alert";
import Modal from "../../../shared/components/ui/Modal";
import Pagination from "../../../shared/components/ui/Pagination";

export default function PendingPayments({ eventId, initialPayments }) {
  const [payments, setPayments] = useState(initialPayments?.data || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [markingPaid, setMarkingPaid] = useState(null);
  const [confirmPayment, setConfirmPayment] = useState(null);

  // Pagination state
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

  // Filter state
  const [filterEmail, setFilterEmail] = useState("");
  const [filterAmount, setFilterAmount] = useState("");

  // Aggiorna lo state quando arrivano i dati iniziali dalla prop
  useEffect(() => {
    if (initialPayments) {
      setPayments(initialPayments.data || []);
      setTotalPages(initialPayments.pagination?.totalPages || 1);
      setTotalItems(initialPayments.pagination?.total || 0);
      setCurrentPage(initialPayments.pagination?.page || 1);
      setPageSize(initialPayments.pagination?.limit || 10);
    }
  }, [initialPayments]);

  // Fetch pending payments from API con supporto filtri e paginazione
  const fetchPendingPayments = async (
    page = currentPage,
    email = filterEmail,
    amount = filterAmount,
    limit = pageSize,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ page, limit });
      if (email) params.append("email", email);
      if (amount !== "") params.append("amount", amount);

      const response = await apiRequest({
        api: `${import.meta.env.VITE_API_URL}/events/event/${eventId}/payments?${params}`,
        method: "GET",
        needAuth: true,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Errore durante il caricamento");
      }

      const paginatedData = responseData.data;
      setPayments(paginatedData.data || []);
      setTotalPages(paginatedData.pagination?.totalPages || 1);
      setTotalItems(paginatedData.pagination?.total || 0);
      setCurrentPage(paginatedData.pagination?.page || page);
      setPageSize(paginatedData.pagination?.limit || limit);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Conferma mark-as-paid usando i dati dal modal
  const confirmMarkPaid = async () => {
    if (!confirmPayment) return;

    const payment = confirmPayment;
    setMarkingPaid(payment.idOrdine);

    try {
      const data = await apiRequest({
        api: `${import.meta.env.VITE_API_URL}/orders/order/${payment.idOrdine}/confirm-payment`,
        method: "PUT",
        needAuth: true,
      });

      if (!data.paymentSaved) {
        setError("Impossibile salvare il pagamento. Riprova più tardi.");
        return;
      }

      // Remove from local state
      setPayments((prev) =>
        prev.filter((p) => p.idOrdine !== payment.idOrdine),
      );
      setTotalItems((prev) => Math.max(0, prev - 1));
      setConfirmPayment(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setMarkingPaid(null);
    }
  };

  // Filter handlers
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

  // Pagination handler
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchPendingPayments(newPage, filterEmail, filterAmount, pageSize);
  };

  // Page size handler
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    fetchPendingPayments(1, filterEmail, filterAmount, newSize);
  };

  // Refresh handler
  const handleRefresh = () => {
    fetchPendingPayments(currentPage, filterEmail, filterAmount, pageSize);
  };

  // Formatta i conteggi fileType in modo compatto
  const formatFileTypeCounts = (fileTypeCounts) => {
    if (!fileTypeCounts || fileTypeCounts.length === 0) return "—";
    return (
      fileTypeCounts
        .filter((ft) => ft.count > 0)
        .map((ft) => `${ft.count} ${ft.fileTypeName}`)
        .join(", ") || "—"
    );
  };

  return (
    <div className="container mx-auto px-4">
      {/* Header Section */}
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

      {/* Filter Section */}
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
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md
                         hover:bg-blue-700 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Applica
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              disabled={loading}
              className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md
                         hover:bg-gray-100 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Totale: <span className="font-semibold">{totalItems}</span> pagamenti
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && !error && (
        <LoadingState message="Caricamento pagamenti in sospeso..." />
      )}

      {/* Empty State */}
      {!loading && !error && payments.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="Nessun pagamento in sospeso"
          subtitle="Tutti i pagamenti sono stati confermati"
        />
      )}

      {/* Table with Data */}
      {!loading && !error && payments.length > 0 && (
        <div className="overflow-x-auto shadow-sm rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-15 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
                  Ordine
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold  uppercase tracking-wider">
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
                    {payment.currency?.symbol || payment.currency || "€"}
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
                          Segna pagato
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

      {/* Pagination Footer */}
      {!loading && !error && payments.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Righe per pagina:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              disabled={loading}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         disabled:opacity-50"
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

      {/* Confirm Payment Modal */}
      <Modal
        show={!!confirmPayment}
        onHide={() => setConfirmPayment(null)}
        centered
        size="sm"
      >
        <Modal.Header closeButton onHide={() => setConfirmPayment(null)}>
          <Modal.Title>Conferma pagamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmPayment && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Ordine</span>
                <span className="text-gray-900">{confirmPayment.idOrdine}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Email</span>
                <span className="text-gray-900">
                  {confirmPayment.email || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Importo</span>
                <span className="text-gray-900">
                  {confirmPayment.currency?.symbol ||
                    confirmPayment.currency ||
                    "€"}
                  {confirmPayment.amount?.toFixed(2) ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Contenuti</span>
                <span className="text-gray-900">
                  {formatFileTypeCounts(confirmPayment.fileTypeCounts)}
                </span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={() => setConfirmPayment(null)}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md
                       hover:bg-gray-100 transition-colors"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={confirmMarkPaid}
            disabled={markingPaid === confirmPayment?.idOrdine}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md
                       hover:bg-green-700 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {markingPaid === confirmPayment?.idOrdine ? (
              <>
                <Spinner size="sm" className="inline mr-1" />
                Conferma...
              </>
            ) : (
              <>
                <CheckCircle size={14} className="inline mr-1" />
                Conferma
              </>
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
