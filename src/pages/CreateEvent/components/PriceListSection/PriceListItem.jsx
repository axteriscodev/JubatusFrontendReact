import { Form, Row, Col, Button } from "react-bootstrap";

/**
 * Componente per un singolo item (pacchetto) all'interno di un listino
 */
export function PriceListItem({
  item,
  formIndex,
  rowIndex,
  onUpdate,
  onUpdateWithLanguage,
  onRemove,
  canRemove,
}) {
  return (
    <Col md={12}>
      <Row>
        <Col md={4}>
          <Form.Group controlId={`f${formIndex}-r${rowIndex}-title`}>
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              value={item.itemsLanguages?.[0]?.title ?? ""}
              onChange={(e) =>
                onUpdateWithLanguage(formIndex, rowIndex, "title", e.target.value)
              }
              placeholder="Titolo"
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId={`f${formIndex}-r${rowIndex}-subTitle`}>
            <Form.Label>Sottotitolo</Form.Label>
            <Form.Control
              value={item.itemsLanguages?.[0]?.subTitle ?? ""}
              onChange={(e) =>
                onUpdateWithLanguage(formIndex, rowIndex, "subTitle", e.target.value)
              }
              placeholder="Sottotitolo"
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId={`f${formIndex}-r${rowIndex}-bestOffer`}>
            <Form.Label>Miglior offerta</Form.Label>
            <Form.Check
              type="checkbox"
              checked={item.bestOffer}
              onChange={(e) =>
                onUpdate(formIndex, rowIndex, "bestOffer", e.target.checked)
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3 align-items-end">
        <Col md={2}>
          <Form.Group controlId={`f${formIndex}-r${rowIndex}-quantityPhoto`}>
            <Form.Label>Quantità foto</Form.Label>
            <Form.Control
              type="number"
              value={item.quantityPhoto}
              onChange={(e) =>
                onUpdate(formIndex, rowIndex, "quantityPhoto", e.target.value)
              }
              placeholder="Numero"
            />
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group controlId={`f${formIndex}-r${rowIndex}-quantityVideo`}>
            <Form.Label>Quantità video</Form.Label>
            <Form.Control
              type="number"
              value={item.quantityVideo}
              onChange={(e) =>
                onUpdate(formIndex, rowIndex, "quantityVideo", e.target.value)
              }
              placeholder="Numero"
            />
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group controlId={`f${formIndex}-r${rowIndex}-price`}>
            <Form.Label>Prezzo</Form.Label>
            <Form.Control
              type="number"
              value={item.price}
              onChange={(e) =>
                onUpdate(formIndex, rowIndex, "price", e.target.value)
              }
              placeholder="Prezzo"
            />
          </Form.Group>
        </Col>

        <Col md={2}>
          <Form.Group controlId={`f${formIndex}-r${rowIndex}-discount`}>
            <Form.Label>Sconto</Form.Label>
            <Form.Control
              type="number"
              value={item.discount}
              onChange={(e) =>
                onUpdate(formIndex, rowIndex, "discount", e.target.value)
              }
              placeholder="Sconto"
            />
          </Form.Group>
        </Col>

        <Col md={2}>
          <Button
            variant="danger"
            onClick={() => onRemove(formIndex, rowIndex)}
            disabled={!canRemove}
          >
            <i className="bi bi-trash"></i>
          </Button>
        </Col>
      </Row>
    </Col>
  );
}