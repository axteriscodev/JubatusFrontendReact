import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import userSlice from "@features/user/store/user-slice";
import cartSlice from "@features/shop/store/cart-slice";
import personalSlice from "@features/user/store/personal-slice";
import competitionsSlice from "@features/user/store/competitions-slice";
import adminCompetitionsSlice from "@features/admin/store/admin-competitions-slice";
import adminReadersSlice from "@features/admin/store/admin-readers-slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "competition"]
};

const rootReducer = combineReducers({
  user: userSlice.reducer,
  cart: cartSlice.reducer,
  personal: personalSlice.reducer,
  competition: competitionsSlice.reducer,
  adminCompetitions: adminCompetitionsSlice.reducer,
  adminReaders: adminReadersSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
