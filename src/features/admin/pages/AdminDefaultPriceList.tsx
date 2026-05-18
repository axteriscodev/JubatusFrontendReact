import { useState, useEffect, useMemo } from "react";
import { Euro, Save, Info, Loader2, CirclePlus, Inbox } from "lucide-react";
import { apiRequest } from "@common/services/api-services";
import { API } from "@common/services/api-endpoints";
import { successToast, errorToast } from "@common/utils/toast-manager";
import { usePriceLists } from "./CreateEvent/hooks/usePriceLists";
import { useListItemLabels } from "./CreateEvent/hooks/useListItemLabels";
import {
  createEmptyPriceItem,
  validatePriceLists,
} from "./CreateEvent/utils/eventFormHelpers";
import { PriceListCard } from "./CreateEvent/components/PriceListSection/PriceListCard";
import type { PriceList } from "@/types/cart";

const PLACEHOLDER_DATE_START = "1970-01-01";
const PLACEHOLDER_DATE_EXPIRY = "9999-12-31";

function createTemplateDefaultList(): PriceList {
  return {
    dateStart: PLACEHOLDER_DATE_START,
    dateExpiry: PLACEHOLDER_DATE_EXPIRY,
    items: [createEmptyPriceItem()],
  };
}

export default function AdminDefaultPriceList() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [creating, setCreating] = useState(false);
  const [fetchedList, setFetchedList] = useState<PriceList | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const { labelList } = useListItemLabels();

  useEffect(() => {
    const fetchDefault = async () => {
      try {
        const response = await apiRequest({
          api: API.EVENT_LIST_DEFAULT,
          method: "GET",
          needAuth: true,
        });

        if (!response.ok) {
          throw new Error("Errore nel caricamento del listino template");
        }

        const data = await response.json();
        const list: PriceList | null = data.data ?? null;
        setFetchedList(list);
        setIsNew(list === null);
      } catch {
        errorToast("Errore nel caricamento del listino template");
      } finally {
        setLoading(false);
      }
    };

    fetchDefault();
  }, []);

  const initialLists = useMemo<PriceList[]>(
    () => [fetchedList ?? createTemplateDefaultList()],
    [fetchedList],
  );

  const { priceLists, ...handlers } = usePriceLists(initialLists);

  const handleSave = async () => {
    const validationErrors = validatePriceLists(
      priceLists.map((l) => ({
        ...l,
        dateStart: PLACEHOLDER_DATE_START,
        dateExpiry: PLACEHOLDER_DATE_EXPIRY,
      })),
    );

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      validationErrors.forEach((msg) => errorToast(msg));
      return;
    }

    setErrors([]);
    setSaving(true);

    try {
      const payload = {
        list: [
          {
            ...priceLists[0],
            dateStart: PLACEHOLDER_DATE_START,
            dateExpiry: PLACEHOLDER_DATE_EXPIRY,
            active: true,
          },
        ],
      };

      const response = await apiRequest({
        api: API.EVENT_LIST_DEFAULT,
        method: isNew ? "POST" : "PUT",
        needAuth: true,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Errore nel salvataggio");
      }

      const getResponse = await apiRequest({
        api: API.EVENT_LIST_DEFAULT,
        method: "GET",
        needAuth: true,
      });

      if (!getResponse.ok) throw new Error("Errore nel caricamento post-salvataggio");

      const getData = await getResponse.json();
      const refreshedList: PriceList | null = getData.data ?? null;
      setFetchedList(refreshedList);
      setIsNew(refreshedList === null);
      setCreating(false);
      successToast("Listino template salvato con successo!");
    } catch {
      errorToast("Si è verificato un errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  };

  const showForm = !isNew || creating;

  return (
    <div className="p-6 mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">
          <Euro size={22} className="inline mr-2" />
          Listino prezzi template
        </h2>
        <p className="text-gray-500 text-sm">
          Configura i pacchetti e i prezzi di default. Questo listino verrà
          usato come punto di partenza al momento della creazione di un nuovo
          evento.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 size={32} className="animate-spin mr-3" />
          <span>Caricamento listino template...</span>
        </div>
      ) : isNew && !creating ? (
        <div className="text-center py-16 bg-gray-100 rounded-xl">
          <Inbox size={48} className="text-gray-400 mx-auto" />
          <p className="text-gray-500 mt-3 mb-4">
            Nessun listino template configurato.
          </p>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded-md shadow-sm
                       hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
          >
            <CirclePlus size={16} />
            Crea listino template
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
            <Info size={16} className="shrink-0 mt-0.5" />
            <span>
              Le date di validità non sono rilevanti per il listino template e
              vengono gestite automaticamente dal sistema.
            </span>
          </div>

          {showForm && (
            <PriceListCard
              list={priceLists[0]}
              index={0}
              handlers={handlers}
              totalLists={1}
              labelList={labelList}
              currencySymbol="€"
              hideDates
            />
          )}

          {errors.length > 0 && (
            <ul className="mt-4 text-sm text-red-600 list-disc list-inside">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-md shadow-sm
                         hover:bg-blue-700 transition-colors font-medium
                         disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Salva listino template
            </button>
          </div>
        </>
      )}
    </div>
  );
}
