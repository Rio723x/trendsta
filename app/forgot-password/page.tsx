"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const { error: resetError } = await (authClient as any).requestPasswordReset({
                email,
                redirectTo: "/reset-password",
            });

            if (resetError) {
                console.log(resetError);
                const isNotFound =
                    resetError.status === 404 ||
                    resetError.code === 'USER_NOT_FOUND' ||
                    resetError.message?.toLowerCase().includes("not found") ||
                    resetError.message?.toLowerCase().includes("user not found");

                if (isNotFound) {
                    setError("No account exists for this email address.");
                } else {
                    // Log the actual error to console for debugging if it's something else
                    console.error("Forgot password error:", resetError);
                    setError(resetError.message || "An error occurred");
                }
            } else {
                setIsSuccess(true);
            }
        } catch (err: any) {
            console.error("Forgot password exception:", err);
            const isNotFound =
                err?.status === 404 ||
                err?.code === 'USER_NOT_FOUND' ||
                err?.message?.toLowerCase().includes("not found");

            if (isNotFound) {
                setError("No account exists for this email address.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div data-theme="dark" className="min-h-screen relative flex items-center justify-center bg-[#020617] text-white overflow-hidden p-4">
            {/* Global Frosted Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-600/10 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-orange-600/10 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-0 backdrop-blur-[1px] bg-black/10" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10 glass-panel !bg-black/20 !backdrop-blur-[20px] !border-white/10 p-8 sm:p-10 !rounded-[2.5rem] shadow-2xl"
            >
                <div className="flex items-center justify-center gap-3 mb-10">
                    <Image src="/T_logo.png" alt="Trendsta" width={36} height={36} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                    <span className="text-3xl font-black text-white tracking-tighter">Trendsta</span>
                </div>

                <div className="mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">Reset Password</h1>
                    <p className="text-slate-400 text-sm sm:text-base font-medium">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 text-red-400 text-sm font-semibold text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-emerald-400 text-center space-y-4"
                    >
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-emerald-300">Check your inbox</p>
                            <p className="text-sm mt-1 opacity-90">We've sent a password reset link to {email}.</p>
                        </div>
                        <Link href="/signin" className="block mt-4 text-white font-bold bg-white/10 hover:bg-white/20 py-3 rounded-xl transition-all">
                            Back to Sign In
                        </Link>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 sm:py-4 rounded-2xl bg-white/5 border-2 border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/10 transition-all font-medium text-sm sm:text-base"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-[0_8px_20px_rgba(234,88,12,0.2)] hover:shadow-[0_12px_30px_rgba(234,88,12,0.4)] hover:translate-y-[-1px] active:translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest border border-white/10 text-sm sm:text-base"
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <div className="text-center pt-4">
                            <Link href="/signin" className="text-xs sm:text-sm text-slate-400 hover:text-white font-semibold transition-colors">
                                ← Back to Sign In
                            </Link>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
