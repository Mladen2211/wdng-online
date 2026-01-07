'use client';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import LoadingSpinner from "./ui/LoadingSpinner";

interface PayPalCheckoutProps {
  websiteId: string;
  onSuccess?: () => void;
}

export default function PayPalCheckout({ websiteId, onSuccess }: PayPalCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waiverAccepted, setWaiverAccepted] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const isConfigured = clientId && !clientId.includes('your_sandbox_client_id');

  if (!isConfigured) {
    return (
      <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
        <p className="font-semibold">Configuration Error</p>
        <p>PayPal Client ID is missing or invalid. Please check your .env.local file.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold mb-1">Activate Website</h3>
      {/* <p className="text-xs text-gray-500 mb-3">One-time payment of €19.99</p> */}

      <div className="mb-4 flex items-start gap-2">
        <input
          type="checkbox"
          id="waiver"
          checked={waiverAccepted}
          onChange={(e) => setWaiverAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
        />
        <label htmlFor="waiver" className="text-xs text-gray-600">
          I agree to the immediate delivery of the service and acknowledge that I lose my right to a refund once the website is published.
        </label>
      </div>

      {/* Initialize PayPal SDK */}
      <PayPalScriptProvider options={{
        clientId: clientId!,
        currency: "EUR",
        intent: "capture"
      }}>
        <div className={`relative z-0 ${!waiverAccepted ? 'opacity-50 pointer-events-none' : ''}`}>
          <PayPalButtons
            style={{ layout: "vertical", shape: "rect", label: "pay" }}
            disabled={loading || !waiverAccepted}

            // 1. Setup the transaction
            createOrder={(data, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [{
                  reference_id: websiteId,
                  description: `Wedding Site Activation: ${websiteId}`,
                  amount: {
                    currency_code: "EUR",
                    value: "19.99"
                  },
                }],
              });
            }}

            // 2. Handle successful payment
            onApprove={async (data, actions) => {
              if (!actions.order) return;
              setLoading(true);
              setError(null);

              try {
                // Capture payment details on client side first
                const details = await actions.order.capture();

                // 3. Verify on backend (CRITICAL SECURITY STEP)
                const response = await fetch("/api/verify-payment", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderID: details.id,
                    websiteId: websiteId,
                  }),
                });

                const result = await response.json();

                if (!response.ok) throw new Error(result.error || "Verification failed");

                // Success!
                if (onSuccess) {
                  onSuccess();
                } else {
                  window.location.reload();
                }

              } catch (err) {
                console.error("Payment Error:", err);
                setError("Payment successful but activation failed. Please contact support.");
              } finally {
                setLoading(false);
              }
            }}

            onError={(err) => {
              console.error("PayPal Error:", err);
              setError("An error occurred with PayPal. Please try again.");
            }}
          />
        </div>
      </PayPalScriptProvider>

      {loading && (
        <div className="flex items-center justify-center gap-2 mt-4 text-blue-600">
          <LoadingSpinner />
          <span>Finalizing activation...</span>
        </div>
      )}

      {error && <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded">{error}</div>}
    </div>
  );
}
