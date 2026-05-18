import { ChangeEvent } from "react";
import {
  SlidersHorizontal,
  CalendarDays,
  Search,
  ArrowUpDown,
  RotateCcw,
  Filter,
} from "lucide-react";

type Filters = {
  dateFrom: string;
  dateTo: string;
  eventName: string;
  sortOrder: "ASC" | "DESC";
};

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onApply: () => void;
  onReset: () => void;
};

const inputClass =
  "w-full border-2 border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

export default function EventFilters({
  filters,
  onChange,
  onApply,
  onReset,
}: Props) {
  // Factory di handler: evita di ripetere la stessa logica per ogni campo del form.
  // onChange notifica il parent con i filtri aggiornati, ma non triggera la fetch
  // (quella è responsabilità di onApply).
  const set =
    (field: keyof Filters) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...filters, [field]: e.target.value });

  return (
    <div className="shadow-sm rounded-lg bg-white mb-6">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="bg-cyan-500/10 rounded-xl p-3 mr-3">
            <SlidersHorizontal size={20} className="text-blue-600" />
          </div>
          <div>
            <h5 className="mb-0.5 font-bold text-base">Filtra eventi</h5>
            <p className="text-gray-500 mb-0 text-xs">
              Cerca e ordina l'elenco degli eventi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold text-gray-600 text-xs mb-1.5">
              <CalendarDays size={14} className="inline mr-2" />
              Data da
            </label>
            <input
              title="Data da"
              type="date"
              value={filters.dateFrom}
              onChange={set("dateFrom")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-600 text-xs mb-1.5">
              <CalendarDays size={14} className="inline mr-2" />
              Data a
            </label>
            <input
              title="data a"
              type="date"
              value={filters.dateTo}
              onChange={set("dateTo")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-600 text-xs mb-1.5">
              <Search size={14} className="inline mr-2" />
              Nome evento
            </label>
            <input
              type="text"
              placeholder="Cerca..."
              value={filters.eventName}
              onChange={set("eventName")}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-600 text-xs mb-1.5">
              <ArrowUpDown size={14} className="inline mr-2" />
              Ordinamento
            </label>
            <select
              title="seleziona ordinamento"
              value={filters.sortOrder}
              onChange={set("sortOrder")}
              className={`${inputClass} bg-white`}
            >
              <option value="DESC">Più recenti prima</option>
              <option value="ASC">Meno recenti prima</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Filter size={14} />
            Applica filtri
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 border-2 border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <RotateCcw size={14} />
            Reimposta
          </button>
        </div>
      </div>
    </div>
  );
}
