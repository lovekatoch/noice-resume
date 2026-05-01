"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setCheckoutError,
  setCheckoutSessionId,
} from "lib/redux/userSlice";
import { initiateStripeCheckout } from "lib/stripe";

interface UpgradeModalProps {
  onClose: () => void;
}

const PREMIUM_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "price_demo";
const PREMIUM_PRICE = 9;

export const UpgradeModal = ({ onClose }: UpgradeModalProps) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);
    dispatch(setCheckoutError(null));

    try {
      const sessionId = await initiateStripeCheckout(PREMIUM_PRICE_ID);
      if (sessionId) {
        dispatch(setCheckoutSessionId(sessionId));
      }
    } catch (error) {
      dispatch(
        setCheckoutError(
          error instanceof Error ? error.message : "Checkout failed"
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-md rounded-lg border border-[var(--notion-border)] bg-white shadow-xl"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between border-b border-[var(--notion-border)] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">
              Upgrade to Premium
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="mb-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-1 text-sm font-semibold text-white">
              Premium
            </div>
            <div className="mt-4 flex items-baseline justify-center">
              <span className="text-4xl font-bold text-gray-900">
                ${PREMIUM_PRICE}
              </span>
              <span className="ml-1 text-gray-500">/month</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Cancel anytime. No commitment.
            </p>
          </div>

          <ul className="mb-6 space-y-3">
            {[
              "Unlimited AI content enhancements",
              "All resume templates & themes",
              "Priority support",
              "Early access to new features",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 font-semibold text-white shadow-sm transition-all hover:from-amber-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.216A8 8 0 0112 20v0c5.523 0 10-4.477 10-10h-2zm2-5.216A8 8 0 0112 4v0c5.523 0 10 4.477 10 10h-2zm2-5.216a8 8 0 01-4 1.932v0c-2.514 0-4.728-.962-6.356-2.509l1.356 1.509A6 6 0 0112 16v0z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              "Subscribe Now"
            )}
          </button>

          <p className="mt-4 text-center text-xs text-gray-400">
            Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};
