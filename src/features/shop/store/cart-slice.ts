// Slice Redux del carrello acquisti.
// Gestisce selezione prodotti, calcolo prezzi (pacchetti), stato preorder e items acquistati.
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { calculatePrice } from "@common/utils/best-price-calculator";
import type { CartState, CartItem, CartProduct, PreorderPack, PriceItem } from "@/types/cart";

const initialState: CartState = {
  id: 0,
  userEmail: "",
  fullName: "",
  userId: 0,
  eventId: 0,
  searchId: 0,
  products: [],
  items: [],
  prices: [],
  purchased: [],
  totalQuantity: 0,
  totalPrice: 0,
  usedPriceItems: [],
  selectedPreorder: null,
  alertPack: false,
  hasPhoto: false,
  hasVideo: false,
  hasClip: false,
  allPhotos: false,
  allClips: false,
  video: false,
  previousAllPhotosPurchase: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateOrderId(state, action: PayloadAction<number>) {
      state.id = action.payload;
    },
    updateUserId(state, action: PayloadAction<number>) {
      state.userId = action.payload;
    },
    updateUserEmail(state, action: PayloadAction<string>) {
      state.userEmail = action.payload;
    },
    updateUserName(state, action: PayloadAction<string>) {
      state.fullName = action.payload;
    },
    updateEventId(state, action: PayloadAction<number>) {
      state.eventId = action.payload;
    },
    updateSearchId(state, action: PayloadAction<number>) {
      state.searchId = action.payload;
    },
    updateProducts(state, action: PayloadAction<CartProduct[]>) {
      // Normalizza il campo "purchased": supporta sia la proprietà diretta che la variante legacy "isPurchased"
      state.products = action.payload.map((p) => {
        const raw = p as CartProduct & { isPurchased?: boolean };
        return { ...p, purchased: p.purchased ?? raw.isPurchased };
      });
    },
    updatePriceList(state, action: PayloadAction<PriceItem[]>) {
      state.prices = [...action.payload];
    },
    updatePreviousAllPhotosPurchase(state, action: PayloadAction<boolean>) {
      state.previousAllPhotosPurchase = action.payload;
    },
    updateHasPhoto(state, action: PayloadAction<boolean>) {
      state.hasPhoto = action.payload;
    },
    updateHasVideo(state, action: PayloadAction<boolean>) {
      state.hasVideo = action.payload;
    },
    updateHasClip(state, action: PayloadAction<boolean>) {
      state.hasClip = action.payload;
    },

    addItemToCart(state, action: PayloadAction<string>) {
      const product = state.products.find(
        (item) => item.keyOriginal === action.payload,
      );
      if (!product || product.purchased) return;

      state.totalQuantity++;
      state.items.push({
        keyPreview: product.keyPreview,
        keyOriginal: product.keyOriginal,
        keyThumbnail: product.keyThumbnail,
        keyCover: product.keyCover ?? "",
        fileTypeId: product.fileTypeId ?? 1,
      });

      performRecalculate(state);
    },

    removeItemFromCart(state, action: PayloadAction<string>) {
      const itemToRemove = action.payload;
      state.totalQuantity = Math.max(0, state.totalQuantity - 1);
      state.items = state.items.filter(
        (item) => item.keyOriginal !== itemToRemove,
      );

      performRecalculate(state);
    },

    addAllItems(state) {
      const itemToBuy: CartItem[] = state.products
        .filter((p) => p.purchased !== true)
        .map((p) => ({
          keyPreview: p.keyPreview,
          keyOriginal: p.keyOriginal,
          keyThumbnail: p.keyThumbnail,
          keyCover: p.keyCover ?? "",
          fileTypeId: p.fileTypeId ?? 1,
        }));

      state.totalQuantity = itemToBuy.length;
      state.items = itemToBuy;

      performRecalculate(state);
      if (state.items.some((item) => item.fileTypeId === 1)) {
        state.allPhotos = true;
      }
    },

    selectPreorder(state, action: PayloadAction<PreorderPack>) {
      state.selectedPreorder = action.payload;
      // quantityPhoto/Clip === -1 significa "tutti" (pacchetto illimitato)
      state.allPhotos = action.payload.quantityPhoto === -1;
      state.allClips = action.payload.quantityClip === -1;
      state.video = action.payload.quantityVideo !== 0;
      state.hasClip = action.payload.quantityClip !== 0;

      // Applica lo sconto percentuale se presente, arrotondando al centesimo superiore
      if (action.payload.discount) {
        const discountPrice =
          action.payload.price * (1 - action.payload.discount / 100);
        state.totalPrice = Math.ceil(discountPrice * 100) / 100;
      } else {
        state.totalPrice = action.payload.price;
      }
    },

    unSelectPreorder(state) {
      state.selectedPreorder = null;
      performRecalculate(state);
    },

    removeAllItems(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.usedPriceItems = [];
      state.allPhotos = false;
      state.allClips = false;
      state.video = false;
      state.hasPhoto = false;
      state.hasVideo = false;
      state.hasClip = false;
      state.selectedPreorder = null;
    },

    resetStore(state) {
      // Preserva l'eventId per non perdere il contesto dell'evento durante il reset
      const eventId = state.eventId;
      Object.assign(state, initialState);
      state.eventId = eventId;
    },

    setPurchasedItems(state, action: PayloadAction<CartProduct[]>) {
      state.purchased = action.payload;
    },

    updatePurchasedItem(state, action: PayloadAction<Partial<CartProduct> & { keyOriginal: string }>) {
      const updated = action.payload;
      const index = state.purchased.findIndex(
        (img) => img.keyOriginal === updated.keyOriginal,
      );
      if (index !== -1) {
        state.purchased[index] = { ...state.purchased[index], ...updated };
      }
    },
  },
});

