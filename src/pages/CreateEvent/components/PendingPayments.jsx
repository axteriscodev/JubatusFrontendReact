import { useState, useEffect } from "react";
import { RefreshCw, Inbox, Search, CheckCircle } from "lucide-react";
import { apiRequest } from "../../../services/api-services";
import Spinner from "../../../shared/components/ui/Spinner";
import SearchBar from "../../../shared/components/ui/SearchBar";
import EmptyState from "../../../shared/components/ui/EmptyState";
import LoadingState from "../../../shared/components/ui/LoadingState";
import Alert from "../../../shared/components/ui/Alert";

export default function PendingPayments({ eventId }) {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [markingPaid, setMarkingPaid] = useState(null);

  // Fetch pending payments from API
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

  // Mark as paid handler (placeholder — API endpoint verrà collegato in seguito)
  const handleMarkPaid = async (payment) => {
    const confirmPaid = window.confirm(
      `Sei sicuro di voler segnare l'ordine "${payment.orderNumber}" come pagato?`,
    );

    if (!confirmPaid) return;

    setMarkingPaid(payment.id);

    try {
      // TODO: collegare endpoint API
      // await apiRequest({
      //   api: `${import.meta.env.VITE_API_URL}/events/${eventId}/pending-payments/${payment.id}/mark-paid`,
      //   method: "POST",
      //   needAuth: true,
      // });
      console.log("Segna come pagato:", payment);

      // Simula breve attesa per feedback visivo
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Remove from local state
      setPayments((prev) => prev.filter((p) => p.id !== payment.id));
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
      const filtered = payments.filter((p) =>
        p.orderNumber.toLowerCase().includes(term),
      );
      setFilteredPayments(filtered);
    }
  }, [payments, searchTerm]);

  // Initial load
  useEffect(() => {
    if (eventId) {
      fetchPendingPayments();
    }
  }, [eventId]);

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
        placeholder="Cerca per numero ordine..."
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
      {!loading && !error && payments.length > 0 && filteredPayments.length === 0 && (
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
                <th className="w-15 px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Numero Ordine
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Importo
                </th>
                <th className="w-[140px] px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment, index) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 transition-colors even:bg-gray-50"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {payment.orderNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    &euro;{payment.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <button
                      type="button"
                      onClick={() => handleMarkPaid(payment)}
                      disabled={markingPaid === payment.id}
                      title="Segna come pagato"
                      className="px-3 py-1.5 text-sm border border-green-600 text-green-600 rounded-md
                                 hover:bg-green-600 hover:text-white transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {markingPaid === payment.id ? (
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
    </div>
  );
}
