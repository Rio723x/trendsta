"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Coins } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PricingPage() {
    const plans = [
        {
            id: "silver",
            name: "Silver",
            price: "25",
            description: "Essential tools for creators starting out.",
            features: [
                "Dashboard Access",
                "Instagram Reels Insights",
                "Viral Script Generator",
                "Twitter Trends",
                "120 Stella Coins monthly"
            ],
            isPopular: false,
            haze: "bg-slate-400/20",
            buttonClass: "bg-linear-to-r from-slate-200 to-slate-400 text-slate-900 border-slate-300",
            accent: "text-slate-500",
            bgIcon: "bg-slate-400/10",
            iconColor: "text-slate-500"
        },
        {
            id: "gold",
            name: "Gold",
            price: "45",
            description: "For serious competitors who need data.",
            features: [
                "Everything in Silver",
                "Competitor Deep-Dive Analysis",
                "Priority Support",
                "220 Stella Coins monthly",
                "Market Sentiment Analysis"
            ],
            isPopular: true,
            haze: "bg-[#ff5900]/20",
            buttonClass: "bg-linear-to-r from-[#ff5900] to-[#ffb800] text-white",
            accent: "text-[#ff5900]",
            bgIcon: "bg-[#ff5900]/10",
            iconColor: "text-[#ff5900]"
        },
        {
            id: "platinum",
            name: "Platinum",
            price: "99",
            description: "Full AI power for agencies & pros.",
            features: [
                "Everything in Gold",
                "AI Consultant Access",
                "Deep Research Mode",
                "Scheduled WhatsApp Updates",
                "520 Stella Coins monthly"
            ],
            isPopular: false,
            haze: "bg-ink/20",
            buttonClass: "bg-linear-to-r from-[#1A1A1A] to-[#4A4A4A] text-white",
            accent: "text-ink",
            bgIcon: "bg-ink/10",
            iconColor: "text-ink"
        }
    ];

    const stellaCosts = [
        { action: "Dashboard Refresh", cost: "5 Stellas" },
        { action: "Competitor Scan", cost: "4-9 Stellas" },
        { action: "AI Consultant Query", cost: "2 Stellas" },
        { action: "Viral Script Gen", cost: "2 Stellas" },
    ];

    return (
        <main className="min-h-screen bg-cream text-ink font-body selection:bg-[#ff5900]/10 overflow-x-hidden">
            {/* Sticky Navbar */}
            <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
                <nav className="w-full max-w-7xl h-24 bg-white/70 backdrop-blur-xl border border-border-patreon rounded-full px-8 flex items-center justify-between shadow-sm transition-all duration-300">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image src="/T_logo.png" width={40} height={40} alt="Logo" className="rounded-xl group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-bold tracking-tight">Trendsta</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/signin" className="text-base font-semibold hover:text-[#ff5900] transition-colors">Sign In</Link>
                        <Link href="/signup" className="px-6 py-3 bg-linear-to-r from-[#ff5900] to-[#ffb800] text-white rounded-full text-base font-bold shadow-md hover:scale-105 transition-all">Start Free</Link>
                    </div>
                </nav>
            </div>

            {/* Header Section */}
            <section className="pt-40 pb-20 px-4 text-center">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff5900]/10 border border-[#ff5900]/20 rounded-full mb-8"
                    >
                        <Zap size={14} className="text-[#ff5900]" />
                        <span className="text-[11px] font-bold text-[#ff5900] uppercase tracking-wider">Pricing Plans</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-display font-normal text-ink mb-8 leading-[0.85] tracking-[-0.04em]"
                    >
                        Creators who stop <br />
                        <span className="text-[#ff5900] italic pr-2">guessing</span> — and win.
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-muted max-w-2xl mx-auto font-medium"
                    >
                        Choose the plan that fits your growth stage. From solo creators to massive scale agencies.
                    </motion.p>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className="pb-32 px-4">
                <div className="max-w-7xl mx-auto relative">
                    {/* Background glows */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#ff5900]/5 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {plans.map((plan, idx) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                className={`relative group p-8 lg:p-10 bg-white border ${plan.isPopular ? 'border-[#ff5900]/40 shadow-[0_20px_50px_-12px_rgba(255,89,0,0.15)]' : 'border-border-patreon shadow-sm'} rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 flex flex-col`}
                            >
                                {/* Haze UI Element */}
                                <div className={`absolute -inset-1 ${plan.haze} rounded-[2.6rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10`} />

                                {plan.isPopular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-linear-to-r from-[#ff5900] to-[#ffb800] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg z-20">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-8 relative z-10">
                                    <h3 className={`text-xl font-bold ${plan.accent} mb-2`}>{plan.name}</h3>
                                    <p className="text-sm text-muted font-medium leading-relaxed">{plan.description}</p>
                                </div>

                                <div className="mb-8 flex items-baseline gap-1 relative z-10">
                                    <span className="text-5xl font-display font-normal text-ink">${plan.price}</span>
                                    <span className="text-muted font-semibold text-sm">/mo</span>
                                </div>

                                <Link 
                                    href={`/signup?plan=${plan.id}`}
                                    className={`block w-full py-4 rounded-2xl text-center font-bold transition-all duration-300 mb-10 relative z-10 ${plan.buttonClass} shadow-md hover:shadow-lg hover:scale-[1.02]`}
                                >
                                    Get {plan.name}
                                </Link>

                                <div className="pt-8 border-t border-border-patreon space-y-4 flex-1 relative z-10">
                                    {plan.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-start gap-3">
                                            <div className={`mt-1 w-5 h-5 rounded-full ${plan.bgIcon} flex items-center justify-center shrink-0`}>
                                                <Check size={12} className={plan.iconColor} />
                                            </div>
                                            <span className="text-sm text-muted font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stella Coins Section */}
            <section className="pb-40 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white border border-border-patreon rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center gap-12">
                        {/* Decorative blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff5900]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        
                        <div className="relative z-10 flex-1 text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="w-16 h-16 bg-linear-to-br from-[#ff5900] to-[#ffb800] rounded-2xl mb-8 flex items-center justify-center shadow-lg transform rotate-12 mx-auto md:mx-0"
                            >
                                <Coins size={32} className="text-white" />
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-display font-normal text-ink mb-6">Need more power?</h2>
                            <p className="text-lg text-muted font-medium max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed">
                                Get Stella Coins for high-intensity AI tasks, custom script generations, and deep-dive audits.
                            </p>
                            
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <div className="px-3 py-1.5 rounded-lg bg-cream border border-border-patreon text-ink text-[10px] font-bold uppercase tracking-wider">Pay-as-you-go</div>
                                <div className="px-3 py-1.5 rounded-lg bg-cream border border-border-patreon text-ink text-[10px] font-bold uppercase tracking-wider">No Expiration</div>
                            </div>
                        </div>

                        <div className="w-full max-w-sm space-y-4 relative z-10">
                            {[
                                { amount: 500, price: 29, perk: "Growth Pack" },
                                { amount: 2000, price: 99, perk: "Agency Scale" }
                            ].map((coin, cIdx) => (
                                <div key={cIdx} className="p-6 bg-cream/30 border border-border-patreon rounded-3xl flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all duration-500">
                                    <div>
                                        <div className="text-xl font-bold text-ink">
                                            {coin.amount} <span className="text-[#ff5900] italic">Coins</span>
                                        </div>
                                        <div className="text-[10px] text-muted font-bold uppercase tracking-wider">{coin.perk}</div>
                                    </div>
                                    <Link 
                                        href="/checkout"
                                        className="px-6 py-2 bg-white border border-border-patreon rounded-full text-xs font-bold shadow-sm hover:border-[#ff5900] hover:text-[#ff5900] transition-all"
                                    >
                                        Buy ${coin.price}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Consumption Rates */}
            <section className="pb-40 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-ink mb-12">Usage Guide</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stellaCosts.map((item, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-white border border-border-patreon shadow-sm">
                                <div className="text-[#ff5900] font-bold text-xl mb-1">{item.cost.split(' ')[0]}</div>
                                <div className="text-[10px] text-muted font-bold uppercase tracking-widest">{item.action}</div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-12 text-sm text-muted font-medium italic">
                        * Research costs vary slightly based on niche complexity and data depth.
                    </p>
                </div>
            </section>

            {/* Footer Placeholder for visual consistency */}
            <footer className="py-20 border-t border-border-patreon bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <Image src="/T_logo.png" width={40} height={40} alt="Trendsta" />
                        <span className="text-2xl font-bold tracking-tight">Trendsta</span>
                    </div>
                    <p className="text-muted text-sm font-medium">© 2024 Trendsta. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
