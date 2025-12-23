import { Form, Row, Col, Button, Card, InputGroup, Badge } from "react-bootstrap";
import { PriceListItem } from "./PriceListItem";

/**
 * Componente per una singola card listino - VERSIONE MIGLIORATA
 */
export function PriceListCard({ list, index, handlers, totalLists }) {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom py-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-info bg-opacity-10 rounded-3 p-2">
              <i className="bi bi-receipt text-primary fs-5"></i>
            </div>
            <div>
              <h5 className="mb-0 fw-bold">Listino #{index + 1}</h5>
              <small className="text-muted">
                {list.items.length} {list.items.length === 1 ? 'pacchetto' : 'pacchetti'}
              </small>
            </div>
          </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handlers.removeList(index)}
            disabled={totalLists === 1}
            className="shadow-sm"
          >
            <i className="bi bi-trash me-2"></i>
            Elimina listino
          </Button>
        </div>
      </Card.Header>

      <Card.Body className="p-4">
        {/* Date del listino */}
        <div className="bg-light rounded-3 p-3 mb-4">
          <h6 className="fw-semibold mb-3 text-secondary">
            <i className="bi bi-calendar-range me-2"></i>
            Periodo di validità
          </h6>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId={`dateStart-${index}`}>
                <Form.Label className="fw-semibold text-secondary small mb-2">
                  <i className="bi bi-calendar-plus me-2"></i>Data Inizio
                </Form.Label>
                <InputGroup className="shadow-sm">
                  <InputGroup.Text className="bg-white border-2 border-end-0">
                    <i className="bi bi-calendar3 text-success"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    value={list.dateStart}
                    onChange={(e) =>
                      handlers.updateListDate(index, "dateStart", e.target.value)
                    }
                    className="border-2 border-start-0"
                    style={{ fontSize: '0.95rem' }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId={`dateExpiry-${index}`}>
                <Form.Label className="fw-semibold text-secondary small mb-2">
                  <i className="bi bi-calendar-x me-2"></i>Data Fine
                </Form.Label>
                <InputGroup className="shadow-sm">
                  <InputGroup.Text className="bg-white border-2 border-end-0">
                    <i className="bi bi-calendar3 text-danger"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    value={list.dateExpiry}
                    onChange={(e) =>
                      handlers.updateListDate(index, "dateExpiry", e.target.value)
                    }
                    className="border-2 border-start-0"
                    style={{ fontSize: '0.95rem' }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Titolo sezione pacchetti */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="fw-semibold mb-0 text-secondary">
            <i className="bi bi-box-seam me-2"></i>
            Pacchetti disponibili
          </h6>
          <Badge bg="primary" className="px-3 py-2">
            {list.items.length}
          </Badge>
        </div>

        {/* Items del listino */}
        <div className="d-flex flex-column gap-3">
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
        </div>

        <Button
          variant="outline-primary"
          onClick={() => handlers.addItemToList(index)}
          className="mt-3 w-100 shadow-sm"
          style={{ borderStyle: 'dashed', borderWidth: '2px' }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Aggiungi pacchetto
        </Button>
      </Card.Body>
    </Card>
  );
}