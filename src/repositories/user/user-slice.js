import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: "user",
    initialState: {
        id: 0,
        email: "",
        jwt: "",
    },
    reducers: {
        updateEmail(state, action) {
            state.email = action.payload;
        },
        updateJwt (state, action) {
            state.jwt = action.payload;
        },
        clearUser(state, action) {
            state.jwt = "";
            state.id = 0;
        },
    }

});

export const userActions = userSlice.actions;

export default userSlice;