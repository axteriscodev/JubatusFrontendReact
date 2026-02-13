import Button from "../../../shared/components/ui/Button";

/**
 * Componente per i pulsanti di azione del form
 */
export function FormActions({ onDelete, onCancel, readOnly }) {
  if (readOnly) {
    return (
      <div className="flex justify-end mt-10">
        <Button onClick={onCancel} variant="secondary">
          Vai all'elenco
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between mt-10">
      <Button onClick={onDelete} variant="danger">
        Elimina evento
      </Button>
      <Button onClick={onCancel} variant="secondary">
        Vai all'elenco
      </Button>
    </div>
  );
}
