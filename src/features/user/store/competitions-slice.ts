import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Competition } from "@/types/competition";

interface CompetitionState {
  id: number;
  slug: string;
  tagId: number;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  emoji: string;
  preOrder: boolean;
  dateEvent: string;
  currencyId: number;
  title: string;
  location: string;
  description: string;
  tag: string;
  bibNumber: boolean;
  currency: string;
  currencySymbol: string;
  aspectRatio: string;
}

const initialState: CompetitionState = {
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
};

const competitionsSlice = createSlice({
  name: "competition",
  initialState,
  reducers: {
    setCompetitionPreset(state, action: PayloadAction<Competition>) {
      const p = action.payload;
      state.id = p.id;
      state.slug = p.slug;
      state.tagId = p.tagId;
      state.backgroundColor = p.backgroundColor;
      state.primaryColor = p.primaryColor;
      state.secondaryColor = p.secondaryColor;
      state.logo = p.logo;
      state.emoji = p.languages[0].emoji;
      state.preOrder = p.preOrder ?? false;
      state.dateEvent = p.dateEvent;
      state.currencyId = p.currencyId;
      state.title = p.languages[0].title;
      state.location = p.languages[0].location;
      state.description = p.languages[0].description;
      state.tag = p.tag.tag;
      state.bibNumber = p.tag.bibNumber;
      state.currency = p.currency.currency;
      state.currencySymbol = p.currency.symbol;
      state.aspectRatio = p.aspectRatio;
    },
  },
});

export const competitionsActions = competitionsSlice.actions;

export default competitionsSlice;
