import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Alert,
  Spinner,
  Form,
  InputGroup,
} from "../../../shared/components/ui";
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
    <Container>
      {/* Header Section */}
      <Row>
        <Col sm={12}>
          <div className="flex justify-between items-center mb-3">
            <div>
              <h4>Lista partecipanti</h4>
              <p className="text-muted mb-0">
                Elenco degli indirizzi email dei partecipanti verificati
                caricati
              </p>
            </div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="shadow-sm"
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="mr-2"
                  />
                  Caricamento...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-clockwise mr-2"></i>
                  Aggiorna
                </>
              )}
            </Button>
          </div>
        </Col>
      </Row>

      {/* Search Section */}
      <Row className="mb-3">
        <Col sm={12} md={6}>
          <InputGroup className="shadow-sm">
            <InputGroup.Text className="bg-white border-2 border-end-0">
              <i className="bi bi-search text-primary"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Cerca per email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border-2 border-start-0"
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm("")}
              >
                <i className="bi bi-x-circle"></i>
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col sm={12} md={6} className="text-right mt-2 mt-20-0">
          <small className="text-muted">
            Visualizzati {filteredEmails.length} di {emails.length}{" "}
            partecipanti
          </small>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Row className="mb-3">
          <Col sm={12}>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Loading State */}
      {loading && !error && (
        <Row>
          <Col sm={12} className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-3">Caricamento partecipanti...</p>
          </Col>
        </Row>
      )}

      {/* Empty State */}
      {!loading && !error && emails.length === 0 && (
        <Row>
          <Col sm={12} className="text-center py-5">
            <div className="text-muted">
              <i className="bi bi-inbox" style={{ fontSize: "3rem" }}></i>
              <p className="mt-3">Nessun partecipante caricato</p>
              <small>Carica un file Excel per visualizzare i partecipanti</small>
            </div>
          </Col>
        </Row>
      )}

      {/* No Results State (search with no matches) */}
      {!loading &&
        !error &&
        emails.length > 0 &&
        filteredEmails.length === 0 && (
          <Row>
            <Col sm={12} className="text-center py-5">
              <div className="text-muted">
                <i className="bi bi-search" style={{ fontSize: "3rem" }}></i>
                <p className="mt-3">
                  Nessun risultato trovato per &quot;{searchTerm}&quot;
                </p>
              </div>
            </Col>
          </Row>
        )}

      {/* Table with Data */}
      {!loading && !error && filteredEmails.length > 0 && (
        <Row>
          <Col sm={12}>
            <Table striped bordered hover responsive className="shadow-sm">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "60px" }}>#</th>
                  <th>Email</th>
                  {/* <th style={{ width: "100px" }} className="text-center">
                    Azioni
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {filteredEmails.map((email, index) => (
                  <tr key={email}>
                    <td>{index + 1}</td>
                    <td>{email}</td>
                    {/* <td className="text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteEmail(email)}
                        disabled={deleteInProgress === email}
                        title="Elimina partecipante"
                      >
                        {deleteInProgress === email ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          <i className="bi bi-trash"></i>
                        )}
                      </Button> 
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  );
}
