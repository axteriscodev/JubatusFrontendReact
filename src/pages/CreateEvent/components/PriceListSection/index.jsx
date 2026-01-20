import { Col, Button } from "react-bootstrap";
import { PriceListCard } from "./PriceListCard";

/**
 * Componente principale per la sezione listini prezzi - VERSIONE MIGLIORATA
 */
export function PriceListSection({ priceLists, handlers, currencySymbol = "€" }) {
  return (
    <Col xs={12}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="mb-1 fw-bold">
            Gestione Listini Prezzi
          </h4>
          <p className="text-muted mb-0 small">
            Configura i pacchetti e i prezzi disponibili per questo evento
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={handlers.addList} 
          className="shadow-sm"
          style={{ minWidth: '150px' }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Nuovo listino
        </Button>
      </div>

      {priceLists.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-3">
          <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="text-muted mt-3 mb-0">
            Nessun listino presente. Clicca su "Nuovo listino" per iniziare.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {priceLists.map((list, index) => (
            <PriceListCard
              key={index}
              list={list}
              index={index}
              handlers={handlers}
              totalLists={priceLists.length}
              currencySymbol={currencySymbol}
            />
          ))}
        </div>
      )}
    </Col>
  );
}