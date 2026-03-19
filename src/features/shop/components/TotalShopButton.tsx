import { type MouseEvent } from "react";
import { useAppSelector } from "@common/store/hooks";
import { useTranslations } from "@common/i18n/TranslationProvider";
import type { CartItem, CartProduct } from "@/types/cart";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { formatCurrencyPrice } from "@common/utils/data-formatter";

interface TotalShopButtonProps {
  onButtonClick?: (() => void) | null;
}

export default function TotalShopButton({
  onButtonClick = null,
}: TotalShopButtonProps) {
  const cart = useAppSelector((state) => state.cart);
  const totalPrice = useAppSelector((state) => state.cart.totalPrice);
  const purchasedKeys = new Set(
    cart.products.filter((p) => p.purchased).map((p) => p.keyOriginal),
  );
  const purchasableItemsCount = cart.items.filter(
    (i) => !purchasedKeys.has(i.keyOriginal),
  ).length;
  const allPurchased =
    cart.products.length > 0 && cart.products.every((p) => p.purchased);
  const usedPriceItems = useAppSelector((state) => state.cart.usedPriceItems);
  const eventPreset = useAppSelector((state) => state.competition);
  const { t } = useTranslations();
  const { createOrder, isLoading } = useCreateOrder();

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
        items.push(
          ...cart.products.filter((p) => p.fileTypeId === 1 && !p.purchased),
        );
        photosHandled = true;
      } else if (!photosHandled && qP > 0) {
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

    if (!photosHandled)
      items.push(...cart.items.filter((i) => i.fileTypeId === 1));
    if (!videosHandled)
      items.push(...cart.items.filter((i) => i.fileTypeId === 2));
    if (!clipsHandled)
      items.push(...cart.items.filter((i) => i.fileTypeId === 3));

    return items;
  }

  async function handleCheckout(event: MouseEvent) {
    event.preventDefault();
    await createOrder({ items: buildOrderItems() });
  }

  return (
    <button
      className="my-button w-3/4 fixed bottom-10 left-1/2 -translate-x-1/2 container z-50"
      disabled={isLoading || allPurchased}
      onClick={
        purchasableItemsCount === 0
          ? (onButtonClick ?? undefined)
          : handleCheckout
      }
    >
      {purchasableItemsCount === 0 ? (
        <>{t("CHECKOUT_SELECT")}</>
      ) : (
        `${t("CHECKOUT_TOTAL")}: ${formatCurrencyPrice(totalPrice.toFixed(2), eventPreset.currency, eventPreset.currencySymbol)}`
      )}
    </button>
  );
}
