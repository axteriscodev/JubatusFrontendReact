import { PriceListItem } from './PriceListItem';
import { Receipt, Trash2, CalendarRange, CalendarPlus, Calendar, CalendarX, Package, CirclePlus } from 'lucide-react';
import type { PriceList, PriceItem } from '@/types/cart';
import type { ListItemLabel } from '../../hooks/useListItemLabels';

// Accetta anche string perché i valori arrivano da input HTML (e.target.value)
type PriceItemInputValue = PriceItem[keyof PriceItem] | string;

interface PriceListHandlers {
  removeList: (index: number) => void;
  updateListDate: (formIndex: number, field: 'dateStart' | 'dateExpiry', value: string) => void;
  addItemToList: (formIndex: number) => void;
  removeItemFromList: (formIndex: number, rowIndex: number) => void;
  updateItem: (formIndex: number, rowIndex: number, field: keyof PriceItem, value: PriceItemInputValue) => void;
  updateItemWithLanguage: (formIndex: number, rowIndex: number, field: keyof PriceItem, value: PriceItemInputValue) => void;
}

export interface PriceListCardProps {
  list: PriceList;
  index: number;
  handlers: PriceListHandlers;
  totalLists: number;
  labelList?: ListItemLabel[];
  currencySymbol?: string;
}

export function PriceListCard({
  list,
  index,
  handlers,
  totalLists,
  labelList = [],
  currencySymbol = '€',
}: PriceListCardProps) {
  return (
    <div className="border-0 shadow-sm rounded-lg bg-white">
      <div className="bg-white border-b px-4 py-3 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/10 rounded-xl p-2">
              <Receipt size={20} className="text-blue-600" />
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
            <Trash2 size={14} className="inline mr-2" />
            Elimina listino
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-gray-100 rounded-xl p-3 mb-4">
          <h6 className="font-semibold mb-3 text-gray-600">
            <CalendarRange size={16} className="inline mr-2" />
            Periodo di validità
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`dateStart-${index}`} className="block font-semibold text-gray-600 text-sm mb-2">
                <CalendarPlus size={14} className="inline mr-2" />Data Inizio
              </label>
              <div className="flex shadow-sm">
                <span className="inline-flex items-center px-3 bg-white border-2 border-r-0 border-gray-300 rounded-l-md">
                  <Calendar size={16} className="text-green-500" />
                </span>
                <input
                  type="date"
                  id={`dateStart-${index}`}
                  value={list.dateStart}
                  onChange={(e) => handlers.updateListDate(index, 'dateStart', e.target.value)}
                  className="flex-1 border-2 border-l-0 border-gray-300 rounded-r-md px-3 py-2
                             text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor={`dateExpiry-${index}`} className="block font-semibold text-gray-600 text-sm mb-2">
                <CalendarX size={14} className="inline mr-2" />Data Fine
              </label>
              <div className="flex shadow-sm">
                <span className="inline-flex items-center px-3 bg-white border-2 border-r-0 border-gray-300 rounded-l-md">
                  <Calendar size={16} className="text-red-500" />
                </span>
                <input
                  type="date"
                  id={`dateExpiry-${index}`}
                  value={list.dateExpiry}
                  onChange={(e) => handlers.updateListDate(index, 'dateExpiry', e.target.value)}
                  className="flex-1 border-2 border-l-0 border-gray-300 rounded-r-md px-3 py-2
                             text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h6 className="font-semibold text-gray-600">
            <Package size={16} className="inline mr-2" />
            Pacchetti disponibili
          </h6>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
            {list.items.length}
          </span>
        </div>

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
          <CirclePlus size={16} className="inline mr-2" />
          Aggiungi pacchetto
        </button>
      </div>
    </div>
  );
}
