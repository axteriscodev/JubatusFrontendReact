import { Form, Row, Col, Card, InputGroup } from "../../../shared/components/ui";

/**
 * Componente per la gestione delle date dell'evento - VERSIONE MIGLIORATA
 */
export function EventDates({ formData, onInputChange, errors = {}, onClearError = () => {} }) {
  // Handler per input con pulizia errore
  const handleInputWithClear = (e) => {
    const { name } = e.target;
    if (errors[name]) {
      onClearError(name);
    }
    onInputChange(e);
  };

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Body className="p-4">
        <div className="flex items-center mb-4">
          <div className="bg-green-500/10 rounded-3 p-3 mr-3">
            <i className="bi bi-calendar-event-fill text-success fs-4"></i>
          </div>
          <div>
            <h5 className="mb-1 fw-bold">Date e Scadenze</h5>
            <p className="text-muted mb-0 small">Gestisci le date importanti dell'evento</p>
          </div>
        </div>

        <Row className="gap-3">
          {/* Date principali */}
          <Col xs={12}>
            <div className="border-start border-4 border-primary ps-3 mb-3">
              <h6 className="text-primary fw-semibold mb-0">Date Principali</h6>
            </div>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-calendar-check-fill mr-2"></i>Data evento
              </Form.Label>
              <InputGroup className="shadow-sm" hasValidation>
                <InputGroup.Text className="bg-white border-2 border-end-0">
                  <i className="bi bi-calendar3 text-primary"></i>
                </InputGroup.Text>
                <Form.Control
                  name="dateEvent"
                  value={formData.dateEvent}
                  onChange={handleInputWithClear}
                  placeholder="Data evento"
                  type="date"
                  className="border-2 border-start-0"
                  style={{ fontSize: '0.95rem' }}
                  isInvalid={!!errors.dateEvent}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dateEvent}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-calendar-plus-fill mr-2"></i>Data pubblicazione
              </Form.Label>
              <InputGroup className="shadow-sm" hasValidation>
                <InputGroup.Text className="bg-white border-2 border-end-0">
                  <i className="bi bi-calendar3 text-success"></i>
                </InputGroup.Text>
                <Form.Control
                  name="dateStart"
                  value={formData.dateStart}
                  onChange={handleInputWithClear}
                  placeholder="Data pubblicazione"
                  type="date"
                  className="border-2 border-start-0"
                  style={{ fontSize: '0.95rem' }}
                  isInvalid={!!errors.dateStart}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dateStart}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-calendar-x-fill mr-2"></i>Data scadenza
              </Form.Label>
              <InputGroup className="shadow-sm" hasValidation>
                <InputGroup.Text className="bg-white border-2 border-end-0">
                  <i className="bi bi-calendar3 text-danger"></i>
                </InputGroup.Text>
                <Form.Control
                  name="dateExpiry"
                  value={formData.dateExpiry}
                  onChange={handleInputWithClear}
                  placeholder="Data scadenza"
                  type="date"
                  className="border-2 border-start-0"
                  style={{ fontSize: '0.95rem' }}
                  isInvalid={!!errors.dateExpiry}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dateExpiry}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>

          {/* Preordini */}
          <Col xs={12} className="mt-4">
            <div className="border-start border-4 border-warning ps-3 mb-3">
              <h6 className="text-warning fw-semibold mb-0">Periodo Preordini</h6>
            </div>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-hourglass-split mr-2"></i>Inizio preordini
              </Form.Label>
              <InputGroup className="shadow-sm">
                <InputGroup.Text className="bg-white border-2 border-end-0">
                  <i className="bi bi-calendar3 text-warning"></i>
                </InputGroup.Text>
                <Form.Control
                  name="datePreorderStart"
                  value={formData.datePreorderStart}
                  onChange={onInputChange}
                  placeholder="Data inizio preordini"
                  type="date"
                  className="border-2 border-start-0"
                  style={{ fontSize: '0.95rem' }}
                />
              </InputGroup>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-hourglass-bottom mr-2"></i>Fine preordini
              </Form.Label>
              <InputGroup className="shadow-sm">
                <InputGroup.Text className="bg-white border-2 border-end-0">
                  <i className="bi bi-calendar3 text-warning"></i>
                </InputGroup.Text>
                <Form.Control
                  name="datePreorderExpiry"
                  value={formData.datePreorderExpiry}
                  onChange={onInputChange}
                  placeholder="Data fine preordini"
                  type="date"
                  className="border-2 border-start-0"
                  style={{ fontSize: '0.95rem' }}
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}