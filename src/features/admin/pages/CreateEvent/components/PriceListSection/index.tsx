import { useSelector } from 'react-redux';
import { Euro, CirclePlus, Inbox } from 'lucide-react';
import { useListItemLabels } from '../../hooks/useListItemLabels';
import { PriceListCard } from './PriceListCard';
import type { RootState } from '@common/store/store';
import type { PriceList, PriceItem } from '@/types/cart';

interface PriceListHandlers {
  addList: () => void;
  removeList: (index: number) => void;
  updateListDate: (formIndex: number, field: 'dateStart' | 'dateExpiry', value: string) => void;
  addItemToList: (formIndex: number) => void;
  removeItemFromList: (formIndex: number, rowIndex: number) => void;
  updateItem: (formIndex: number, rowIndex: number, field: keyof PriceItem, value: PriceItem[keyof PriceItem]) => void;
  updateItemWithLanguage: (formIndex: number, rowIndex: number, field: keyof PriceItem, value: PriceItem[keyof PriceItem]) => void;
}

export interface PriceListSectionProps {
  priceLists: PriceList[];
  handlers: PriceListHandlers;
}

export function PriceListSection({ priceLists, handlers }: PriceListSectionProps) {
  const { labelList } = useListItemLabels();
  const currencySymbol = useSelector((state: RootState) => state.competition.currencySymbol);

  return (
    <div className="col-span-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="mb-1 font-bold text-xl">
            <Euro size={20} className="inline mr-2" />
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
          <CirclePlus size={16} className="inline mr-2" />
          Nuovo listino
        </button>
      </div>

      {priceLists.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-xl">
          <Inbox size={48} className="text-gray-400 mx-auto" />
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
