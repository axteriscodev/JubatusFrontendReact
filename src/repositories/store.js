import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./user/user-slice";
import cartSlice from "./cart/cart-slice";
import personalSlice from "./personal/personal-slice";
import competitionsSlice from "./competitions/competitions-slice";

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        cart: cartSlice.reducer,
        personal: personalSlice.reducer,
        competition: competitionsSlice.reducer
    }
});

