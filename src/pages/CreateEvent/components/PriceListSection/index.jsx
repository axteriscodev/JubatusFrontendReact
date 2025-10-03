import { Col, Button } from "react-bootstrap";
import { PriceListCard } from "./PriceListCard";

/**
 * Componente principale per la sezione listini prezzi
 */
export function PriceListSection({ priceLists, handlers }) {
  return (
    <Col xs={12} className="mt-4">
      <h3>Listini prezzi</h3>
      
      {priceLists.map((list, index) => (
        <PriceListCard
          key={index}
          list={list}
          index={index}
          handlers={handlers}
          totalLists={priceLists.length}
        />
      ))}

      <Button variant="primary" onClick={handlers.addList} className="me-2">
        Aggiungi listino
      </Button>
    </Col>
  );
}