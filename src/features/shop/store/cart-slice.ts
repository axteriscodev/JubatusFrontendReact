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
  allVideos: false,
  video: false,
  selectedVideoPreorders: [],
  previousAllPhotosPurchase: false,
  hasBibNumber: false,
  hasSelfie: false,
  parentSearchId: 0,
  isRefined: false,
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
    updateHasBibNumber(state, action: PayloadAction<boolean>) {
      state.hasBibNumber = action.payload;
    },
    updateHasSelfie(state, action: PayloadAction<boolean>) {
      state.hasSelfie = action.payload;
    },
    updateParentSearchId(state, action: PayloadAction<number>) {
      state.parentSearchId = action.payload;
    },
    updateIsRefined(state, action: PayloadAction<boolean>) {
      state.isRefined = action.payload;
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

    selectVideoPreorder(state, action: PayloadAction<PriceItem>) {
      const alreadySelected = state.selectedVideoPreorders.some((v) => v.id === action.payload.id);
      if (!alreadySelected) state.selectedVideoPreorders.push(action.payload);
      performRecalculate(state);
    },

    unSelectVideoPreorder(state, action: PayloadAction<PriceItem>) {
      state.selectedVideoPreorders = state.selectedVideoPreorders.filter((v) => v.id !== action.payload.id);
      performRecalculate(state);
    },

    removeAllItems(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.usedPriceItems = [];
      state.allPhotos = false;
      state.allClips = false;
      state.allVideos = false;
      state.video = false;
      state.hasPhoto = false;
      state.hasClip = false;
      state.selectedPreorder = null;
      state.selectedVideoPreorders = [];
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
    const completePackEntry =
      prices.find((p) => p.quantityPhoto === -1 && (p.quantityVideo === 1 || p.quantityVideo === -1));
    const completePackPrice = (completePackEntry?.price as number) ?? 0;
    const completePackVideoQty = (completePackEntry?.quantityVideo as number) ?? 0;

    if (photoPackPrice > 0 && completePackPrice > 0) {
      const upgradeDiff = completePackPrice - photoPackPrice;
      const singleVideoPrice =
        prices.find(
          (item) => item.quantityPhoto === 0 && item.quantityVideo === 1,
        )?.price as number ?? 0;

      if (videosCount >= 1) {
        if (completePackVideoQty === -1) {
          // Pacchetto copre TUTTI i video: paga solo la differenza di upgrade
          // indipendentemente da quanti video si aggiungono.
          finalPrice = Math.min(finalPrice, upgradeDiff);
        } else {
          // Pacchetto copre 1 solo video: paga la differenza per il primo video
          // + prezzo singolo per ogni video aggiuntivo.
          const extraVideos = videosCount - 1;
          finalPrice = Math.min(finalPrice, upgradeDiff + extraVideos * singleVideoPrice);
        }
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
  // Se il video preorder è selezionato, aggiunge un video virtuale agli item
  // in modo che il packageCalculator lo consideri nel calcolo dei pacchetti ottimali.
  const virtualVideoItems: CartItem[] = state.selectedVideoPreorders.map((_, i) => ({
    keyPreview: "", keyOriginal: `__video_preorder_${i}__`, keyThumbnail: "", keyCover: "", fileTypeId: 2,
  }));
  const itemsForCalc: CartItem[] = [...state.items, ...virtualVideoItems];

  const { price: totalPrice, usedPriceItems } = packageCalculator(
    itemsForCalc,
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

  const cartHasVideo = state.items.some((item) => item.fileTypeId === 2);
  state.hasPhoto = state.items.some((item) => item.fileTypeId === 1);
  // state.hasVideo non viene toccato: è il flag dal backend (updateHasVideo) che indica
  // se l'evento ha un video. Sovrascriverlo qui lo farebbe sparire al primo click su una foto.
  state.hasClip = state.items.some((item) => item.fileTypeId === 3);
  state.video = cartHasVideo || state.selectedVideoPreorders.length > 0;
  state.allVideos = usedPriceItems.some((p) => (p.quantityVideo as number) === -1);

  state.alertPack =
    !state.previousAllPhotosPurchase &&
    totalPrice + photoPrice >= photoPackPrice &&
    totalPrice < photoPackPrice;

  const hasVideoForPackCalc = cartHasVideo || state.selectedVideoPreorders.length > 0;
  if (hasVideoForPackCalc) {
    state.allPhotos = totalPrice >= completePackPrice && completePackPrice > 0;
  } else {
    state.allPhotos = totalPrice >= photoPackPrice && photoPackPrice > 0;
  }

  state.allClips = totalPrice >= clipPackPrice && clipPackPrice > 0;

  state.totalPrice = totalPrice;
  state.usedPriceItems = usedPriceItems;
};

export const cartActions = cartSlice.actions;
export default cartSlice;
