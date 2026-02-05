import { PriceListItem } from "./PriceListItem";

/**
 * Componente per una singola card listino - VERSIONE TAILWIND
 */
export function PriceListCard({ list, index, handlers, totalLists, labelList = [], currencySymbol = "€" }) {
  return (
    <div className="border-0 shadow-sm rounded-lg bg-white">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 rounded-xl p-2">
              <i className="bi bi-receipt text-blue-600 text-xl"></i>
            </div>
            <div>
              <h5 className="mb-0 font-bold text-lg">Listino #{index + 1}</h5>
              <small className="text-gray-500">
                {list.items.length} {list.items.length === 1 ? 'pacchetto' : 'pacchetti'}
              </small>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handlers.removeList(index)}
            disabled={totalLists === 1}
            className="px-3 py-1.5 text-sm border border-red-500 text-red-500 rounded-md shadow-sm 
                       hover:bg-red-500 hover:text-white transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="bi bi-trash mr-2"></i>
            Elimina listino
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Date del listino */}
        <div className="bg-gray-100 rounded-xl p-3 mb-4">
          <h6 className="font-semibold mb-3 text-gray-600">
            <i className="bi bi-calendar-range mr-2"></i>
            Periodo di validità
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Data Inizio */}
            <div>
              <label 
                htmlFor={`dateStart-${index}`}
                className="block font-semibold text-gray-600 text-sm mb-2"
              >
                <i className="bi bi-calendar-plus mr-2"></i>Data Inizio
              </label>
              <div className="flex shadow-sm">
                <span className="inline-flex items-center px-3 bg-white border-2 border-r-0 border-gray-300 rounded-l-md">
                  <i className="bi bi-calendar3 text-green-500"></i>
                </span>
                <input
                  type="date"
                  id={`dateStart-${index}`}
                  value={list.dateStart}
                  onChange={(e) =>
                    handlers.updateListDate(index, "dateStart", e.target.value)
                  }
                  className="flex-1 border-2 border-l-0 border-gray-300 rounded-r-md px-3 py-2 
                             text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Data Fine */}
            <div>
              <label 
                htmlFor={`dateExpiry-${index}`}
                className="block font-semibold text-gray-600 text-sm mb-2"
              >
                <i className="bi bi-calendar-x mr-2"></i>Data Fine
              </label>
              <div className="flex shadow-sm">
                <span className="inline-flex items-center px-3 bg-white border-2 border-r-0 border-gray-300 rounded-l-md">
                  <i className="bi bi-calendar3 text-red-500"></i>
                </span>
                <input
                  type="date"
                  id={`dateExpiry-${index}`}
                  value={list.dateExpiry}
                  onChange={(e) =>
                    handlers.updateListDate(index, "dateExpiry", e.target.value)
                  }
                  className="flex-1 border-2 border-l-0 border-gray-300 rounded-r-md px-3 py-2 
                             text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Titolo sezione pacchetti */}
        <div className="flex items-center justify-between mb-3">
          <h6 className="font-semibold text-gray-600">
            <i className="bi bi-box-seam mr-2"></i>
            Pacchetti disponibili
          </h6>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
            {list.items.length}
          </span>
        </div>

        {/* Items del listino */}
        <div className="flex flex-col gap-3">
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
              labelList={labelList}
              currencySymbol={currencySymbol}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => handlers.addItemToList(index)}
          className="mt-3 w-full py-2 px-4 border-2 border-dashed border-blue-500 text-blue-600 
                     rounded-md shadow-sm hover:bg-blue-50 transition-colors font-medium"
        >
          <i className="bi bi-plus-circle mr-2"></i>
          Aggiungi pacchetto
        </button>
      </div>
    </div>
  );
}