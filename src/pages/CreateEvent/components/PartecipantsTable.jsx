import { useState, useEffect } from "react";
import { apiRequest } from "../../../services/api-services";

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
                <svg
                  className="animate-spin inline-block w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Caricamento...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-clockwise mr-2"></i>
                Aggiorna
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="flex shadow-sm">
          <span className="inline-flex items-center px-3 bg-white border-2 border-r-0 border-gray-300 rounded-l-md">
            <i className="bi bi-search text-blue-600"></i>
          </span>
          <input
            type="text"
            placeholder="Cerca per email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 border-2 border-l-0 border-gray-300 px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       rounded-r-md"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="px-3 border-2 border-l-0 border-gray-300 text-gray-600 
                         hover:bg-gray-100 transition-colors rounded-r-md -ml-px"
            >
              <i className="bi bi-x-circle"></i>
            </button>
          )}
        </div>
        <div className="text-right mt-2 md:mt-0 flex items-center justify-end">
          <small className="text-gray-500">
            Visualizzati {filteredEmails.length} di {emails.length} partecipanti
          </small>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-3">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex justify-between items-center">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="text-center py-12">
          <svg
            className="animate-spin inline-block w-8 h-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-500 mt-3">Caricamento partecipanti...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && emails.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <i className="bi bi-inbox text-5xl"></i>
            <p className="mt-3">Nessun partecipante caricato</p>
            <small>Carica un file Excel per visualizzare i partecipanti</small>
          </div>
        </div>
      )}

      {/* No Results State (search with no matches) */}
      {!loading && !error && emails.length > 0 && filteredEmails.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <i className="bi bi-search text-5xl"></i>
            <p className="mt-3">
              Nessun risultato trovato per &quot;{searchTerm}&quot;
            </p>
          </div>
        </div>
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
                        <svg
                          className="animate-spin w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
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