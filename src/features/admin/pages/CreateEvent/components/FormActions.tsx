import { Trash2, LayoutList } from 'lucide-react';

export interface FormActionsProps {
  onDelete: () => void;
  onCancel: () => void;
  readOnly: boolean;
}

export function FormActions({ onDelete, onCancel, readOnly }: FormActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {!readOnly && (
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} />
          Elimina evento
        </button>
      )}
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <LayoutList size={14} />
        Vai all'elenco
      </button>
    </div>
  );
}
