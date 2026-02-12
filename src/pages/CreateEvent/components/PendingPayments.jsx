import { useState, useEffect } from "react";
import { RefreshCw, Inbox, Search, CheckCircle } from "lucide-react";
import { apiRequest } from "../../../services/api-services";
import Spinner from "../../../shared/components/ui/Spinner";
import SearchBar from "../../../shared/components/ui/SearchBar";
import EmptyState from "../../../shared/components/ui/EmptyState";
import LoadingState from "../../../shared/components/ui/LoadingState";
import Alert from "../../../shared/components/ui/Alert";
import Modal from "../../../shared/components/ui/Modal";

export default function PendingPayments({ eventId, initialPayments }) {
  const [payments, setPayments] = useState(initialPayments || []);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [markingPaid, setMarkingPaid] = useState(null);
  const [confirmPayment, setConfirmPayment] = useState(null);

  // Aggiorna lo state quando arrivano i dati iniziali dalla prop
  useEffect(() => {
    if (initialPayments) {
      setPayments(initialPayments);
    }
  }, [initialPayments]);

  // Fetch pending payments from API (usato dal pulsante Aggiorna)
  const fetchPendingPayments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest({
        api: `${import.meta.env.VITE_API_URL}/events/${eventId}/pending-payments`,
        method: "GET",
        needAuth: true,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Errore durante il caricamento",
        );
      }

      setPayments(responseData.data || []);
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
      await apiRequest({
        api: `${import.meta.env.VITE_API_URL}/orders/order/${payment.idOrdine}/confirm-payment`,
        method: "PUT",
        needAuth: true,
      });

      // Remove from local state
      setPayments((prev) =>
        prev.filter((p) => p.idOrdine !== payment.idOrdine),
      );
      setConfirmPayment(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setMarkingPaid(null);
    }
  };

  // Search handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Refresh handler
  const handleRefresh = () => {
    fetchPendingPayments();
  };

  // Filter payments based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPayments(payments);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = payments.filter(
        (p) =>
          String(p.idOrdine).includes(term) ||
          (p.email && p.email.toLowerCase().includes(term)),
      );
      setFilteredPayments(filtered);
    }
  }, [payments, searchTerm]);

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

      {/* Search Section */}
      <SearchBar
        placeholder="Cerca per ordine o email..."
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClear={() => setSearchTerm("")}
        filteredCount={filteredPayments.length}
        totalCount={payments.length}
        countLabel="pagamenti"
      />

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

      {/* No Results State */}
      {!loading &&
        !error &&
        payments.length > 0 &&
        filteredPayments.length === 0 && (
          <EmptyState
            icon={Search}
            title={`Nessun risultato trovato per "${searchTerm}"`}
          />
        )}

      {/* Table with Data */}
      {!loading && !error && filteredPayments.length > 0 && (
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
              {filteredPayments.map((payment, index) => (
                <tr
                  key={payment.idOrdine}
                  className="hover:bg-gray-50 transition-colors even:bg-gray-50"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
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
