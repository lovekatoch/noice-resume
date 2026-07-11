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

// ─── Action types ───

export type UserAction =
  | { type: "user/setPremium"; payload: boolean }
  | { type: "user/setCheckoutSessionId"; payload: string | null }
  | { type: "user/setCustomerId"; payload: string | null }
  | { type: "user/setCheckoutError"; payload: string | null }
  | { type: "user/resetCheckoutState" };

// ─── Action creators ───

export const setPremium = (payload: boolean): UserAction => ({ type: "user/setPremium", payload });
export const setCheckoutSessionId = (payload: string | null): UserAction => ({ type: "user/setCheckoutSessionId", payload });
export const setCustomerId = (payload: string | null): UserAction => ({ type: "user/setCustomerId", payload });
export const setCheckoutError = (payload: string | null): UserAction => ({ type: "user/setCheckoutError", payload });
export const resetCheckoutState = (): UserAction => ({ type: "user/resetCheckoutState" });

// ─── Reducer ───

export function userReducer(state: UserState = initialUserState, action: UserAction): UserState {
  switch (action.type) {
    case "user/setPremium":
      return { ...state, isPremium: action.payload };
    case "user/setCheckoutSessionId":
      return { ...state, checkoutSessionId: action.payload };
    case "user/setCustomerId":
      return { ...state, customerId: action.payload };
    case "user/setCheckoutError":
      return { ...state, checkoutError: action.payload };
    case "user/resetCheckoutState":
      return { ...state, checkoutSessionId: null, checkoutError: null };
    default:
      return state;
  }
}

// ─── Selectors ───

export const selectIsPremium = (state: RootState) => state.user.isPremium;
export const selectCheckoutSessionId = (state: RootState) => state.user.checkoutSessionId;
export const selectCustomerId = (state: RootState) => state.user.customerId;
export const selectCheckoutError = (state: RootState) => state.user.checkoutError;
