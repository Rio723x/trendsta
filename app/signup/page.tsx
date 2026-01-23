"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            }, {
                onRequest: () => {
                    setIsLoading(true);
                },
                onSuccess: () => {
                    router.push("/dashboard");
                },
                onError: (ctx) => {
                    setError(ctx.error.message);
                    setIsLoading(false);
                },
            });
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await authClient.signUp.email({
                email,
                password,
                name,
                callbackURL: "/dashboard",
            }, {
                onRequest: () => {
                    setIsLoading(true);
                },
                onSuccess: () => {
                    router.push("/dashboard");
                },
                onError: (ctx) => {
                    setError(ctx.error.message);
                    setIsLoading(false);
                },
            });
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] p-5">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 max-w-md w-full shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Join Trendsta</h1>
                    <p className="text-base text-white/60">
                        Create viral content with AI-powered insights
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-6 flex items-center gap-2 text-red-300 text-sm">
                        <span>⚠️</span>
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 text-base font-semibold text-gray-800 bg-white border-0 rounded-xl transition-all duration-200 shadow-md ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-50 active:scale-[0.98]"
                        }`}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                    )}
                    <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
                </button>

                <div className="my-8 flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative z-10 bg-[#141424] px-4 text-sm text-white/40 uppercase tracking-wider">
                        Or continue with email
                    </div>
                </div>

                <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-[0.98] transition-all duration-200 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:brightness-110"
                            }`}
                    >
                        {isLoading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="mt-6 text-xs text-center text-white/50 leading-relaxed">
                    By continuing, you agree to our{" "}
                    <a href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">Privacy Policy</a>
                </p>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-sm text-white/40">
                        Already have an account?{" "}
                        <Link href="/signin" className="text-blue-400 font-medium hover:text-blue-300 transition-colors ml-1">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
