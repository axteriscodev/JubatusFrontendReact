import { createSlice } from '@reduxjs/toolkit';

/**
 * Slice per la gestione dell'area personale
 */
const personalSlice = createSlice({
    name: "personal",
    initialState: {
        id: 0,
        email: "",
        jwt: "",
    },
    reducers: {
        updateEmail(state, action) {},
        updateJwt (state, action) {},
        clearUser(state, action) {},
    }

});

export const personalActions = personalSlice.actions;

export default personalSlice;