import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";

export interface UserState {
  isPremium: boolean;
  checkoutSessionId: string | null;
  customerId: string | null;
  checkoutError: string | null;
}

export const initialUserState: UserState = {
  isPremium: false,
  checkoutSessionId: null,
  customerId: null,
  checkoutError: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setPremium: (draft, action: PayloadAction<boolean>) => {
      draft.isPremium = action.payload;
    },
    setCheckoutSessionId: (draft, action: PayloadAction<string | null>) => {
      draft.checkoutSessionId = action.payload;
    },
    setCustomerId: (draft, action: PayloadAction<string | null>) => {
      draft.customerId = action.payload;
    },
    setCheckoutError: (draft, action: PayloadAction<string | null>) => {
      draft.checkoutError = action.payload;
    },
    resetCheckoutState: (draft) => {
      draft.checkoutSessionId = null;
      draft.checkoutError = null;
    },
  },
});

export const {
  setPremium,
  setCheckoutSessionId,
  setCustomerId,
  setCheckoutError,
  resetCheckoutState,
} = userSlice.actions;

export const selectIsPremium = (state: RootState) => state.user.isPremium;
export const selectCheckoutSessionId = (state: RootState) =>
  state.user.checkoutSessionId;
export const selectCustomerId = (state: RootState) => state.user.customerId;
export const selectCheckoutError = (state: RootState) =>
  state.user.checkoutError;

export default userSlice.reducer;
