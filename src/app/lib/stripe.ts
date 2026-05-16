"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  captureCheckoutStarted,
  captureCheckoutCompleted,
  captureCheckoutCancelled,
  captureCheckoutError,
  capturePremiumActivated,
} from "lib/analytics";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.warn(
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Stripe checkout will use demo mode."
      );
    }
    stripePromise = publishableKey
      ? loadStripe(publishableKey)
      : Promise.resolve(null);
  }
  return stripePromise;
};

const STRIPE_CHECKOUT_URL = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL;

export interface CheckoutResult {
  sessionId?: string;
  error?: string;
}

const DEFAULT_PLAN_NAME = "Premium";
const DEFAULT_AMOUNT = 0;
const DEFAULT_CURRENCY = "USD";

export async function initiateStripeCheckout(
  priceId: string,
  planName?: string,
  amount?: number,
  currency?: string
): Promise<string | null> {
  const resolvedPlanName = planName ?? DEFAULT_PLAN_NAME;
  const resolvedAmount = amount ?? DEFAULT_AMOUNT;
  const resolvedCurrency = currency ?? DEFAULT_CURRENCY;

  captureCheckoutStarted({
    priceId,
    planName: resolvedPlanName,
    amount: resolvedAmount,
    currency: resolvedCurrency,
  });

  if (STRIPE_CHECKOUT_URL) {
    try {
      const response = await fetch(STRIPE_CHECKOUT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Checkout failed: ${errorText}`);
      }

      const data = await response.json();
      const { sessionId, url } = data;

      if (url) {
        window.location.href = url;
        return null;
      }

      if (sessionId) {
        if (url) {
          window.location.href = url;
        }
        return sessionId;
      }

      captureCheckoutCancelled({
        priceId,
        planName: resolvedPlanName,
        step: "no_session_url",
      });
      return null;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown checkout error";
      captureCheckoutError({
        error: message,
        priceId,
        planName: resolvedPlanName,
        step: "initiate_checkout",
      });
      throw error;
    }
  }

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  if (demoMode) {
    const confirmation = window.confirm(
      "Demo Mode: Simulate a successful premium upgrade?\n\nClick OK to simulate premium activation."
    );
    if (confirmation) {
      if (typeof window !== "undefined") {
        localStorage.setItem("noiceresume_demo_premium", "true");
      }
      const sessionId = "demo_session_" + Date.now();
      captureCheckoutCompleted({
        sessionId,
        amount: resolvedAmount,
        currency: resolvedCurrency,
        planName: resolvedPlanName,
      });
      capturePremiumActivated({ sessionId });
      return sessionId;
    }
    captureCheckoutCancelled({
      priceId,
      planName: resolvedPlanName,
      step: "demo_confirm",
    });
    throw new Error("Checkout cancelled");
  }

  captureCheckoutError({
    error: "Stripe not configured",
    priceId,
    planName: resolvedPlanName,
    step: "no_config",
  });
  throw new Error(
    "Stripe is not configured. In production, set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and NEXT_PUBLIC_STRIPE_CHECKOUT_URL."
  );
}

export async function verifyCheckoutSession(
  sessionId: string
): Promise<{ success: boolean; premium: boolean }> {
  const verifyUrl = process.env.NEXT_PUBLIC_STRIPE_VERIFY_URL;

  if (!verifyUrl) {
    if (sessionId.startsWith("demo_session_")) {
      return { success: true, premium: true };
    }
    return { success: false, premium: false };
  }

  try {
    const response = await fetch(`${verifyUrl}?sessionId=${sessionId}`);
    if (!response.ok) {
      throw new Error("Verification failed");
    }
    const data = await response.json();
    if (data.premium) {
      captureCheckoutCompleted({
        sessionId,
        customerId: data.customerId,
        amount: data.amount ?? 0,
        currency: data.currency ?? "USD",
        planName: data.planName ?? DEFAULT_PLAN_NAME,
      });
      capturePremiumActivated({
        sessionId,
        customerId: data.customerId,
      });
    }
    return { success: true, premium: data.premium };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Verification error";
    captureCheckoutError({
      error: message,
      step: "verify_session",
    });
    return { success: false, premium: false };
  }
}

export async function verifyCheckoutSession(
  sessionId: string
): Promise<{ success: boolean; premium: boolean }> {
  const verifyUrl = process.env.NEXT_PUBLIC_STRIPE_VERIFY_URL;

  if (!verifyUrl) {
    if (sessionId.startsWith("demo_session_")) {
      return { success: true, premium: true };
    }
    return { success: false, premium: false };
  }

  try {
    const response = await fetch(`${verifyUrl}?sessionId=${sessionId}`);
    if (!response.ok) {
      throw new Error("Verification failed");
    }
    const data = await response.json();
    return { success: true, premium: data.premium };
  } catch (error) {
    console.error("Session verification error:", error);
    return { success: false, premium: false };
  }
}

export function isDemoPremium(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("noiceresume_demo_premium") === "true";
}
