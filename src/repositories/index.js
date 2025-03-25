import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./user/user-slice";
import cartSlice from "./cart/cart-slice";
import personalSlice from "./personal/personal-slice";

const store = configureStore({
    user: userSlice.reducer,
    cart: cartSlice.reducer,
    personal: personalSlice.reducer,
});

export default store;