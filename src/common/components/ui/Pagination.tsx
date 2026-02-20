import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage <= 1}
        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md
                   hover:bg-gray-100 transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={14} />
        Precedente
      </button>

      <span className="px-3 py-1.5 text-sm text-gray-700">
        Pagina <span className="font-semibold">{currentPage}</span> di{" "}
        <span className="font-semibold">{totalPages}</span>
      </span>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage >= totalPages}
        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md
                   hover:bg-gray-100 transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Successivo
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
