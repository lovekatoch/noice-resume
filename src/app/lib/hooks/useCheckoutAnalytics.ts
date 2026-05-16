import { useEffect, useRef } from "react";
import { useAppSelector } from "lib/redux/hooks";
import {
  selectIsPremium,
  selectCheckoutSessionId,
  selectCheckoutError,
  selectCustomerId,
} from "lib/redux/userSlice";
import { capturePremiumActivated, captureCheckoutError } from "lib/analytics";

export function useCheckoutAnalytics() {
  const isPremium = useAppSelector(selectIsPremium);
  const checkoutSessionId = useAppSelector(selectCheckoutSessionId);
  const checkoutError = useAppSelector(selectCheckoutError);
  const customerId = useAppSelector(selectCustomerId);

  const wasPremium = useRef(isPremium);
  const wasError = useRef(checkoutError);

  useEffect(() => {
    if (isPremium && !wasPremium.current) {
      capturePremiumActivated({
        sessionId: checkoutSessionId ?? undefined,
        customerId: customerId ?? undefined,
      });
    }
    wasPremium.current = isPremium;
  }, [isPremium, checkoutSessionId, customerId]);

  useEffect(() => {
    if (checkoutError && !wasError.current) {
      captureCheckoutError({
        error: checkoutError,
        step: "redux_state",
      });
    }
    wasError.current = checkoutError;
  }, [checkoutError]);
}
