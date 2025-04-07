import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userSlice from "./user/user-slice";
import cartSlice from "./cart/cart-slice";
import personalSlice from "./personal/personal-slice";
import competitionsSlice from "./competitions/competitions-slice";
import adminCompetitionsSlice from "./admin-competitions/admin-competitions-slice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  user: userSlice.reducer,
  cart: cartSlice.reducer,
  personal: personalSlice.reducer,
  competition: competitionsSlice.reducer,
  adminCompetitions: adminCompetitionsSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
