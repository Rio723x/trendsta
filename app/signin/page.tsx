"use client";

import { authClient, useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { data: session } = useSession();

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (session?.user) {
            router.push("/dashboard");
        }
    }, [session, router]);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            }, {
                onRequest: () => setIsLoading(true),
                onSuccess: () => router.push("/dashboard"),
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

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await authClient.signIn.email({
                email,
                password,
                callbackURL: "/dashboard",
            }, {
                onRequest: () => setIsLoading(true),
                onSuccess: () => router.push("/dashboard"),
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
        <div data-theme="dark" className="min-h-screen relative flex flex-col lg:flex-row bg-[#020617] text-white overflow-x-hidden">
            {/* Global Frosted Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] bg-cyan-600/5 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '12s' }} />
                <div className="absolute inset-0 backdrop-blur-[1px] bg-black/10" />
            </div>

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12 border-r border-white/5 backdrop-blur-[2px]">
                {/* Decorative Visuals */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <svg className="absolute top-[10%] left-[10%] w-64 h-48 opacity-10" viewBox="0 0 200 100">
                        <path d="M0,80 Q50,20 100,50 T200,10" fill="none" stroke="currentColor" strokeWidth="4" className="text-blue-500" />
                    </svg>
                    <div className="absolute bottom-[20%] right-[15%] w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
                </div>

                {/* Branding Content */}
                <div className="relative text-center max-w-lg flex flex-col items-center">
                    <div className="flex items-center gap-5 mb-16 group">
                        <Image
                            src="/T_logo.png"
                            width={54}
                            height={54}
                            alt="Trendsta"
                            className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-transform duration-500 group-hover:scale-110"
                        />
                        <span className="text-6xl font-black text-white tracking-tighter">Trendsta</span>
                    </div>

                    <h2 className="text-5xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                        Discover What's <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">Trending</span>
                    </h2>
                    <p className="text-slate-400 text-xl leading-relaxed font-medium px-4">
                        Join thousands of creators using AI-powered insights to stay ahead of the curve and create viral content.
                    </p>
                </div>
            </div>

            {/* Right Panel - Responsive Glass Form */}
            <div className="flex-1 min-h-screen relative z-10 flex items-center justify-center p-4 sm:p-8 lg:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md md:max-w-[480px] glass-panel !bg-black/20 !backdrop-blur-[20px] !border-white/10 p-8 sm:p-10 !rounded-[2.5rem] shadow-2xl"
                >
                    {/* Brand Header (Mobile) */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
                        <Image src="/T_logo.png" alt="Trendsta" width={32} height={32} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                        <span className="text-3xl font-black text-white tracking-tighter">Trendsta</span>
                    </div>

                    <div className="mb-10 text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-400 text-base sm:text-lg font-medium">Sign in to access your dashboard.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 text-red-400 text-sm font-semibold flex items-center gap-3"
                        >
                            <div className="min-w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleEmailSignIn} className="space-y-6">
                        <div>
                            <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 sm:py-4 rounded-2xl bg-white/5 border-2 border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/10 transition-all font-medium text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Secure Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 sm:py-4 rounded-2xl bg-white/5 border-2 border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/10 transition-all font-medium text-sm sm:text-base"
                            />
                        </div>

                        <div className="flex justify-end pt-1">
                            <Link href="/forgot-password" className="text-xs sm:text-sm text-orange-400 hover:text-orange-300 font-bold transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-[0_8px_20px_rgba(234,88,12,0.2)] hover:shadow-[0_12px_30px_rgba(234,88,12,0.4)] hover:translate-y-[-1px] active:translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest border border-white/10 text-sm sm:text-base"
                        >
                            {isLoading ? "Validating..." : "Sign In to Dashboard"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-10 flex items-center gap-4">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">Or continue with</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* Social Login */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full py-3.5 sm:py-4 rounded-2xl border-2 border-white/10 flex items-center justify-center gap-3 hover:bg-white/5 transition-all disabled:opacity-50 font-bold text-white text-sm sm:text-base"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-12 text-center">
                        <p className="text-slate-500 font-medium text-sm">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-orange-400 font-black hover:text-orange-300 transition-colors uppercase tracking-widest ml-1">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
