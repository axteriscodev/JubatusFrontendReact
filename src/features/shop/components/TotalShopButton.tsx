import { type MouseEvent } from "react";
import { CheckSquare, Square } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@common/store/hooks";
import { useTranslations } from "@common/i18n/TranslationProvider";
import type { CartItem, CartProduct, PriceItem } from "@/types/cart";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { formatCurrencyPrice } from "@common/utils/data-formatter";
import { cartActions } from "../store/cart-slice";

interface TotalShopButtonProps {
  videoPreorderPkg?: PriceItem | null;
}

export default function TotalShopButton({
  videoPreorderPkg = null,
}: TotalShopButtonProps) {
  const cart = useAppSelector((state) => state.cart);
  const totalPrice = useAppSelector((state) => state.cart.totalPrice);
  const selectedVideoPreorders = useAppSelector(
    (state) => state.cart.selectedVideoPreorders,
  );
  const purchasedKeys = new Set(
    cart.products.filter((p) => p.purchased).map((p) => p.keyOriginal),
  );
  const purchasableItemsCount = cart.items.filter(
    (i) => !purchasedKeys.has(i.keyOriginal),
  ).length;
  const hasVideoPreorder = selectedVideoPreorders.length > 0;
  const effectivePurchasableCount =
    purchasableItemsCount + selectedVideoPreorders.length;
  const allPurchased =
    cart.products.length > 0 &&
    cart.products.every((p) => p.purchased) &&
    !hasVideoPreorder;
  const usedPriceItems = useAppSelector((state) => state.cart.usedPriceItems);
  const eventPreset = useAppSelector((state) => state.competition);
  const dispatch = useAppDispatch();
  const { t } = useTranslations();
  const { createOrder, isLoading } = useCreateOrder();

  // Controlla se tutti i prodotti acquistabili sono già nel carrello
  const totalPurchasable = cart.products.filter((p) => !p.purchased).length;
  const videoPreorderSelected =
    !videoPreorderPkg ||
    selectedVideoPreorders.some((v) => v.id === videoPreorderPkg.id);
  const allSelected =
    purchasableItemsCount === totalPurchasable &&
    videoPreorderSelected &&
    (purchasableItemsCount > 0 || hasVideoPreorder);

  // Aggiunge tutti i prodotti non acquistati al carrello (e il video preorder se disponibile)
  function handleSelectAll() {
    dispatch(cartActions.addAllItems());
    if (videoPreorderPkg && !videoPreorderSelected) {
      dispatch(cartActions.selectVideoPreorder(videoPreorderPkg));
    }
  }

  // Svuota il carrello
  function handleDeselectAll() {
    dispatch(cartActions.removeAllItems());
  }

  /**
   * Costruisce la lista di item da inviare al backend per la creazione dell'ordine,
   * tenendo conto dei pacchetti calcolati (usedPriceItems).
   *
   * Se un pacchetto copre tutti i media di un tipo (quantity === -1), si inviano tutti
   * i prodotti non ancora acquistati di quel tipo (CartProduct), così il backend può
   * autorizzare l'accesso a contenuti non ancora disponibili (es. video in elaborazione).
   * Se il pacchetto copre un numero esatto di item (quantity > 0), si inviano gli item
   * selezionati nel carrello (CartItem).
   * Se nessun pacchetto è applicabile, si inviano direttamente gli item del carrello
   * escludendo quelli già acquistati.
   */
  function buildOrderItems(): (CartItem | CartProduct)[] {
    if (usedPriceItems.length === 0)
      return cart.items.filter((i) => !purchasedKeys.has(i.keyOriginal));

    const items: (CartItem | CartProduct)[] = [];
    let photosHandled = false,
      videosHandled = false,
      clipsHandled = false;

    for (const priceItem of usedPriceItems) {
      const qP = priceItem.quantityPhoto as number;
      const qV = priceItem.quantityVideo as number;
      const qC = priceItem.quantityClip as number;

      if (!photosHandled && qP === -1) {
        // Pacchetto "tutte le foto": includi tutti i prodotti foto non acquistati
        items.push(
          ...cart.products.filter((p) => p.fileTypeId === 1 && !p.purchased),
        );
        photosHandled = true;
      } else if (!photosHandled && qP > 0) {
        // Numero fisso di foto: includi solo quelle selezionate nel carrello
        items.push(...cart.items.filter((i) => i.fileTypeId === 1));
        photosHandled = true;
      }

      if (!videosHandled && qV === -1) {
        items.push(
          ...cart.products.filter((p) => p.fileTypeId === 2 && !p.purchased),
        );
        videosHandled = true;
      } else if (!videosHandled && qV > 0) {
        items.push(...cart.items.filter((i) => i.fileTypeId === 2));
        videosHandled = true;
      }

      if (!clipsHandled && qC === -1) {
        items.push(
          ...cart.products.filter((p) => p.fileTypeId === 3 && !p.purchased),
        );
        clipsHandled = true;
      } else if (!clipsHandled && qC > 0) {
        items.push(...cart.items.filter((i) => i.fileTypeId === 3));
        clipsHandled = true;
      }
    }

    // Fallback per i tipi non coperti da nessun pacchetto
    if (!photosHandled)
      items.push(...cart.items.filter((i) => i.fileTypeId === 1));
    if (!videosHandled)
      items.push(...cart.items.filter((i) => i.fileTypeId === 2));
    if (!clipsHandled)
      items.push(...cart.items.filter((i) => i.fileTypeId === 3));

    const virtualVideoItems: CartItem[] = selectedVideoPreorders.map((_, i) => ({
      keyPreview: "", keyOriginal: `__video_preorder_${i}__`, keyThumbnail: "", keyCover: "", fileTypeId: 2,
    }));

    return [...items, ...virtualVideoItems];
  }

  async function handleCheckout(event: MouseEvent) {
    event.preventDefault();
    await createOrder({ items: buildOrderItems() });
  }

  // Con almeno un item selezionato: layout split con bottone sx (select/deselect all) e dx (checkout)
  if (purchasableItemsCount > 0 || hasVideoPreorder) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <button
          type="button"
          className="my-button sm:w-1/3"
          disabled={isLoading || allPurchased}
          onClick={allSelected ? handleDeselectAll : handleSelectAll}
        >
          <span className="flex items-center justify-center gap-2">
            {allSelected ? <Square size={20} className="translate-y-0.5" /> : <CheckSquare size={20} className="translate-y-0.5" />}
            {allSelected ? t("CHECKOUT_DESELECT") : t("CHECKOUT_SELECT")}
          </span>
        </button>
        <button
          type="button"
          className="my-button flex-1"
          disabled={isLoading || allPurchased}
          onClick={handleCheckout}
        >
          {`${t("CHECKOUT_TOTAL")}: ${formatCurrencyPrice(totalPrice.toFixed(2), eventPreset.currency, eventPreset.currencySymbol)}`}
        </button>
      </div>
    );
  }

  // Nessun item selezionato: unico bottone per selezionare tutto
  return (
    <button
      type="button"
      className="my-button w-full"
      disabled={isLoading || allPurchased}
      onClick={
        effectivePurchasableCount === 0
          ? handleSelectAll
          : handleCheckout
      }
    >
      {effectivePurchasableCount === 0 ? (
        <span className="flex items-center justify-center gap-2">
          <CheckSquare size={20} className="translate-y-0.5" />
          {t("CHECKOUT_SELECT")}
        </span>
      ) : (
        `${t("CHECKOUT_TOTAL")}: ${formatCurrencyPrice(totalPrice.toFixed(2), eventPreset.currency, eventPreset.currencySymbol)}`
      )}
    </button>
  );
}
