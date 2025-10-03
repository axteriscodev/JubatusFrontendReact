import { Form, Row, Col, Button, Card } from "react-bootstrap";
import { PriceListItem } from "./PriceListItem";

/**
 * Componente per una singola card listino
 */
export function PriceListCard({ list, index, handlers, totalLists }) {
  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Listino #{index + 1}</h5>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handlers.removeList(index)}
          disabled={totalLists === 1}
        >
          Rimuovi listino
        </Button>
      </Card.Header>

      <Card.Body>
        {/* Date del listino */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId={`dateStart-${index}`}>
              <Form.Label>Data Inizio</Form.Label>
              <Form.Control
                type="date"
                value={list.dateStart}
                onChange={(e) =>
                  handlers.updateListDate(index, "dateStart", e.target.value)
                }
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId={`dateExpiry-${index}`}>
              <Form.Label>Data Fine</Form.Label>
              <Form.Control
                type="date"
                value={list.dateExpiry}
                onChange={(e) =>
                  handlers.updateListDate(index, "dateExpiry", e.target.value)
                }
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Items del listino */}
        {list.items.map((item, itemIndex) => (
          <PriceListItem
            key={itemIndex}
            item={item}
            formIndex={index}
            rowIndex={itemIndex}
            onUpdate={handlers.updateItem}
            onUpdateWithLanguage={handlers.updateItemWithLanguage}
            onRemove={handlers.removeItemFromList}
            canRemove={list.items.length > 1}
          />
        ))}

        <Button
          variant="secondary"
          onClick={() => handlers.addItemToList(index)}
          className="mt-2"
        >
          Aggiungi pacchetto
        </Button>
      </Card.Body>
    </Card>
  );
}