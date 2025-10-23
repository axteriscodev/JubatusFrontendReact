import { Form, Row, Col, InputGroup } from "react-bootstrap";

/**
 * Componente per la gestione delle date dell'evento
 */
export function EventDates({ formData, onInputChange }) {
  return (
    <Row>
      <Col sm={4} className="mb-3">
        <Form.Label>Data evento</Form.Label>
        <InputGroup>
          <InputGroup.Text id="basic-addon-data-e">
            <i className="bi bi-calendar"></i>
          </InputGroup.Text>
          <Form.Control
            name="dateEvent"
            value={formData.dateEvent}
            onChange={onInputChange}
            placeholder="Data evento"
            type="date"
          />
        </InputGroup>
      </Col>

      <Col sm={4} className="mb-3">
        <Form.Label>Data pubblicazione</Form.Label>
        <InputGroup>
          <InputGroup.Text id="basic-addon-data-p">
            <i className="bi bi-calendar"></i>
          </InputGroup.Text>
          <Form.Control
            name="dateStart"
            value={formData.dateStart}
            onChange={onInputChange}
            placeholder="Data pubblicazione"
            type="date"
          />
        </InputGroup>
      </Col>

      <Col sm={4} className="mb-3">
        <Form.Label>Data scadenza</Form.Label>
        <InputGroup>
          <InputGroup.Text id="basic-addon-data-s">
            <i className="bi bi-calendar"></i>
          </InputGroup.Text>
          <Form.Control
            name="dateExpiry"
            value={formData.dateExpiry}
            onChange={onInputChange}
            placeholder="Data scadenza"
            type="date"
          />
        </InputGroup>
      </Col>

      <Col sm={6} className="mb-3">
        <Form.Label>Data inizio preordini</Form.Label>
        <InputGroup>
          <InputGroup.Text id="basic-addon-preorder-start">
            <i className="bi bi-calendar"></i>
          </InputGroup.Text>
          <Form.Control
            name="datePreorderStart"
            value={formData.datePreorderStart}
            onChange={onInputChange}
            placeholder="Data inizio preordini"
            type="date"
          />
        </InputGroup>
      </Col>

      <Col sm={6} className="mb-3">
        <Form.Label>Data fine preordini</Form.Label>
        <InputGroup>
          <InputGroup.Text id="basic-addon-preorder-expiry">
            <i className="bi bi-calendar"></i>
          </InputGroup.Text>
          <Form.Control
            name="datePreorderExpiry"
            value={formData.datePreorderExpiry}
            onChange={onInputChange}
            placeholder="Data fine preordini"
            type="date"
          />
        </InputGroup>
      </Col>
    </Row>
  );
}