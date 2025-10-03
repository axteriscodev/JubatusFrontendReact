import { useState } from "react";
import { createEmptyPriceList, createEmptyPriceItem } from "../utils/eventFormHelpers";

/**
 * Hook personalizzato per gestire i listini prezzi
 */
export function usePriceLists(initialLists) {
  const [priceLists, setPriceLists] = useState(initialLists);

  /**
   * Aggiunge un nuovo listino vuoto
   */
  const addList = () => {
    setPriceLists((prev) => [...prev, createEmptyPriceList()]);
  };

  /**
   * Rimuove un listino dato l'indice
   */
  const removeList = (priceListIndex) => {
    setPriceLists((prev) => prev.filter((_, i) => i !== priceListIndex));
  };

  /**
   * Aggiorna le date di un listino
   */
  const updateListDate = (formIndex, field, value) => {
    setPriceLists((prev) => {
      const updated = structuredClone(prev);
      updated[formIndex][field] = value;
      return updated;
    });
  };

  /**
   * Aggiunge un pacchetto (item) a un listino
   */
  const addItemToList = (formIndex) => {
    setPriceLists((prev) => {
      const updated = structuredClone(prev);
      updated[formIndex].items.push(createEmptyPriceItem());
      return updated;
    });
  };

  /**
   * Rimuove un pacchetto da un listino
   */
  const removeItemFromList = (formIndex, rowIndex) => {
    setPriceLists((prev) => {
      const updated = structuredClone(prev);
      updated[formIndex].items = updated[formIndex].items.filter(
        (_, i) => i !== rowIndex
      );
      return updated;
    });
  };

  /**
   * Aggiorna un campo di un pacchetto
   */
  const updateItem = (formIndex, rowIndex, field, value) => {
    setPriceLists((prev) => {
      const updated = structuredClone(prev);
      updated[formIndex].items[rowIndex][field] = value === "" ? "" : value;
      return updated;
    });
  };

  /**
   * Aggiorna un campo di un pacchetto e il corrispondente campo in itemsLanguages
   */
  const updateItemWithLanguage = (formIndex, rowIndex, field, value) => {
    setPriceLists((prev) => {
      const updated = structuredClone(prev);
      const item = updated[formIndex].items[rowIndex];
      item[field] = value === "" ? "" : value;
      item.itemsLanguages[0][field] = value === "" ? "" : value;
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