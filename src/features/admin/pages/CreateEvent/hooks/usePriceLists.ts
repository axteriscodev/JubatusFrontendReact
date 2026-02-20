import { useState, useEffect } from 'react';
import { createEmptyPriceList, createEmptyPriceItem } from '../utils/eventFormHelpers';
import type { PriceList, PriceItem } from '@/types/cart';

interface UsePriceListsReturn {
  priceLists: PriceList[];
  addList: () => void;
  removeList: (priceListIndex: number) => void;
  updateListDate: (formIndex: number, field: 'dateStart' | 'dateExpiry', value: string) => void;
  addItemToList: (formIndex: number) => void;
  removeItemFromList: (formIndex: number, rowIndex: number) => void;
  updateItem: (formIndex: number, rowIndex: number, field: keyof PriceItem, value: PriceItem[keyof PriceItem]) => void;
  updateItemWithLanguage: (formIndex: number, rowIndex: number, field: keyof PriceItem, value: PriceItem[keyof PriceItem]) => void;
}

export function usePriceLists(initialLists: PriceList[]): UsePriceListsReturn {
  const [priceLists, setPriceLists] = useState<PriceList[]>(initialLists);

  useEffect(() => {
    if (initialLists) {
      setPriceLists(initialLists);
    }
  }, [initialLists]);

  const addList = () => {
    setPriceLists((prev) => [...prev, createEmptyPriceList()]);
  };

  const removeList = (priceListIndex: number) => {
    setPriceLists((prev) => prev.filter((_, i) => i !== priceListIndex));
  };

  const updateListDate = (formIndex: number, field: 'dateStart' | 'dateExpiry', value: string) => {
    setPriceLists((prev) => {
      const updated = structuredClone(prev);
      updated[formIndex][field] = value;
      return updated;
    });
  };

  const addItemToList = (formIndex: number) => {
    setPriceLists((prev) => {
      const updated = structuredClone(prev);
      updated[formIndex].items.push(createEmptyPriceItem());
      return updated;
    });
  };

  const removeItemFromList = (formIndex: number, rowIndex: number) => {
    setPriceLists((prev) => {
      const updated = structuredClone(prev);
      updated[formIndex].items = updated[formIndex].items.filter((_, i) => i !== rowIndex);
      return updated;
    });
  };

  const updateItem = (formIndex: number, rowIndex: number, field: keyof PriceItem, value: PriceItem[keyof PriceItem]) => {
    setPriceLists((prev) => {
      const updated = structuredClone(prev);
      updated[formIndex].items[rowIndex][field] = value === '' ? '' : value as never;
      return updated;
    });
  };

  const updateItemWithLanguage = (formIndex: number, rowIndex: number, field: keyof PriceItem, value: PriceItem[keyof PriceItem]) => {
    setPriceLists((prev) => {
      const updated = structuredClone(prev) as (PriceList & { itemsLanguages?: Array<Record<string, unknown>> })[];
      const item = updated[formIndex].items[rowIndex] as PriceItem & { itemsLanguages?: Array<Record<string, unknown>> };
      (item as Record<string, unknown>)[field] = value === '' ? '' : value;
      if (item.itemsLanguages?.[0]) {
        item.itemsLanguages[0][field] = value === '' ? '' : value;
      }
      return updated;
    });
  };

  return {
    priceLists,
    addList,
    removeList,
    updateListDate,
    addItemToList,
    removeItemFromList,
    updateItem,
    updateItemWithLanguage,
  };
}
