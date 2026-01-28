import Button from "../../../shared/components/ui/Button";

/**
 * Componente per i pulsanti di azione del form
 */
export function FormActions({ onSubmit, onCancel }) {
  return (
    <div className="flex justify-between mt-10">
      <Button onClick={onSubmit} variant="success">
        Salva dati
      </Button>
      <Button onClick={onCancel} variant="secondary">
        Vai all'elenco
      </Button>
    </div>
  );
}
