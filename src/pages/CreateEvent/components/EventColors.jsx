import { Form, Row, Col } from "react-bootstrap";

/**
 * Componente per la selezione dei colori dell'evento
 */
export function EventColors({ formData, onInputChange }) {
  return (
    <Row>
      <Col sm={4} className="mb-3">
        <Form.Label htmlFor="backgroundColor">Colore background</Form.Label>
        <Form.Control
          type="color"
          id="backgroundColor"
          title="Scegli il colore di sfondo"
          name="backgroundColor"
          value={formData.backgroundColor}
          onChange={onInputChange}
        />
      </Col>

      <Col sm={4} className="mb-3">
        <Form.Label htmlFor="primaryColor">Colore primario</Form.Label>
        <Form.Control
          type="color"
          id="primaryColor"
          title="Scegli il colore primario"
          name="primaryColor"
          value={formData.primaryColor}
          onChange={onInputChange}
        />
      </Col>

      <Col sm={4} className="mb-3">
        <Form.Label htmlFor="secondaryColor">Colore secondario</Form.Label>
        <Form.Control
          type="color"
          id="secondaryColor"
          title="Scegli il colore secondario"
          name="secondaryColor"
          value={formData.secondaryColor}
          onChange={onInputChange}
        />
      </Col>
    </Row>
  );
}