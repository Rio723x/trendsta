"use client";

import { authClient, useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, TrendingUp, Zap } from "lucide-react";

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
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Panel - Illustration & Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 relative overflow-hidden items-center justify-center p-12">
                {/* Background Decorations - Faded Graphs & Stats */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {/* Blurred shapes */}
                    <div className="absolute top-[10%] left-[5%] w-48 h-48 bg-blue-200/40 rounded-full blur-3xl" />
                    <div className="absolute bottom-[15%] right-[10%] w-64 h-64 bg-indigo-200/50 rounded-full blur-3xl" />
                    <div className="absolute top-[40%] right-[20%] w-32 h-32 bg-violet-200/30 rounded-full blur-2xl" />

                    {/* Faded Graph 1 - Bar Chart */}
                    <svg className="absolute top-[8%] left-[8%] w-48 h-32 opacity-[0.08]" viewBox="0 0 200 100">
                        <rect x="10" y="60" width="20" height="40" fill="currentColor" className="text-blue-600" />
                        <rect x="40" y="40" width="20" height="60" fill="currentColor" className="text-blue-600" />
                        <rect x="70" y="20" width="20" height="80" fill="currentColor" className="text-blue-600" />
                        <rect x="100" y="50" width="20" height="50" fill="currentColor" className="text-blue-600" />
                        <rect x="130" y="30" width="20" height="70" fill="currentColor" className="text-blue-600" />
                        <rect x="160" y="10" width="20" height="90" fill="currentColor" className="text-blue-600" />
                    </svg>

                    {/* Faded Graph 2 - Line Chart */}
                    <svg className="absolute bottom-[25%] right-[8%] w-56 h-36 opacity-[0.08]" viewBox="0 0 200 100">
                        <polyline
                            points="10,80 40,60 70,70 100,40 130,50 160,20 190,30"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-blue-600"
                        />
                        <circle cx="10" cy="80" r="4" fill="currentColor" className="text-blue-600" />
                        <circle cx="40" cy="60" r="4" fill="currentColor" className="text-blue-600" />
                        <circle cx="70" cy="70" r="4" fill="currentColor" className="text-blue-600" />
                        <circle cx="100" cy="40" r="4" fill="currentColor" className="text-blue-600" />
                        <circle cx="130" cy="50" r="4" fill="currentColor" className="text-blue-600" />
                        <circle cx="160" cy="20" r="4" fill="currentColor" className="text-blue-600" />
                        <circle cx="190" cy="30" r="4" fill="currentColor" className="text-blue-600" />
                    </svg>

                    {/* Faded Graph 3 - Pie Chart */}
                    <svg className="absolute top-[55%] left-[5%] w-40 h-40 opacity-[0.06]" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="20" strokeDasharray="75 175" className="text-blue-600" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="20" strokeDasharray="50 200" strokeDashoffset="-75" className="text-indigo-500" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="20" strokeDasharray="40 210" strokeDashoffset="-125" className="text-violet-400" />
                    </svg>

                    {/* Faded Stats Cards */}
                    <div className="absolute top-[18%] right-[12%] bg-white/5 backdrop-blur-sm rounded-xl p-4 opacity-[0.12] border border-blue-200/20">
                        <div className="text-blue-600 text-xs font-medium mb-1">Engagement</div>
                        <div className="text-blue-800 text-2xl font-bold">+247%</div>
                        <div className="flex items-center gap-1 mt-1">
                            <TrendingUp size={12} className="text-emerald-500" />
                            <span className="text-emerald-600 text-xs">↑ 12.5%</span>
                        </div>
                    </div>

                    <div className="absolute bottom-[45%] right-[5%] bg-white/5 backdrop-blur-sm rounded-xl p-4 opacity-[0.10] border border-blue-200/20">
                        <div className="text-blue-600 text-xs font-medium mb-1">Views</div>
                        <div className="text-blue-800 text-2xl font-bold">1.2M</div>
                        <div className="flex items-center gap-1 mt-1">
                            <TrendingUp size={12} className="text-emerald-500" />
                            <span className="text-emerald-600 text-xs">↑ 8.3%</span>
                        </div>
                    </div>

                    <div className="absolute bottom-[12%] left-[15%] bg-white/5 backdrop-blur-sm rounded-xl p-4 opacity-[0.10] border border-blue-200/20">
                        <div className="text-blue-600 text-xs font-medium mb-1">Followers</div>
                        <div className="text-blue-800 text-2xl font-bold">52.4K</div>
                        <div className="flex items-center gap-1 mt-1">
                            <TrendingUp size={12} className="text-emerald-500" />
                            <span className="text-emerald-600 text-xs">↑ 23.1%</span>
                        </div>
                    </div>

                    {/* Faded Graph 4 - Area Chart */}
                    <svg className="absolute top-[35%] left-[25%] w-44 h-28 opacity-[0.05]" viewBox="0 0 200 100">
                        <defs>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0,100 L0,70 Q25,50 50,55 T100,35 T150,45 T200,25 L200,100 Z"
                            fill="url(#areaGradient)"
                            className="text-blue-600"
                        />
                        <path
                            d="M0,70 Q25,50 50,55 T100,35 T150,45 T200,25"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-blue-600"
                        />
                    </svg>

                    {/* Sparkle decorations */}
                    <Sparkles className="absolute top-[15%] right-[35%] text-indigo-400/40" size={24} />
                    <Sparkles className="absolute bottom-[35%] left-[30%] text-blue-400/30" size={16} />
                    <Zap className="absolute top-[70%] right-[25%] text-indigo-500/30" size={20} />
                </div>

                {/* Content - Centered Logo */}
                <div className="relative z-10 text-center max-w-md flex flex-col items-center">
                    {/* Centered Logo */}
                    <div className="mb-12">
                        <Image src="/logo3.png" alt="Trendsta" width={200} height={67} className="h-16 w-auto" />
                    </div>

                    <h2 className="text-3xl font-bold text-slate-800 mb-4">
                        Discover What's <span className="text-orange-500">Trending</span>
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                        Join thousands of creators using AI-powered insights to stay ahead of the curve and create viral content.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Image src="/logo3.png" alt="Trendsta" width={150} height={50} />
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                        <p className="text-slate-500">Sign in to access your dashboard.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailSignIn} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "SIGNING IN..." : "SIGN IN"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="px-4 text-sm text-slate-400 uppercase tracking-wider">Or</span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    {/* Social Login */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-10 text-center">
                        <p className="text-slate-500">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-orange-500 font-bold hover:text-orange-600 transition-colors">
                                SIGN UP
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
