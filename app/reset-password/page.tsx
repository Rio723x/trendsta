"use client";

import { useState, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();


    // better-auth might pass token, or might extract from URL query param automatically.
    // If not, we can read it: const token = searchParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = searchParams.get("token") || undefined;
            const { error } = await authClient.resetPassword({
                newPassword: password,
                ...(token ? { token } : {}),
            });

            if (error) {
                setError(error.message || "An error occurred");
            } else {
                setIsSuccess(true);
                setTimeout(() => {
                    router.push("/signin");
                }, 3000);
            }
        } catch (err) {
            setError("An error occurred. The link might be expired.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">Create New Password</h1>
                <p className="text-slate-400 text-sm sm:text-base font-medium">
                    Enter your new secure password below.
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
                        <p className="font-bold text-lg text-emerald-300">Password Changed!</p>
                        <p className="text-sm mt-1 opacity-90">Redirecting to sign in...</p>
                    </div>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 pr-12 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/10 transition-all font-medium text-sm sm:text-base"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-5 py-3.5 pr-12 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/10 transition-all font-medium text-sm sm:text-base"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !password || !confirmPassword}
                        className="w-full py-4 mt-2 rounded-2xl font-black text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-[0_8px_20px_rgba(234,88,12,0.2)] hover:shadow-[0_12px_30px_rgba(234,88,12,0.4)] hover:translate-y-[-1px] active:translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest border border-white/10 text-sm sm:text-base"
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            )}
        </motion.div>
    );
}

export default function ResetPassword() {
    return (
        <div data-theme="dark" className="min-h-screen relative flex items-center justify-center bg-[#020617] text-white overflow-hidden p-4">
            {/* Global Frosted Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-blue-600/10 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[20%] left-[20%] w-[40%] h-[40%] bg-pink-600/10 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-0 backdrop-blur-[1px] bg-black/10" />
            </div>

            <Suspense fallback={<div className="text-white z-10 text-center">Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
