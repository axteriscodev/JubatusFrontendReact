import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice per la gestione delle competizioni
 */
const competitionsSlice = createSlice({
  name: "competition",
  initialState: {
    id: 0,
    slug: "",
    tagId: 0,
    backgroundColor: "",
    primaryColor: "",
    secondaryColor: "",
    logo: "",
    emoji: "",
    preOrder: false,
    dateEvent: "",
    currencyId: 0,
    title: "",
    location: "",
    description: "",
    tag: "",
    bibNumber: false,
    currency: "",
    currencySymbol: "",
    aspectRatio: "",
  },
  reducers: {
    /**
     * Imposta i parametri della competizione
     * @param {*} state
     * @param {*} action
     */
    setCompetitionPreset(state, action) {
      state.id = action.payload.id;
      state.slug = action.payload.slug;
      state.tagId = action.payload.tagId;
      state.backgroundColor = action.payload.backgroundColor;
      state.primaryColor = action.payload.primaryColor;
      state.secondaryColor = action.payload.secondaryColor;
      state.logo = action.payload.logo;
      state.emoji = action.payload.languages[0].emoji;
      state.preOrder = action.payload.preOrder ?? false;
      state.dateEvent = action.payload.dateEvent;
      state.currencyId = action.payload.currencyId;
      state.title = action.payload.languages[0].title;
      state.location = action.payload.languages[0].location;
      state.description = action.payload.languages[0].description;
      state.tag = action.payload.tag.tag;
      state.bibNumber = action.payload.tag.bibNumber;
      state.currency = action.payload.currency.currency;
      state.currencySymbol = action.payload.currency.symbol;
      state.aspectRatio = action.payload.aspectRatio;
    },
  },
});

export const competitionsActions = competitionsSlice.actions;

export default competitionsSlice;
