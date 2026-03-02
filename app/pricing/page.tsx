"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Custom Stella Coin Icon
const StellaCoin = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
    <div
        className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 shadow-sm border border-amber-600/20 ${className}`}
        style={{ width: size, height: size }}
    >
        <div className="absolute inset-[10%] rounded-full border border-amber-200/50" />
        <span className="text-[10px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] select-none">T</span>
    </div>
);

function ShutterReveal({ children, bgColor = "#fafafa" }: { children: React.ReactNode, bgColor?: string }) {
    return (
        <div className="relative inline-flex overflow-hidden pb-2">
            <motion.div
                initial={{ y: 0 }}
                whileInView={{ y: "-100%" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="absolute top-0 left-0 right-0 h-1/2 z-20"
                style={{ backgroundColor: bgColor }}
            />
            <motion.div
                initial={{ y: 0 }}
                whileInView={{ y: "100%" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="absolute bottom-0 left-0 right-0 h-1/2 z-20"
                style={{ backgroundColor: bgColor }}
            />
            <motion.div
                initial={{ x: 0 }}
                whileInView={{ x: "-100%" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="absolute top-0 bottom-0 left-0 w-1/2 z-20"
                style={{ backgroundColor: bgColor }}
            />
            <motion.div
                initial={{ x: 0 }}
                whileInView={{ x: "100%" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="absolute top-0 bottom-0 right-0 w-1/2 z-20"
                style={{ backgroundColor: bgColor }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                viewport={{ once: true, margin: "-50px" }}
                className="relative z-10"
            >
                {children}
            </motion.div>
        </div>
    );
}

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const features = {
        core: [
            "Dashboard Access",
            "Instagram Reels Insights",
            "Viral Script Generator",
            "Twitter Trends"
        ],
        gold: [
            "Competitor Deep-Dive Analysis",
            "Priority Support"
        ],
        platinum: [
            "AI Consultant Access (2 Stellas/prompt)",
            "Deep Research Mode",
            "Scheduled Daily WhatsApp/Mail Updates",
            "Early Access to Beta Features"
        ]
    };

    const stellaCosts = [
        { action: "Dashboard Refresh", cost: "5 Stellas" },
        { action: "Competitor Scan", cost: "4-9 Stellas*" },
        { action: "AI Consultant Query", cost: "2 Stellas (Plat. Only)" },
        { action: "Viral Script Gen", cost: "2 Stellas" },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-orange-200 relative overflow-hidden">
            {/* Background Effects - Enhanced for Light Mode */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-orange-500/5 rounded-full blur-[120px] opacity-70" />
                <div className="absolute top-[20%] right-0 w-[40%] h-[40%] bg-gray-400/10 rounded-full blur-[100px] opacity-60" />
            </div>

            {/* Navbar - Centered Logo */}
            <nav className="relative z-50 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex-1">
                    <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors tracking-wide uppercase">
                        Home
                    </Link>
                </div>

                <div className="flex-1 flex justify-center">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/T_logo.png" width={40} height={40} className="h-10 w-auto" alt="Trendsta" />
                        <span className="text-2xl font-black tracking-[-0.05em] font-sans text-gray-900 uppercase">TRENDSTA</span>
                    </Link>
                </div>

                <div className="flex-1 flex justify-end">
                    <Link href="/dashboard" className="px-5 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg text-sm font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                        Go to Dashboard
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 pt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-20 flex flex-col items-center">

                    <ShutterReveal bgColor="#fafafa">
                        <h1 className="text-5xl md:text-7xl lg:text-[90px] leading-[0.85] font-bold tracking-[-0.06em] font-mono text-gray-900 uppercase">
                            Choose your power level.
                        </h1>
                    </ShutterReveal>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-2xl font-medium text-gray-600 leading-tight max-w-2xl mt-8"
                    >
                        Detailed analytics, AI consulting, and viral scripts tailored to your niche.
                        <br className="hidden md:block" /> Unlock more capabilities with Stellas.
                    </motion.p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">

                    {/* SILVER */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative group h-full"
                    >
                        <div className="absolute -inset-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl blur-xl pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(148, 163, 184, 0.4), transparent 70%)' }} />
                        <div className="relative h-full p-8 bg-white border border-black/10 rounded-3xl flex flex-col hover:border-black/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="mb-8">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-6">
                                    <ShieldCheck className="text-gray-600" size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Silver</h3>
                                <p className="text-gray-500 text-sm">Essential tools for creators starting out.</p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900">$25</span>
                                <span className="text-gray-500">/mo</span>
                            </div>

                            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-black/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-600 font-medium text-sm">Stella Balance</span>
                                    <span className="text-amber-600 font-bold flex items-center gap-1">
                                        <StellaCoin size={16} /> 120
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-gray-400 w-[20%] h-full" />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 text-right">Refreshes monthly</p>
                                <p className="text-[10px] text-gray-500 mt-1 font-medium bg-white py-1 px-2 rounded-md inline-block border border-black/5">Research Cost: 4-7 Stellas</p>
                            </div>

                            <div className="space-y-4 flex-1 mb-8">
                                <p className="text-xs font-bold text-gray-500 uppercase">Includes</p>
                                {features.core.map((feat, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm text-gray-700">
                                        <Check size={16} className="text-gray-400 mt-0.5" />
                                        <span>{feat}</span>
                                    </div>
                                ))}
                                <div className="flex items-start gap-3 text-sm text-gray-400 line-through">
                                    <Check size={16} />
                                    <span>Competitor Analysis</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-gray-400 line-through">
                                    <Check size={16} />
                                    <span>AI Consultant</span>
                                </div>
                            </div>

                            <button
                                className="w-full py-4 rounded-xl bg-white text-gray-900 font-bold text-sm hover:bg-gray-50 transition-all border border-gray-300">
                                Get Silver
                            </button>
                        </div>
                    </motion.div>

                    {/* GOLD */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="relative group h-full"
                    >
                        <div className="absolute -inset-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl blur-xl pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.3), transparent 70%)' }} />
                        <div className="relative h-full p-8 bg-white border border-amber-200 rounded-3xl flex flex-col hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="mb-8">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-6">
                                    <Crown className="text-amber-600" size={24} fill="currentColor" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gold</h3>
                                <p className="text-gray-500 text-sm">For serious competitors who need data.</p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-gray-900">$45</span>
                                <span className="text-gray-500">/mo</span>
                            </div>

                            <div className="mb-8 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-amber-900 font-medium text-sm">Stella Balance</span>
                                    <span className="text-amber-600 font-bold flex items-center gap-1">
                                        <StellaCoin size={16} /> 220
                                    </span>
                                </div>
                                <div className="w-full bg-amber-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 w-[45%] h-full" />
                                </div>
                                <p className="text-[10px] text-amber-700/70 mt-2 text-right">Enough for 15+ Competitor Scans</p>
                                <p className="text-[10px] text-amber-800/60 mt-1 font-medium bg-white py-1 px-2 rounded-md inline-block border border-amber-100">Research Cost: 6-9 Stellas</p>
                            </div>

                            <div className="space-y-4 flex-1 mb-8">
                                <p className="text-xs font-bold text-gray-500 uppercase">Everything in Silver, plus</p>
                                {features.gold.map((feat, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm text-gray-800">
                                        <Check size={16} className="text-amber-500 mt-0.5" />
                                        <span>{feat}</span>
                                    </div>
                                ))}
                                <div className="flex items-start gap-3 text-sm text-gray-400 line-through">
                                    <Check size={16} />
                                    <span>AI Consultant</span>
                                </div>
                            </div>

                            <button
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-amber-500/20">
                                Get Gold
                            </button>
                        </div>
                    </motion.div>

                    {/* PLATINUM */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="relative group scale-105 z-10 h-full"
                    >
                        <div className="absolute -inset-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl blur-xl pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.4), transparent 70%)' }} />
                        <div className="relative h-full p-8 bg-white border border-black/10 rounded-3xl flex flex-col hover:border-black/20 transition-all duration-300 shadow-2xl hover:-translate-y-1">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide shadow-md">
                                Best Seller
                            </div>
                            <div className="mb-8">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-6">
                                    <Zap className="text-gray-900" size={24} fill="currentColor" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Platinum</h3>
                                <p className="text-gray-500 text-sm">Full AI power for agencies & pros.</p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-gray-900">$99</span>
                                <span className="text-gray-500">/mo</span>
                            </div>

                            <div className="mb-8 p-4 bg-gray-100/50 rounded-xl border border-black/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-900 font-medium text-sm">Stella Balance</span>
                                    <span className="text-amber-600 font-bold flex items-center gap-1">
                                        <StellaCoin size={16} /> 520
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-gray-900 w-[100%] h-full" />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 text-right">Massive capacity for daily use</p>
                                <p className="text-[10px] text-gray-600 mt-1 font-medium bg-white py-1 px-2 rounded-md inline-block border border-black/5">Deep Research: 6-9 Stellas</p>
                            </div>

                            <div className="space-y-4 flex-1 mb-8">
                                <p className="text-xs font-bold text-gray-500 uppercase">Everything in Gold, plus</p>
                                {features.platinum.map((feat, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm text-gray-800">
                                        <Check size={16} className="text-gray-900 mt-0.5" />
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-all border border-gray-900 hover:shadow-lg">
                                Get Platinum
                            </button>
                        </div>
                    </motion.div>

                </div>

                {/* Stella Explanation Strip (Reordered & Redesigned) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="max-w-5xl mx-auto mb-24 rounded-3xl bg-white border border-black/10 shadow-xl relative overflow-hidden"
                >
                    {/* Decorative Background Mesh */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-400/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3" />

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl md:text-4xl font-black tracking-[-0.05em] font-mono uppercase text-gray-900 mb-4 flex items-center justify-center md:justify-start gap-4">
                                <StellaCoin size={36} />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 mt-1">Stellas</span>
                            </h3>
                            <p className="text-gray-600 text-base leading-relaxed mb-8">
                                Trendsta isn't just a dashboard; it's an intelligent agent. Stellas are the specialized tokens that fuel our AI's most advanced capabilities.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <div className="px-3 py-1.5 rounded-lg bg-gray-100 border border-black/5 text-gray-600 text-xs font-semibold">Pay-as-you-go</div>
                                <div className="px-3 py-1.5 rounded-lg bg-gray-100 border border-black/5 text-gray-600 text-xs font-semibold">Rollover Credits</div>
                                <div className="px-3 py-1.5 rounded-lg bg-gray-100 border border-black/5 text-gray-600 text-xs font-semibold">No Expiration</div>
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-sm bg-white rounded-2xl p-6 border border-black/10 shadow-sm">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-black/5 pb-2">Consumption Rates</p>
                            <div className="space-y-3">
                                {stellaCosts.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-amber-500 transition-colors" />
                                            <span className="text-gray-700 text-sm font-medium">{item.action}</span>
                                        </div>
                                        <span className="font-mono text-amber-600 text-xs font-bold">{item.cost}</span>
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t border-black/5 text-[10px] text-gray-400 italic">
                                    * Research costs vary by plan (Silver: 4-7, Gold/Platinum: 6-9)
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bundle Section */}
                <div className="mt-24 max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Running Low on Stellas?</h2>
                        <p className="text-gray-600">Top up your balance instantly. <span className="font-semibold text-amber-600">Bundles available for active subscribers only.</span></p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Bundle 1 */}
                        <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                            <div className="mb-4">
                                <StellaCoin size={48} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Small</h3>
                            <p className="text-gray-500 text-xs mb-4">100 Stellas</p>
                            <div className="text-2xl font-bold text-gray-900 mb-6">$29</div>
                            <button
                                className="w-full py-2 rounded-lg bg-white border border-black/10 text-gray-900 font-bold text-sm hover:bg-gray-50 transition-all">
                                Buy Bundle
                            </button>
                        </div>

                        {/* Bundle 2 */}
                        <div className="bg-gradient-to-b from-amber-50 to-white p-6 rounded-2xl border border-amber-200 shadow-md flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">BEST VALUE</div>
                            <div className="mb-4 relative">
                                <StellaCoin size={56} />
                                <StellaCoin size={24} className="absolute -bottom-1 -right-2" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Growth</h3>
                            <p className="text-amber-700 text-xs mb-4">300 Stellas</p>
                            <div className="text-2xl font-bold text-gray-900 mb-6">$69</div>
                            <button
                                className="w-full py-2 rounded-lg bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20">
                                Buy Bundle
                            </button>
                        </div>

                        {/* Bundle 3 */}
                        <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                            <div className="mb-4 relative">
                                <StellaCoin size={48} />
                                <StellaCoin size={32} className="absolute -top-2 -right-4" />
                                <StellaCoin size={20} className="absolute bottom-0 -left-2" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Pro</h3>
                            <p className="text-gray-500 text-xs mb-4">600 Stellas</p>
                            <div className="text-2xl font-bold text-gray-900 mb-6">$119</div>
                            <button
                                className="w-full py-2 rounded-lg bg-white border border-black/10 text-gray-900 font-bold text-sm hover:bg-gray-50 transition-all">
                                Buy Bundle
                            </button>
                        </div>
                    </div>
                </div>

                {/* FAQ or Trust */}
                <div className="mt-24 text-center border-t border-black/10 pt-12">
                    <p className="text-gray-500 text-sm">Need a custom enterprise plan? <a href="mailto:info@trendsta.in" className="text-blue-600 font-medium underline underline-offset-4 hover:text-blue-700 transition-all">info@trendsta.in</a></p>
                </div>

            </main>
        </div>
    );
}
