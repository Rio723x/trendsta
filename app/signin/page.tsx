"use client";

import { authClient, useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, TrendingUp, Zap, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="min-h-screen relative flex flex-col lg:flex-row bg-cream text-ink font-body selection:bg-[#ff5900]/10 overflow-x-hidden">
            {/* Background radial glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ff5900]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-[45%] relative z-10 items-center justify-center p-12 border-r border-border-patreon">
                {/* Branding Content */}
                <div className="relative text-left max-w-lg">
                    <Link href="/" className="inline-flex items-center gap-3 mb-16 group">
                        <Image
                            src="/T_logo.png"
                            width={42}
                            height={42}
                            alt="Trendsta"
                            className="rounded-xl drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
                        />
                        <span className="text-2xl font-bold tracking-tight text-ink font-body">Trendsta</span>
                    </Link>

                    <h2 className="text-6xl lg:text-7xl font-display font-normal text-ink mb-8 leading-[0.95] tracking-[-0.04em]">
                        Discover <br />
                        what's <span className="text-[#ff5900] italic pr-1">trending</span><br/>before it does.
                    </h2>
                    <p className="text-lg text-muted max-w-md leading-relaxed font-medium tracking-tight">
                        Sign in to access your AI-powered dashboard and stay ahead of the curve.
                    </p>
                    

                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 min-h-screen relative z-10 flex items-center justify-center p-4 sm:p-8 lg:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white border border-border-patreon p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]"
                >
                    {/* Brand Header (Mobile) */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
                        <Image src="/T_logo.png" alt="Trendsta" width={32} height={32} className="rounded-lg shadow-sm" />
                        <span className="text-2xl font-bold text-ink tracking-tight">Trendsta</span>
                    </div>

                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-display font-normal text-ink mb-3 tracking-tight">Welcome Back</h1>
                        <p className="text-muted text-sm font-medium">Continue your journey to viral growth.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-8 text-red-600 text-sm font-semibold flex items-center gap-3"
                        >
                            <div className="min-w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleEmailSignIn} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-muted ml-1 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-2xl bg-cream/50 border border-border-patreon text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5900]/10 focus:border-[#ff5900]/30 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1 text-xs font-bold text-muted uppercase tracking-wider">
                                <label>Password</label>
                                <Link href="/forgot-password" title="Forgot password?" className="text-[#ff5900] hover:underline transition-colors normal-case font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3.5 pr-12 rounded-2xl bg-cream/50 border border-border-patreon text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5900]/10 focus:border-[#ff5900]/30 transition-all font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-2xl font-bold text-white bg-linear-to-r from-[#ff5900] to-[#ffb800] shadow-[0_8px_20px_-4px_rgba(255,89,0,0.4)] hover:scale-[1.01] hover:shadow-[0_12px_30px_-6px_rgba(255,89,0,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>{isLoading ? "Signing In..." : "Sign In to Dashboard"}</span>
                                {!isLoading && <span>→</span>}
                            </div>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-10 flex items-center gap-4">
                        <div className="flex-1 h-px bg-border-patreon" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Or continue with</span>
                        <div className="flex-1 h-px bg-border-patreon" />
                    </div>

                    {/* Social Login */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-2xl border border-border-patreon flex items-center justify-center gap-3 hover:bg-cream/50 hover:border-gray-400 transition-all disabled:opacity-50 font-bold text-ink text-sm sm:text-base"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Google</span>
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-12 text-center">
                        <p className="text-muted font-medium text-sm">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-[#ff5900] font-bold hover:underline underline-offset-4 ml-1">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
