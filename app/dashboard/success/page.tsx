"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Suspense } from "react";

function CheckoutResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [countdown, setCountdown] = useState(5);

    // Dodo Payments might not append ?status=success on successful payment.
    // Since the route itself is /dashboard/success, we treat it as success unless explicitly failed.
    const status = searchParams.get("status");
    const isSuccess = status !== "failed" && status !== "cancelled";

    useEffect(() => {
        let count = 5;
        const timer = setInterval(() => {
            count -= 1;
            setCountdown(count);
            if (count <= 0) {
                clearInterval(timer);
                router.push(isSuccess ? "/dashboard" : "/subscription");
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [router, isSuccess]);

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    {/* Success Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="bg-emerald-100 rounded-full p-4">
                            <CheckCircle className="w-16 h-16 text-emerald-600" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 mb-3">
                        Payment Successful!
                    </h1>
                    <p className="text-slate-600 mb-8">
                        Thank you for your purchase. Your payment has been processed successfully.
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-slate-600">
                            Redirecting to dashboard in{" "}
                            <span className="font-bold text-emerald-600">{countdown}</span>{" "}
                            seconds...
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/dashboard")}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        Go to Dashboard Now
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-xs text-slate-500 mt-6">
                        A confirmation email has been sent to your registered email address.
                    </p>
                </div>
            </div>
        );
    }

    // Payment failed or was cancelled
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                {/* Failure Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="bg-red-100 rounded-full p-4">
                        <XCircle className="w-16 h-16 text-red-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-3">
                    Payment Failed
                </h1>
                <p className="text-slate-600 mb-8">
                    Your payment could not be completed. No charges have been made.
                    Please try again or use a different payment method.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-slate-600">
                        Redirecting to subscription page in{" "}
                        <span className="font-bold text-red-500">{countdown}</span>{" "}
                        seconds...
                    </p>
                </div>

                <button
                    onClick={() => router.push("/subscription")}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-5 h-5" />
                    Try Again
                </button>

                <p className="text-xs text-slate-500 mt-6">
                    If you believe this is an error, please contact support.
                </p>
            </div>
        </div>
    );
}

export default function CheckoutResultPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-slate-500">Loading...</div>
            </div>
        }>
            <CheckoutResultContent />
        </Suspense>
    );
}
