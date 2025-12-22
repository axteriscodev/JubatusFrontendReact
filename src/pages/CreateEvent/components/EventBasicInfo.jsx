import { Form, Row, Col } from "react-bootstrap";

/**
 * Componente per le informazioni base dell'evento
 */
export function EventBasicInfo({ 
  formData, 
  onInputChange, 
  onTitleChange, 
  tagList 
}) {
  return (
    <Row>
      <Col sm={6} className="mb-3">
        <Form.Label>Titolo</Form.Label>
        <Form.Control
          placeholder="Titolo"
          value={formData.title}
          onChange={onTitleChange}
        />
      </Col>

      <Col sm={6} className="mb-3">
        <Form.Label>Url</Form.Label>
        <Form.Control
          placeholder="Url"
          value={formData.slug}
          disabled
          readOnly
        />
      </Col>

      <Col sm={6} className="mb-3">
        <Form.Label>Località</Form.Label>
        <Form.Control
          name="location"
          value={formData.location}
          onChange={onInputChange}
          placeholder="Località"
        />
      </Col>

      <Col sm={6} className="mb-3">
        <Form.Label>Path S3</Form.Label>
        <Form.Control
          name="pathS3"
          value={formData.pathS3}
          onChange={onInputChange}
          placeholder="Path S3"
        />
      </Col>

      <Col sm={6} className="mb-3">
        <Form.Group>
          <Form.Label>Tipologia evento</Form.Label>
          <Form.Select
            name="tagId"
            value={formData.tagId}
            onChange={onInputChange}
          >
            <option value="">Seleziona un tipo</option>
            {Array.isArray(tagList) &&
              tagList.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.tag}
                </option>
              ))}
          </Form.Select>
        </Form.Group>
      </Col>

      <Col sm={6} className="mb-3">
        <Form.Label>Emote attesa</Form.Label>
        <Form.Control
          name="emoji"
          value={formData.emoji}
          onChange={onInputChange}
          placeholder="Inserisci delle emote (es: 🚴)"
        />
      </Col>

      <Col sm={12} className="mb-3">
        <Form.Label>Descrizione</Form.Label>
        <Form.Control
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Descrizione"
          as="textarea"
          rows={3}
        />
      </Col>

      <Col sm={12} className="mb-3">
        <Form.Check
          type="checkbox"
          id="verifiedAttendanceEvent"
          name="verifiedAttendanceEvent"
          label="Evento con partecipanti verificati (numero chiuso)"
          checked={formData.verifiedAttendanceEvent}
          onChange={(e) => onInputChange({
            target: {
              name: 'verifiedAttendanceEvent',
              value: e.target.checked
            }
          })}
        />
        <Form.Text className="text-muted">
          Abilita la gestione dei partecipanti con caricamento Excel
        </Form.Text>
      </Col>
    </Row>
  );
}