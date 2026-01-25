"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function CheckoutSuccess() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/dashboard");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="bg-emerald-100 rounded-full p-4">
                        <CheckCircle className="w-16 h-16 text-emerald-600" />
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-slate-900 mb-3">
                    Payment Successful!
                </h1>
                <p className="text-slate-600 mb-8">
                    Thank you for your purchase. Your payment has been processed successfully.
                </p>

                {/* Redirect Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-slate-600">
                        Redirecting to dashboard in{" "}
                        <span className="font-bold text-emerald-600">{countdown}</span>{" "}
                        seconds...
                    </p>
                </div>

                {/* Manual Redirect Button */}
                <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    Go to Dashboard Now
                    <ArrowRight className="w-5 h-5" />
                </button>

                {/* Additional Info */}
                <p className="text-xs text-slate-500 mt-6">
                    A confirmation email has been sent to your registered email address.
                </p>
            </div>
        </div>
    );
}
