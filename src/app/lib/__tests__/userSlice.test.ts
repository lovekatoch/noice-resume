import userReducer, {
  setPremium,
  setCheckoutSessionId,
  setCustomerId,
  setCheckoutError,
  resetCheckoutState,
  initialUserState,
} from "lib/redux/userSlice";

describe("userSlice", () => {
  describe("setPremium", () => {
    it("should set premium to true", () => {
      const state = userReducer(
        initialUserState,
        setPremium(true)
      );
      expect(state.isPremium).toBe(true);
    });

    it("should set premium to false", () => {
      const state = userReducer(
        initialUserState,
        setPremium(false)
      );
      expect(state.isPremium).toBe(false);
    });
  });

  describe("setCheckoutSessionId", () => {
    it("should set the checkout session id", () => {
      const state = userReducer(
        initialUserState,
        setCheckoutSessionId("cs_test_123")
      );
      expect(state.checkoutSessionId).toBe("cs_test_123");
    });

    it("should set null", () => {
      const state = userReducer(
        initialUserState,
        setCheckoutSessionId(null)
      );
      expect(state.checkoutSessionId).toBeNull();
    });
  });

  describe("setCustomerId", () => {
    it("should set customer id", () => {
      const state = userReducer(
        initialUserState,
        setCustomerId("cus_123")
      );
      expect(state.customerId).toBe("cus_123");
    });
  });

  describe("setCheckoutError", () => {
    it("should set checkout error", () => {
      const state = userReducer(
        initialUserState,
        setCheckoutError("Card declined")
      );
      expect(state.checkoutError).toBe("Card declined");
    });
  });

  describe("resetCheckoutState", () => {
    it("should reset checkout fields", () => {
      const modified = userReducer(
        initialUserState,
        setCheckoutSessionId("cs_test")
      );
      const state = userReducer(
        modified,
        resetCheckoutState()
      );
      expect(state.checkoutSessionId).toBeNull();
      expect(state.checkoutError).toBeNull();
    });
  });
});
