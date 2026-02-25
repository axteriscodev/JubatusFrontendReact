import type { PriceItem } from "@/types/cart";

function getCheapestFullPack(prices: PriceItem[], type: "photo" | "video"): PriceItem | null {
  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return null;
  }

  let fullPackPrices: PriceItem[];

  if (type === "photo") {
    fullPackPrices = prices.filter((price) => price.quantityPhoto === -1);
  } else {
    fullPackPrices = prices.filter((price) => price.quantityVideo === -1);
  }

  if (fullPackPrices.length === 0) {
    return null;
  }

  let cheapestPack = fullPackPrices[0];
  let cheapestPrice = cheapestPack.price as number;

  for (let i = 1; i < fullPackPrices.length; i++) {
    const itemPrice = fullPackPrices[i].price as number;
    if (itemPrice < cheapestPrice) {
      cheapestPrice = itemPrice;
      cheapestPack = fullPackPrices[i];
    }
  }

  return cheapestPack;
}

export function isPhotoFullPackEligible(actualPrice: number, prices: PriceItem[]): boolean {
  const fullPackPrice = getCheapestFullPack(prices, "photo");
  if (!fullPackPrice) return false;
  return actualPrice >= (fullPackPrice.price as number);
}

export function isVideoFullPackEligible(actualPrice: number, prices: PriceItem[]): boolean {
  const fullPackPrice = getCheapestFullPack(prices, "video");
  if (!fullPackPrice) return false;
  return actualPrice >= (fullPackPrice.price as number);
}

export function calculateDiscount(price: number, pricePack: Pick<PriceItem, "discount">): number | string {
  if (pricePack.discount === null || pricePack.discount === 0) {
    return price;
  } else {
    return (price - (price * (pricePack.discount as number)) / 100).toFixed(2);
  }
}
