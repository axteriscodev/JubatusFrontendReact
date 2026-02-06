/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { calculatePrice } from "../../utils/best-price-calculator";

const initialState = {
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
  video: false,
  previousAllPhotosPurchase: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateOrderId(state, action) {
      state.id = action.payload;
    },
    updateUserId(state, action) {
      state.userId = action.payload;
    },
    updateUserEmail(state, action) {
      state.userEmail = action.payload;
    },
    updateUserName(state, action) {
      state.fullName = action.payload;
    },
    updateEventId(state, action) {
      state.eventId = action.payload;
    },
    updateSearchId(state, action) {
      state.searchId = action.payload;
    },
    updateProducts(state, action) {
      state.products = [...action.payload];
    },
    updatePriceList(state, action) {
      state.prices = [...action.payload];
    },
    updatePreviousAllPhotosPurchase(state, action) {
      state.previousAllPhotosPurchase = action.payload;
    },
    updateHasPhoto(state, action) {
      state.hasPhoto = action.payload;
    },
    updateHasVideo(state, action) {
      state.hasVideo = action.payload;
    },
    updateHasClip(state, action) {
      state.hasClip = action.payload;
    },

    addItemToCart(state, action) {
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

    removeItemFromCart(state, action) {
      const itemToRemove = action.payload;
      state.totalQuantity = Math.max(0, state.totalQuantity - 1);
      state.items = state.items.filter(
        (item) => item.keyOriginal !== itemToRemove,
      );

      performRecalculate(state);
    },

    addAllItems(state, action) {
      const itemToBuy = state.products
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

    selectPreorder(state, action) {
      state.selectedPreorder = action.payload;
      state.allPhotos = action.payload.quantityPhoto === -1;
      state.video = action.payload.quantityVideo !== 0;
      state.hasClip = action.payload.quantityClip !== 0;

      if (action.payload.discount) {
        const discountPrice =
          action.payload.price * (1 - action.payload.discount / 100);
        state.totalPrice = (Math.ceil(discountPrice * 100) / 100).toFixed(2);
      } else {
        state.totalPrice = action.payload.price;
      }
    },

    unSelectPreorder(state, action) {
      state.selectedPreorder = null;
      performRecalculate(state);
    },

    removeAllItems(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.allPhotos = false;
      state.video = false;
      state.hasClip = false;
      state.selectedPreorder = null;
    },

    resetStore(state) {
      const eventId = state.eventId;
      Object.assign(state, initialState);
      state.eventId = eventId;
    },

    updatePurchasedItem(state, action) {
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
 * Calcolatore logico
 */
function packageCalculator(items, prices, previousAllPhotosPurchase = false) {
  const photosCount = items.filter((item) => item.fileTypeId === 1).length;
  const videosCount = items.filter((item) => item.fileTypeId === 2).length;
  const clipsCount = items.filter((item) => item.fileTypeId === 3).length;

  const formattedPrices = prices.map((p) => ({
    ...p,
    quantityClip: p.quantityClip ?? 0,
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
        ?.price ?? 0;
    const completePackPrice =
      prices.find((p) => p.quantityPhoto === -1 && p.quantityVideo === 1)
        ?.price ?? 0;

    if (photoPackPrice > 0 && completePackPrice > 0) {
      const upgradeDiff = completePackPrice - photoPackPrice;
      const singleVideoPrice =
        prices.find(
          (item) => item.quantityPhoto === 0 && item.quantityVideo === 1,
        )?.price ?? 0;

      if (videosCount >= 1) {
        const priceWithUpgrade = basePrice - singleVideoPrice + upgradeDiff;
        basePrice = Math.min(basePrice, priceWithUpgrade);
      }
    }
  }

  return basePrice;
}

/**
 * Funzione di utilità esterna per ricalcolare i totali (evita ripetizioni)
 */
const performRecalculate = (state) => {
  let totalPrice = packageCalculator(
    state.items,
    state.prices,
    state.previousAllPhotosPurchase,
  );

  const photoPrice =
    state.prices.find((item) => item.quantityPhoto === 1)?.price ?? 0;
  const photoPackPrice =
    state.prices.find(
      (item) =>
        item.quantityPhoto === -1 &&
        item.quantityVideo === 0 &&
        (item.quantityClip === 0 || item.quantityClip === -1),
    )?.price ?? 0;
  const completePackPrice =
    state.prices.find(
      (item) => item.quantityPhoto === -1 && item.quantityVideo === 1,
    )?.price ?? 0;

  state.hasPhoto = state.items.some((item) => item.fileTypeId === 1);
  state.hasVideo = state.items.some((item) => item.fileTypeId === 2);
  state.hasClip = state.items.some((item) => item.fileTypeId === 3);
  state.video = state.hasVideo;

  // Alert Pack logic
  state.alertPack =
    totalPrice + photoPrice >= photoPackPrice && totalPrice < photoPackPrice;

  if (state.hasVideo) {
    state.allPhotos = totalPrice >= completePackPrice && completePackPrice > 0;
  } else {
    state.allPhotos = totalPrice >= photoPackPrice && photoPackPrice > 0;
  }

  state.totalPrice = totalPrice;
};

export const cartActions = cartSlice.actions;
export default cartSlice;
