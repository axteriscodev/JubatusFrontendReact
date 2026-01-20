import { Form, Row, Col, Button, Card, InputGroup } from "react-bootstrap";

/**
 * Componente per un singolo item (pacchetto) all'interno di un listino - VERSIONE MIGLIORATA
 */
export function PriceListItem({
  item,
  formIndex,
  rowIndex,
  onUpdate,
  onRemove,
  canRemove,
  currencySymbol = "€",
  labelList = [],
}) {
  return (
    <Card className="border-2 border-primary border-opacity-25">
      <Card.Body className="p-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-info bg-opacity-10 text-primary px-3 py-2">
              Pacchetto #{rowIndex + 1}
            </span>
            {item.bestOffer && (
              <span className="badge bg-success">
                <i className="bi bi-star-fill me-1"></i>
                Migliore Offerta
              </span>
            )}
          </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onRemove(formIndex, rowIndex)}
            disabled={!canRemove}
            className="shadow-sm"
          >
            <i className="bi bi-trash"></i>
          </Button>
        </div>

        <Row className="g-3">
          {/* Informazioni principali */}
          <Col md={8}>
            <Form.Group controlId={`f${formIndex}-r${rowIndex}-labelId`}>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-tag me-2"></i>Label Pacchetto
              </Form.Label>
              <Form.Select
                value={item.labelId ?? ""}
                onChange={(e) =>
                  onUpdate(formIndex, rowIndex, "labelId", e.target.value ? parseInt(e.target.value) : null)
                }
                className="border-2"
                style={{ fontSize: '0.95rem' }}
              >
                <option value="">Seleziona una label...</option>
                {labelList.map((label) => (
                  <option key={label.id} value={label.id}>
                    {label.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Label className="fw-semibold text-secondary small mb-2">
              <i className="bi bi-star-fill me-2"></i>Opzioni
            </Form.Label>
            <Card className="bg-light border-0 p-2">
              <Form.Check
                type="checkbox"
                id={`f${formIndex}-r${rowIndex}-bestOffer`}
                label={<span className="fw-semibold small">Migliore offerta</span>}
                checked={item.bestOffer}
                onChange={(e) =>
                  onUpdate(formIndex, rowIndex, "bestOffer", e.target.checked)
                }
              />
            </Card>
          </Col>
        </Row>

        {/* Divisore */}
        <hr className="my-3" />

        {/* Quantità e prezzi */}
        <Row className="g-3">
          <Col xs={12}>
            <small className="text-muted fw-semibold">
              <i className="bi bi-box me-2"></i>QUANTITÀ E PREZZI
            </small>
          </Col>

          <Col md={3} sm={6}>
            <Form.Group controlId={`f${formIndex}-r${rowIndex}-quantityPhoto`}>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-camera-fill me-2"></i>Foto
              </Form.Label>
              <InputGroup className="shadow-sm">
                <Form.Control
                  type="number"
                  value={item.quantityPhoto}
                  onChange={(e) =>
                    onUpdate(formIndex, rowIndex, "quantityPhoto", e.target.value)
                  }
                  placeholder="0"
                  className="border-2"
                  style={{ fontSize: '0.95rem' }}
                />
                <InputGroup.Text className="bg-white border-2 border-start-0">
                  <i className="bi bi-image text-primary"></i>
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>

          <Col md={3} sm={6}>
            <Form.Group controlId={`f${formIndex}-r${rowIndex}-quantityVideo`}>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-film me-2"></i>Video
              </Form.Label>
              <InputGroup className="shadow-sm">
                <Form.Control
                  type="number"
                  value={item.quantityVideo}
                  onChange={(e) =>
                    onUpdate(formIndex, rowIndex, "quantityVideo", e.target.value)
                  }
                  placeholder="0"
                  className="border-2"
                  style={{ fontSize: '0.95rem' }}
                />
                <InputGroup.Text className="bg-white border-2 border-start-0">
                  <i className="bi bi-play-circle text-danger"></i>
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>

          <Col md={3} sm={6}>
            <Form.Group controlId={`f${formIndex}-r${rowIndex}-price`}>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-cash me-2"></i>Prezzo
              </Form.Label>
              <InputGroup className="shadow-sm">
                <InputGroup.Text className="bg-white border-2 border-end-0">
                  {currencySymbol}
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    onUpdate(formIndex, rowIndex, "price", e.target.value)
                  }
                  placeholder="0.00"
                  className="border-2 border-start-0"
                  style={{ fontSize: '0.95rem' }}
                  step="0.01"
                />
              </InputGroup>
            </Form.Group>
          </Col>

          <Col md={3} sm={6}>
            <Form.Group controlId={`f${formIndex}-r${rowIndex}-discount`}>
              <Form.Label className="fw-semibold text-secondary small mb-2">
                <i className="bi bi-percent me-2"></i>Sconto
              </Form.Label>
              <InputGroup className="shadow-sm">
                <Form.Control
                  type="number"
                  value={item.discount}
                  onChange={(e) =>
                    onUpdate(formIndex, rowIndex, "discount", e.target.value)
                  }
                  placeholder="0"
                  className="border-2"
                  style={{ fontSize: '0.95rem' }}
                  min="0"
                  max="100"
                />
                <InputGroup.Text className="bg-white border-2 border-start-0">
                  <i className="bi bi-tag text-success"></i>
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        {/* Riepilogo prezzo finale */}
        {item.price > 0 && (
          <div className="mt-3 p-3 bg-success bg-opacity-10 rounded-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-secondary fw-semibold">
                <i className="bi bi-calculator me-2"></i>
                Prezzo finale:
              </span>
              <div className="text-end">
                {item.discount > 0 && (
                  <div>
                    <small className="text-muted text-decoration-line-through">
                      {currencySymbol}{parseFloat(item.price).toFixed(2)}
                    </small>
                  </div>
                )}
                <span className="fs-5 fw-bold text-success">
                  {currencySymbol}{(parseFloat(item.price) * (1 - parseFloat(item.discount || 0) / 100)).toFixed(2)}
                </span>
                {item.discount > 0 && (
                  <small className="text-success ms-2">
                    (-{item.discount}%)
                  </small>
                )}
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}