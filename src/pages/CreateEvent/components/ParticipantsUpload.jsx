import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { apiRequest } from "../../../services/api-services";

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante il caricamento');
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
    <Container>
      <Row>
        <Col sm={12}>
          <h4>Caricamento partecipanti</h4>
          <p className="text-muted">
            Carica un file Excel (.xlsx o .xls) contenente l'elenco degli indirizzi email dei partecipanti verificati
          </p>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col sm={8}>
          <Form.Group controlId="excelFile">
            <Form.Label>File Excel</Form.Label>
            <Form.Control
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            {selectedFile && (
              <Form.Text className="text-success d-block mt-2">
                File selezionato: {selectedFile.name}
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col sm={4} className="d-flex align-items-end">
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Caricamento...
              </>
            ) : (
              'Carica sul server'
            )}
          </Button>
        </Col>
      </Row>

      {uploadStatus === 'success' && (
        <Alert variant="success" dismissible onClose={() => setUploadStatus(null)} className="mt-3">
          File caricato con successo!
        </Alert>
      )}

      {uploadStatus === 'error' && (
        <Alert variant="danger" dismissible onClose={() => setUploadStatus(null)} className="mt-3">
          Errore durante il caricamento: {errorMessage}
        </Alert>
      )}
    </Container>
  );
}
