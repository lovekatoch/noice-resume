import { loadStripe, type Stripe } from "@stripe/stripe-js";

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

export async function initiateStripeCheckout(priceId: string): Promise<string | null> {
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

      return null;
    } catch (error) {
      console.error("Stripe checkout error:", error);
      throw error;
    }
  }

  console.log(
    `[DEMO MODE] Stripe checkout would be initiated for price: ${priceId}`
  );

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  if (demoMode) {
    const confirmation = window.confirm(
      "🎉 Demo Mode: Simulate a successful premium upgrade?\n\nClick OK to simulate premium activation."
    );
    if (confirmation) {
      if (typeof window !== "undefined") {
        localStorage.setItem("noiceresume_demo_premium", "true");
      }
      return "demo_session_" + Date.now();
    }
    throw new Error("Checkout cancelled");
  }

  const demoUrl = `https://buy.stripe.com/demo?price=${priceId}`;
  window.open(demoUrl, "_blank");
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
