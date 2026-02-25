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
      state.products = [...action.payload];
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
      if (!product) return;

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
      state.allPhotos = action.payload.quantityPhoto === -1;
      state.allClips = action.payload.quantityClip === -1;
      state.video = action.payload.quantityVideo !== 0;
      state.hasClip = action.payload.quantityClip !== 0;

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
      state.allPhotos = false;
      state.allClips = false;
      state.video = false;
      state.hasClip = false;
      state.selectedPreorder = null;
    },

    resetStore(state) {
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

function packageCalculator(
  items: CartItem[],
  prices: PriceItem[],
  previousAllPhotosPurchase = false,
): number {
  const photosCount = items.filter((item) => item.fileTypeId === 1).length;
  const videosCount = items.filter((item) => item.fileTypeId === 2).length;
  const clipsCount = items.filter((item) => item.fileTypeId === 3).length;

  const formattedPrices = prices.map((p) => ({
    quantityPhoto: p.quantityPhoto as number,
    quantityVideo: p.quantityVideo as number,
    quantityClip: (p.quantityClip as number) ?? 0,
    price: p.price as number,
  }));

  let basePrice = calculatePrice(
    formattedPrices,
    photosCount,
    videosCount,
    clipsCount,
  );

  if (
    previousAllPhotosPurchase &&
    photosCount === 0 &&
    (videosCount > 0 || clipsCount > 0)
  ) {
    const photoPackPrice =
      prices.find((p) => p.quantityPhoto === -1 && p.quantityVideo === 0)
        ?.price as number ?? 0;
    const completePackPrice =
      prices.find((p) => p.quantityPhoto === -1 && p.quantityVideo === 1)
        ?.price as number ?? 0;

    if (photoPackPrice > 0 && completePackPrice > 0) {
      const upgradeDiff = completePackPrice - photoPackPrice;
      const singleVideoPrice =
        prices.find(
          (item) => item.quantityPhoto === 0 && item.quantityVideo === 1,
        )?.price as number ?? 0;

      if (videosCount >= 1) {
        const priceWithUpgrade = basePrice - singleVideoPrice + upgradeDiff;
        basePrice = Math.min(basePrice, priceWithUpgrade);
      }
    }
  }

  return basePrice;
}

const performRecalculate = (state: CartState): void => {
  const totalPrice = packageCalculator(
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
      (item) => item.quantityPhoto === -1 && item.quantityVideo === 1,
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

  state.alertPack =
    totalPrice + photoPrice >= photoPackPrice && totalPrice < photoPackPrice;

  if (state.hasVideo) {
    state.allPhotos = totalPrice >= completePackPrice && completePackPrice > 0;
  } else {
    state.allPhotos = totalPrice >= photoPackPrice && photoPackPrice > 0;
  }

  state.allClips = totalPrice >= clipPackPrice && clipPackPrice > 0;

  state.totalPrice = totalPrice;
};

export const cartActions = cartSlice.actions;
export default cartSlice;
