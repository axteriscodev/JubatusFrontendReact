import { useState, useEffect } from "react";
import { RefreshCw, Inbox, Search } from "lucide-react";
import { apiRequest } from "../../../services/api-services";
import Spinner from "../../../shared/components/ui/Spinner";
import SearchBar from "../../../shared/components/ui/SearchBar";
import EmptyState from "../../../shared/components/ui/EmptyState";
import LoadingState from "../../../shared/components/ui/LoadingState";
import Alert from "../../../shared/components/ui/Alert";

/**
 * Componente per visualizzare e gestire la lista dei partecipanti verificati
 */
export function PartecipantsTable({ eventId }) {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(null);

  // Fetch attendees from API
  const fetchAttendees = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest({
        api: `${import.meta.env.VITE_API_URL}/events/${eventId}/attendees`,
        method: "GET",
        needAuth: true,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Errore durante il caricamento"
        );
      }

      setEmails(responseData.data.emails || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete email handler
  const handleDeleteEmail = async (email) => {
    const confirmDelete = window.confirm(
      `Sei sicuro di voler rimuovere "${email}" dalla lista partecipanti?`
    );

    if (!confirmDelete) return;

    setDeleteInProgress(email);

    try {
      const response = await apiRequest({
        api: `${import.meta.env.VITE_API_URL}/events/${eventId}/attendees`,
        method: "DELETE",
        needAuth: true,
        body: JSON.stringify({ email }),
        contentType: "application/json",
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Errore durante l'eliminazione"
        );
      }

      // Remove from local state
      setEmails((prev) => prev.filter((e) => e !== email));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteInProgress(null);
    }
  };

  // Search handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Refresh handler
  const handleRefresh = () => {
    fetchAttendees();
  };

  // Filter emails based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmails(emails);
    } else {
      const filtered = emails.filter((email) =>
        email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmails(filtered);
    }
  }, [emails, searchTerm]);

  // Initial load
  useEffect(() => {
    if (eventId) {
      fetchAttendees();
    }
  }, [eventId]);

  return (
    <div className="container mx-auto px-4">
      {/* Header Section */}
      <div className="mb-3">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold">Lista partecipanti</h4>
            <p className="text-gray-500 mb-0">
              Elenco degli indirizzi email dei partecipanti verificati caricati
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
        placeholder="Cerca per email..."
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClear={() => setSearchTerm("")}
        filteredCount={filteredEmails.length}
        totalCount={emails.length}
        countLabel="partecipanti"
      />

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && !error && (
        <LoadingState message="Caricamento partecipanti..." />
      )}

      {/* Empty State */}
      {!loading && !error && emails.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="Nessun partecipante caricato"
          subtitle="Carica un file Excel per visualizzare i partecipanti"
        />
      )}

      {/* No Results State */}
      {!loading && !error && emails.length > 0 && filteredEmails.length === 0 && (
        <EmptyState
          icon={Search}
          title={`Nessun risultato trovato per "${searchTerm}"`}
        />
      )}

      {/* Table with Data */}
      {!loading && !error && filteredEmails.length > 0 && (
        <div className="overflow-x-auto shadow-sm rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-15 px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                {/* <th className="w-[100px] px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Azioni
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmails.map((email, index) => (
                <tr
                  key={email}
                  className="hover:bg-gray-50 transition-colors even:bg-gray-50"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {email}
                  </td>
                  {/* <td className="px-4 py-3 whitespace-nowrap text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteEmail(email)}
                      disabled={deleteInProgress === email}
                      title="Elimina partecipante"
                      className="p-1.5 border border-red-500 text-red-500 rounded-md
                                 hover:bg-red-500 hover:text-white transition-colors
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteInProgress === email ? (
                        <Spinner size="sm" />
                      ) : (
                        <i className="bi bi-trash"></i>
                      )}
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
