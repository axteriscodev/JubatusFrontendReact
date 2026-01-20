import { Form, Row, Col, Card } from "react-bootstrap";

/**
 * Componente per le informazioni base dell'evento - VERSIONE MIGLIORATA
 */
export function EventBasicInfo({
  formData,
  onInputChange,
  onTitleChange,
  tagList,
  currencyList,
  errors = {}
}) {
  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center mb-4">
          <div className="bg-info bg-opacity-10 rounded-3 p-3 me-3">
            <i className="bi bi-info-circle-fill text-primary fs-4"></i>
          </div>
          <div>
            <h5 className="mb-1 fw-bold">Informazioni Base</h5>
            <p className="text-muted mb-0 small">Dettagli principali dell'evento</p>
          </div>
        </div>

        <Row className="g-3">
          <Col lg={6}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-pencil-fill me-2"></i>Titolo evento
              </Form.Label>
              <Form.Control
                placeholder="Inserisci il titolo dell'evento"
                value={formData.title}
                onChange={onTitleChange}
                className="border-2"
                style={{ fontSize: '0.95rem' }}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col lg={6}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-link-45deg me-2"></i>URL
              </Form.Label>
              <Form.Control
                placeholder="URL generato automaticamente"
                value={formData.slug}
                disabled
                readOnly
                className="bg-light border-2"
                style={{ fontSize: '0.95rem' }}
              />
            </Form.Group>
          </Col>

          <Col lg={6}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-geo-alt-fill me-2"></i>Località
              </Form.Label>
              <Form.Control
                name="location"
                value={formData.location}
                onChange={onInputChange}
                placeholder="Es: Milano, Via Roma 123"
                className="border-2"
                style={{ fontSize: '0.95rem' }}
              />
            </Form.Group>
          </Col>

          <Col lg={6}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-cloud-arrow-up-fill me-2"></i>Path S3
              </Form.Label>
              <Form.Control
                name="pathS3"
                value={formData.pathS3}
                onChange={onInputChange}
                placeholder="percorso/cartella/s3"
                className="border-2"
                style={{ fontSize: '0.95rem' }}
                isInvalid={!!errors.pathS3}
              />
              <Form.Control.Feedback type="invalid">
                {errors.pathS3}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col lg={6}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-tag-fill me-2"></i>Tipologia evento
              </Form.Label>
              <Form.Select
                name="tagId"
                value={formData.tagId}
                onChange={onInputChange}
                className="border-2"
                style={{ fontSize: '0.95rem' }}
                isInvalid={!!errors.tagId}
              >
                <option value="">Seleziona una tipologia</option>
                {Array.isArray(tagList) &&
                  tagList.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.tag}
                    </option>
                  ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.tagId}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col lg={6}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-currency-exchange me-2"></i>Valuta
              </Form.Label>
              <Form.Select
                name="currencyId"
                value={formData.currencyId}
                onChange={onInputChange}
                className="border-2"
                style={{ fontSize: '0.95rem' }}
                isInvalid={!!errors.currencyId}
              >
                <option value="">Seleziona una valuta</option>
                {Array.isArray(currencyList) &&
                  currencyList.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.currency}
                    </option>
                  ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.currencyId}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col lg={6}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-emoji-smile-fill me-2"></i>Emoji attesa
              </Form.Label>
              <Form.Control
                name="emoji"
                value={formData.emoji}
                onChange={onInputChange}
                placeholder="🚴 🏃 ⚽"
                className="border-2"
                style={{ fontSize: '1.2rem' }}
              />
            </Form.Group>
          </Col>

          <Col xs={12}>
            <Form.Group>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-text-paragraph me-2"></i>Descrizione
              </Form.Label>
              <Form.Control
                name="description"
                value={formData.description}
                onChange={onInputChange}
                placeholder="Inserisci una descrizione dettagliata dell'evento..."
                as="textarea"
                rows={4}
                className="border-2"
                style={{ fontSize: '0.95rem' }}
              />
            </Form.Group>
          </Col>

          <Col xs={12}>
            <Card className="bg-light border-0">
              <Card.Body className="p-3">
                <Form.Check
                  type="checkbox"
                  id="verifiedAttendanceEvent"
                  name="verifiedAttendanceEvent"
                  checked={formData.verifiedAttendanceEvent}
                  onChange={(e) => onInputChange({
                    target: {
                      name: 'verifiedAttendanceEvent',
                      value: e.target.checked
                    }
                  })}
                  label={
                    <div>
                      <span className="fw-semibold">
                        <i className="bi bi-shield-check me-2 text-primary"></i>
                        Evento con partecipanti verificati
                      </span>
                      <div className="text-muted small mt-1">
                        Abilita la gestione dei partecipanti con caricamento Excel (numero chiuso)
                      </div>
                    </div>
                  }
                  className="mb-0"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}