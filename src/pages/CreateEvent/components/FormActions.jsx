import { Button } from "react-bootstrap";

/**
 * Componente per i pulsanti di azione del form
 */
export function FormActions({ onSubmit, onCancel }) {
  return (
    <div className="d-flex justify-content-between mt-sm">
      <Button onClick={onSubmit} variant="success">
        Salva dati
      </Button>
      <Button onClick={onCancel} variant="secondary">
        Vai all'elenco
      </Button>
    </div>
  );
}