"use client";

import { useState } from "react";

/**
 * Example Checkout Component
 * 
 * This component demonstrates how to use the checkout handler.
 * You can integrate this into your existing pages or create a dedicated checkout page.
 */

export default function CheckoutExample() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Example 1: Static Checkout (GET)
    const handleStaticCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            const productId = "pdt_0NWyeKym8LDKoNKB9E7do"; // Replace with your product ID
            const response = await fetch(
                `/api/checkout?productId=${productId}&quantity=1&metadata_userId=123`
            );

            console.log("Static checkout response:", response.status);

            if (!response.ok) {
                const errorData = await response.text();
                console.error("Checkout failed:", errorData);
                throw new Error(`Checkout failed: ${response.status} - ${errorData}`);
            }

            const { checkout_url } = await response.json();
            console.log("Checkout URL:", checkout_url);
            window.location.href = checkout_url; // Redirect to checkout
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setLoading(false);
        }
    };

    // Example 2: Checkout Session (POST) - Recommended
    const handleSessionCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: "pdt_0NWyeKym8LDKoNKB9E7do",
                    quantity: 1,
                    email: "aizendrio@gmail.com",
                    name: "Rio Chatterjee",
                    metadata: {
                        userId: "859825ff-b5ba-4c9f-8a87-b45ea833ea82",
                        source: "checkout",
                    },

                }),
            });

            console.log("Session checkout response:", response.status);

            if (!response.ok) {
                const errorData = await response.text();
                console.error("Checkout failed:", errorData);
                throw new Error(`Checkout failed: ${response.status} - ${errorData}`);
            }

            const { checkout_url } = await response.json();
            console.log("Checkout URL:", checkout_url);
            window.location.href = checkout_url; // Redirect to checkout
        } catch (err) {
            //console.log("Checkout error:", err);
            setError(err instanceof Error ? err.message : "An error occurred");
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Checkout Examples</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {/* Static Checkout Button */}
                <button
                    onClick={handleStaticCheckout}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : "Static Checkout (GET)"}
                </button>

                {/* Session Checkout Button */}
                <button
                    onClick={handleSessionCheckout}
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : "Session Checkout (POST) - Recommended"}
                </button>
            </div>

            <div className="mt-6 text-sm text-slate-600">
                <p className="font-semibold mb-2">Note:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Replace product IDs with your actual product IDs</li>
                    <li>Session checkout (POST) is recommended for production</li>
                    <li>Both methods return a checkout URL for redirection</li>
                </ul>
            </div>
        </div>
    );
}