/**
 * Calcola il prezzo ottimale per gli item nel carrello applicando la logica dei pacchetti.
 * Restituisce il prezzo finale e i PriceItem utilizzati (per costruire l'ordine).
 *
 * @param previousAllPhotosPurchase - true se l'utente ha già acquistato il pacchetto foto completo:
 *   in quel caso si calcola il costo di upgrade al pacchetto completo invece del prezzo pieno del video.
 */
function packageCalculator(
  items: CartItem[],
  prices: PriceItem[],
  previousAllPhotosPurchase = false,
): { price: number; usedPriceItems: PriceItem[] } {
  const photosCount = items.filter((item) => item.fileTypeId === 1).length;
  const videosCount = items.filter((item) => item.fileTypeId === 2).length;
  const clipsCount = items.filter((item) => item.fileTypeId === 3).length;

  const formattedPrices = prices.map((p) => ({
    quantityPhoto: p.quantityPhoto as number,
    quantityVideo: p.quantityVideo as number,
    quantityClip: (p.quantityClip as number) ?? 0,
    price: p.price as number,
  }));

  const { price: basePrice, usedPackages } = calculatePrice(
    formattedPrices,
    photosCount,
    videosCount,
    clipsCount,
  );

  const usedPriceItems: PriceItem[] = usedPackages.map((pkg) =>
    prices.find(
      (p) =>
        (p.price as number) === pkg.price &&
        (p.quantityPhoto as number) === pkg.quantityPhoto &&
        (p.quantityVideo as number) === pkg.quantityVideo &&
        ((p.quantityClip as number) ?? 0) === pkg.quantityClip,
    )!,
  );

  let finalPrice = basePrice;

  // Logica di upgrade per utenti che hanno già il pacchetto foto completo:
  // se stanno aggiungendo solo video/clip, conviene calcolare la differenza tra
  // il pacchetto completo (foto+video) e il pacchetto solo foto anziché il prezzo pieno del video.
  if (
    previousAllPhotosPurchase &&
    photosCount === 0 &&
    (videosCount > 0 || clipsCount > 0)
  ) {
    const photoPackPrice =
      prices.find((p) => p.quantityPhoto === -1 && p.quantityVideo === 0)
        ?.price as number ?? 0;
    const completePackPrice =
      prices.find((p) => p.quantityPhoto === -1 && (p.quantityVideo === 1 || p.quantityVideo === -1))
        ?.price as number ?? 0;

    if (photoPackPrice > 0 && completePackPrice > 0) {
      const upgradeDiff = completePackPrice - photoPackPrice;
      const singleVideoPrice =
        prices.find(
          (item) => item.quantityPhoto === 0 && item.quantityVideo === 1,
        )?.price as number ?? 0;

      // Applica il prezzo di upgrade solo se è più conveniente del prezzo standard
      if (videosCount >= 1) {
        const priceWithUpgrade = finalPrice - singleVideoPrice + upgradeDiff;
        finalPrice = Math.min(finalPrice, priceWithUpgrade);
      }
    }
  }

  return { price: finalPrice, usedPriceItems };
}

/**
 * Ricalcola il totale e i flag derivati (allPhotos, allClips, alertPack, hasPhoto/Video/Clip)
 * ogni volta che il carrello viene modificato (aggiunta/rimozione item).
 * Viene chiamata internamente dai reducer che modificano gli item.
 */
const performRecalculate = (state: CartState): void => {
  const { price: totalPrice, usedPriceItems } = packageCalculator(
    state.items,
    state.prices,
    state.previousAllPhotosPurchase,
  );

  const photoPrice =
    (state.prices.find((item) => item.quantityPhoto === 1)?.price as number) ?? 0;
  const photoPackPrice =
    (state.prices.find(
      (item) =>
        item.quantityPhoto === -1 &&
        item.quantityVideo === 0 &&
        (item.quantityClip === 0 || item.quantityClip === -1),
    )?.price as number) ?? 0;
  const completePackPrice =
    (state.prices.find(
      (item) => item.quantityPhoto === -1 && (item.quantityVideo === 1 || item.quantityVideo === -1),
    )?.price as number) ?? 0;
  const clipPackPrice =
    (state.prices.find(
      (item) =>
        item.quantityClip === -1 &&
        item.quantityPhoto === 0 &&
        item.quantityVideo === 0,
    )?.price as number) ?? 0;

  state.hasPhoto = state.items.some((item) => item.fileTypeId === 1);
  state.hasVideo = state.items.some((item) => item.fileTypeId === 2);
  state.hasClip = state.items.some((item) => item.fileTypeId === 3);
  state.video = state.hasVideo;

  // Mostra il banner "converti in pacchetto" quando aggiungendo una singola foto
  // si supererebbe il prezzo del pacchetto foto completo, ma il totale attuale è ancora sotto
  state.alertPack =
    !state.previousAllPhotosPurchase &&
    totalPrice + photoPrice >= photoPackPrice &&
    totalPrice < photoPackPrice;

  // allPhotos indica che il totale corrisponde al pacchetto "tutte le foto"
  // (o al pacchetto completo foto+video se c'è un video nel carrello)
  if (state.hasVideo) {
    state.allPhotos = totalPrice >= completePackPrice && completePackPrice > 0;
  } else {
    state.allPhotos = totalPrice >= photoPackPrice && photoPackPrice > 0;
  }

  // allClips indica che il totale corrisponde al pacchetto "tutti i clip"
  state.allClips = totalPrice >= clipPackPrice && clipPackPrice > 0;

  state.totalPrice = totalPrice;
  state.usedPriceItems = usedPriceItems;
};

export const cartActions = cartSlice.actions;
export default cartSlice;
