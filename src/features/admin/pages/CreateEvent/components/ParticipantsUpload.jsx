import { useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "@common/services/api-services";

/**
 * Componente per il caricamento Excel dei partecipanti verificati
 */
export function ParticipantsUpload({ eventId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Gestisce la selezione del file con validazione
   */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validazione tipo file
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];

    if (!validTypes.includes(file.type)) {
      setUploadStatus('error');
      setErrorMessage('Formato file non valido. Seleziona un file Excel (.xlsx o .xls)');
      setSelectedFile(null);
      e.target.value = ''; // Reset input
      return;
    }

    // Validazione dimensione (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadStatus('error');
      setErrorMessage('Il file è troppo grande. Dimensione massima: 5MB');
      setSelectedFile(null);
      e.target.value = ''; // Reset input
      return;
    }

    setSelectedFile(file);
    setUploadStatus(null);
    setErrorMessage("");
  };

  /**
   * Carica il file sul server
   */
  const handleUpload = async () => {
    if (!selectedFile || !eventId) return;

    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await apiRequest({
        api: `${import.meta.env.VITE_API_URL}/events/${eventId}/upload-attendees`,
        method: 'POST',
        body: formData,
        needAuth: true,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Errore durante il caricamento');
      }

      setUploadStatus('success');
      setSelectedFile(null);
      document.getElementById('excelFile').value = '';

    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="mb-3">
        <h4 className="text-xl font-bold">Caricamento partecipanti</h4>
        <p className="text-gray-500">
          Carica un file Excel (.xlsx o .xls) contenente l'elenco degli indirizzi email dei partecipanti verificati
        </p>
      </div>

      {/* Upload Form */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-3">
        {/* File Input */}
        <div className="sm:col-span-8">
          <label 
            htmlFor="excelFile"
            className="block font-medium text-gray-700 mb-1"
          >
            File Excel
          </label>
          <input
            type="file"
            id="excelFile"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100
                       disabled:opacity-50 disabled:cursor-not-allowed
                       border border-gray-300 rounded-md cursor-pointer"
          />
          {/* Spazio riservato per il messaggio - sempre presente per evitare shift del layout */}
          <div className="min-h-7 mt-2">
            {selectedFile && (
              <span className="text-green-600 text-sm block">
                File selezionato: {selectedFile.name}
              </span>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <div className="sm:col-span-4">
          <label className="block mb-1">&nbsp;</label>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium
                       hover:bg-blue-700 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center"
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin w-4 h-4 mr-2"
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
              'Carica sul server'
            )}
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {uploadStatus === 'success' && (
        <div className="mt-3">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex justify-between items-center">
            <span>File caricato con successo!</span>
            <button
              type="button"
              onClick={() => setUploadStatus(null)}
              className="text-green-700 hover:text-green-900"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {uploadStatus === 'error' && (
        <div className="mt-3">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex justify-between items-center">
            <span>Errore durante il caricamento: {errorMessage}</span>
            <button
              type="button"
              onClick={() => setUploadStatus(null)}
              className="text-red-700 hover:text-red-900"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}