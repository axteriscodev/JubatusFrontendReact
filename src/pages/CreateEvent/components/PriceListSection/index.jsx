import { useSelector } from "react-redux";
import { useListItemLabels } from "../../hooks/useListItemLabels";
import { PriceListCard } from "./PriceListCard";

/**
 * Componente principale per la sezione listini prezzi - VERSIONE TAILWIND
 */
export function PriceListSection({ priceLists, handlers }) {
  const { labelList } = useListItemLabels();
  const currencySymbol = useSelector((state) => state.competition.currencySymbol);

  return (
    <div className="col-span-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="mb-1 font-bold text-xl">
            <i className="bi bi-currency-euro mr-2"></i>
            Gestione Listini Prezzi
          </h4>
          <p className="text-gray-500 mb-0 text-sm">
            Configura i pacchetti e i prezzi disponibili per questo evento
          </p>
        </div>
        <button
          type="button"
          onClick={handlers.addList}
          className="min-w-35 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm
                     hover:bg-blue-700 transition-colors font-medium"
        >
          <i className="bi bi-plus-circle mr-2"></i>
          Nuovo listino
        </button>
      </div>

      {priceLists.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-xl">
          <i className="bi bi-inbox text-gray-400 text-5xl"></i>
          <p className="text-gray-500 mt-3 mb-0">
            Nessun listino presente. Clicca su "Nuovo listino" per iniziare.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {priceLists.map((list, index) => (
            <PriceListCard
              key={index}
              list={list}
              index={index}
              handlers={handlers}
              totalLists={priceLists.length}
              labelList={labelList}
              currencySymbol={currencySymbol}
            />
          ))}
        </div>
      )}
    </div>
  );
}