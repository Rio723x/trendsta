"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValueEvent,
  useSpring
} from "framer-motion";
import {
  TrendingUp,
  ChevronRight,
  BarChart3,
  FileText,
  Instagram,
  Menu,
  X,
  Play,
  Zap,
  CheckCircle2,
  Rocket,
  ArrowRight,
  Cpu,
  Twitter, // Added Twitter
} from "lucide-react";
import Image from "next/image";

// --- Components ---

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#0B0F19]/80 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/T_logo.png"
                width={32}
                height={32}
                alt="Trendsta"
              />
              <span className="text-2xl font-bold text-white tracking-tight">Trendsta</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "/pricing" },
                { label: "FAQ", href: "#faq" },
                { label: "Contact", href: "mailto:info@trendsta.in" }
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA - Removed */}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed inset-x-0 top-20 bg-[#0B0F19]/95 backdrop-blur-xl z-40 border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-6">
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "/pricing" },
                { label: "FAQ", href: "#faq" },
                { label: "Contact", href: "mailto:info@trendsta.in" }
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-medium text-slate-300 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/onboarding"
                className="block w-full text-center px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Smooth out the raw scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax transforms for floating elements using smoothProgress
  const yLeft1 = useTransform(smoothProgress, [0, 1], [0, -200]);
  const xLeft1 = useTransform(smoothProgress, [0, 1], [0, -150]);

  const yLeft2 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const xLeft2 = useTransform(smoothProgress, [0, 1], [0, -100]);

  const yRight1 = useTransform(smoothProgress, [0, 1], [0, -200]);
  const xRight1 = useTransform(smoothProgress, [0, 1], [0, 150]);

  const yRight2 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const xRight2 = useTransform(smoothProgress, [0, 1], [0, 100]);

  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative min-h-[140vh] pt-32 pb-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[100vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0B0F19] to-[#0B0F19] -z-10 pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] -z-10" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-violet-300 text-sm font-medium mb-8 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            New: 24/7 Content Intelligence Engine
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400">
              Your Personal AI Consultant
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              for Content Growth.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing. Leverage real-time trend data and AI analysis to script high-performing content that resonates with your audience.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a
              href="/onboarding"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all hover:scale-105 active:scale-95 text-lg"
            >
              Get Started
            </a>
            <a
              href="/dashboard"
              className="px-8 py-4 bg-white/5 text-white font-semibold rounded-full border border-white/10 hover:bg-white/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              View Demo <ChevronRight size={18} />
            </a>
          </div>
        </motion.div>

        {/* Main Dashboard Visual + Floating Elements */}
        <div className="relative max-w-5xl mx-auto mt-12 perspective-1000">

          {/* Central Dashboard Mockup */}
          <motion.div
            style={{ scale }}
            className="relative z-20 rounded-xl overflow-hidden shadow-[0_0_100px_rgba(124,58,237,0.15)] border border-white/10 bg-[#131625]"
          >
            {/* Mock Dashboard UI Top Bar */}
            <div className="h-10 bg-[#1A1D2D] border-b border-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="mx-auto w-1/3 h-5 bg-white/5 rounded text-[10px] flex items-center justify-center text-slate-500">
                trendsta.app/dashboard
              </div>
            </div>
            {/* Dashboard Content Mock */}
            <div className="relative aspect-video bg-[#0B0F19] p-6 flex flex-col gap-6 font-sans text-left">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Analytics Dashboard</h2>
                <p className="text-xs text-slate-500">Analysis based on research from Saturday, Jan 31, 2026</p>
              </div>

              {/* Top Stats Row */}
              <div className="grid grid-cols-4 gap-4">
                {/* Card 1 */}
                <div className="bg-[#131625] rounded-xl p-4 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors" />
                  <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-2">Best Time to Post</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-white">10:00 AM</span>
                    <span className="text-xs text-slate-500">(2 PM)</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-green-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>High Engagement Window</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-[#131625] rounded-xl p-4 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
                  <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-2">Target Pace</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-white">190-200</span>
                    <span className="text-xs text-slate-500">WPM</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-purple-400">
                    <Zap size={10} fill="currentColor" />
                    <span>High Energy Required</span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-[#131625] rounded-xl p-4 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-colors" />
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2">Top Viral Trigger</p>
                  <div className="text-lg font-bold text-white mb-2 leading-tight">The 'Hidden Enemy'</div>
                  <div className="flex items-center gap-1 text-[10px] text-rose-400">
                    <TrendingUp size={10} />
                    <span>VS Competitor</span>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-[#131625] rounded-xl p-4 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2">Content Gap</p>
                  <div className="text-lg font-bold text-white mb-2 leading-tight">AI Ethics & Danger</div>
                  <div className="flex items-center gap-1 text-[10px] text-blue-400 truncate">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Cover the 'Dark Side' of AI...</span>
                  </div>
                </div>
              </div>

              {/* Bottom Charts Row */}
              <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
                {/* Viral Sweet Spot Chart */}
                <div className="col-span-8 bg-[#131625] rounded-xl p-4 border border-white/5 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Viral Sweet Spot</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Your viral content is significantly faster (194+ WPM) and longer (60s+) than the niche average.
                    </p>
                  </div>

                  <div className="flex-1 flex items-end justify-between gap-8 px-4 pb-2 border-b border-white/5 relative">
                    {/* Y-Axis Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                      <div className="border-t border-white/10 w-full" />
                      <div className="border-t border-white/10 w-full" />
                      <div className="border-t border-white/10 w-full" />
                    </div>

                    {/* Duration Group */}
                    <div className="flex items-end gap-2 h-full w-full justify-center">
                      <div className="w-10 bg-indigo-500 rounded-t-sm h-[60%] relative group">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity">65s</span>
                      </div>
                      <div className="w-10 bg-indigo-400/50 rounded-t-sm h-[40%] relative group">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">45s</span>
                      </div>
                      <div className="w-10 bg-slate-700/50 rounded-t-sm h-[50%] relative group">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">50s</span>
                      </div>
                    </div>

                    {/* Pace Group */}
                    <div className="flex items-end gap-2 h-full w-full justify-center">
                      <div className="w-10 bg-indigo-500 rounded-t-sm h-[85%] relative group">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity">210</span>
                      </div>
                      <div className="w-10 bg-indigo-400/50 rounded-t-sm h-[60%] relative group">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">180</span>
                      </div>
                      <div className="w-10 bg-slate-700/50 rounded-t-sm h-[45%] relative group">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">150</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 mt-2 px-8">
                    <span>DURATION (SEC)</span>
                    <span>PACE (WPM)</span>
                  </div>
                  <div className="flex justify-center gap-4 mt-2 text-[9px]">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500" /> You</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-400/50" /> Comp</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-700/50" /> Avg</span>
                  </div>
                </div>

                {/* Hook Leaderboard */}
                <div className="col-span-4 bg-[#131625] rounded-xl p-4 border border-white/5 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Hook Leaderboard</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Controversial questions are driving highest engagement.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 justify-center flex-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-white">
                        <span>Controversial Question</span>
                        <span>98%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-700/30 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[98%]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-slate-300">
                        <span>Direct Benefit</span>
                        <span>75%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-700/30 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500/50 w-[75%]" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-slate-300">
                        <span>Tech Urgency</span>
                        <span>60%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-700/30 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-600 w-[60%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Window 1 (Left Top) - Consistency vs Viral */}
          <motion.div
            style={{ x: xLeft1, y: yLeft1 }}
            className="absolute -top-12 -left-20 w-72 bg-[#131625]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl z-10 hidden md:block"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <BarChart3 size={14} />
              </div>
              <div className="text-[10px] font-bold text-white uppercase tracking-wider">Consistency vs Viral</div>
            </div>

            <div className="flex justify-between items-end h-28 px-2 gap-3">
              {/* Legend/Y-axis hidden for clean look, focus on bars */}

              {/* Bar 1: You */}
              <div className="w-full flex flex-col h-full justify-end group cursor-pointer">
                <div className="h-6 bg-slate-300/20 w-full rounded-t-sm relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Underperform</div>
                </div>
                <div className="h-8 bg-indigo-500 w-full" />
                <div className="h-10 bg-emerald-500 w-full rounded-b-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                <p className="text-[9px] text-center mt-2 text-white font-medium">You</p>
              </div>

              {/* Bar 2: Competitors */}
              <div className="w-full flex flex-col h-full justify-end group opacity-60 hover:opacity-100 transition-opacity">
                <div className="h-10 bg-slate-300/20 w-full rounded-t-sm" />
                <div className="h-10 bg-indigo-500 w-full" />
                <div className="h-4 bg-emerald-500 w-full rounded-b-sm" />
                <p className="text-[9px] text-center mt-2 text-slate-400">Comp</p>
              </div>

              {/* Bar 3: Niche Avg */}
              <div className="w-full flex flex-col h-full justify-end group opacity-40 hover:opacity-100 transition-opacity">
                <div className="h-8 bg-slate-300/20 w-full rounded-t-sm" />
                <div className="h-12 bg-indigo-500 w-full" />
                <div className="h-4 bg-emerald-500 w-full rounded-b-sm" />
                <p className="text-[9px] text-center mt-2 text-slate-400">Avg</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Window 2 (Left Bottom) - Content Diet */}
          <motion.div
            style={{ x: xLeft2, y: yLeft2 }}
            className="absolute -bottom-20 -left-12 w-64 bg-[#131625]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl z-30 hidden md:block"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center text-orange-400">
                <FileText size={14} />
              </div>
              <div className="text-[10px] font-bold text-white uppercase tracking-wider">Content Diet</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                {/* CSS Conic Gradient for Donut Chart: Blue 55%, Green 30%, Orange 15% */}
                <div className="w-full h-full rounded-full" style={{ background: 'conic-gradient(#6366f1 0% 55%, #10b981 55% 85%, #f59e0b 85% 100%)' }} />
                <div className="absolute inset-3 bg-[#131625] rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-slate-400">100%</span>
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-[9px] text-slate-300 leading-tight">News / Deep Dives</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] text-slate-300 leading-tight">Hacks / Tutorials</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[9px] text-slate-300 leading-tight">Controversial</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Window 3 (Right Top) - Topic Gaps */}
          <motion.div
            style={{ x: xRight1, y: yRight1 }}
            className="absolute -top-24 -right-24 w-72 bg-[#131625]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl z-10 hidden md:block"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded bg-violet-500/20 flex items-center justify-center text-violet-400">
                <Zap size={14} />
              </div>
              <div className="text-[10px] font-bold text-white uppercase tracking-wider">Topic Gaps</div>
            </div>
            <p className="text-[9px] text-slate-400 mb-4 leading-relaxed">
              High viral potential in 'AI Privacy' & 'Chinese Tech'.
            </p>

            <div className="relative h-28 border-l border-b border-white/10 w-full">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-rows-4 w-full h-full pointer-events-none opacity-10">
                <div className="border-t border-dashed border-white w-full" />
                <div className="border-t border-dashed border-white w-full" />
                <div className="border-t border-dashed border-white w-full" />
                <div className="border-t border-dashed border-white w-full" />
              </div>

              {/* Scatter Points */}
              <div className="absolute left-[20%] bottom-[65%] group cursor-pointer">
                <div className="w-3 h-3 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(167,139,250,0.6)] animate-pulse" />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-violet-600 text-[8px] px-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">AI Privacy</div>
              </div>

              <div className="absolute left-[45%] bottom-[80%] group cursor-pointer">
                <div className="w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]" />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-[8px] px-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">China Tech</div>
              </div>

              <div className="absolute left-[70%] bottom-[30%] opacity-40">
                <div className="w-2 h-2 bg-slate-500 rounded-full" />
              </div>

              {/* Axis Labels */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] text-slate-500 tracking-wider">POTENTIAL</div>
              <div className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 text-[8px] text-slate-500 tracking-wider">COMPETITION</div>
            </div>
          </motion.div>

          {/* Floating Window 4 (Right Bottom) - Topic Dominance */}
          <motion.div
            style={{ x: xRight2, y: yRight2 }}
            className="absolute -bottom-16 -right-16 w-80 bg-[#131625]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl z-30 hidden md:block"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-pink-500/20 flex items-center justify-center text-pink-400">
                <TrendingUp size={14} />
              </div>
              <div className="text-[10px] font-bold text-white uppercase tracking-wider">Topic Dominance</div>
            </div>

            <div className="grid grid-cols-12 gap-1 h-32 w-full rounded-lg overflow-hidden border border-white/5">
              {/* Block 1: Republic Day (Big) */}
              <div className="col-span-5 bg-purple-600 hover:bg-purple-500 transition-colors p-2 flex flex-col justify-end group cursor-pointer">
                <p className="text-[10px] font-bold text-white leading-tight">Republic Day</p>
                <p className="text-[9px] text-purple-200">673k</p>
              </div>

              {/* Column for rest */}
              <div className="col-span-7 grid grid-rows-2 gap-1">
                <div className="grid grid-cols-2 gap-1">
                  <div className="bg-indigo-500 hover:bg-indigo-400 transition-colors p-2 flex flex-col justify-end">
                    <p className="text-[9px] font-bold text-white leading-tight">Claudebot</p>
                    <p className="text-[8px] text-indigo-200">439k</p>
                  </div>
                  <div className="bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors p-2 flex flex-col justify-end">
                    <p className="text-[9px] font-bold text-white leading-tight">AirLLM</p>
                    <p className="text-[8px] text-fuchsia-200">367k</p>
                  </div>
                </div>
                {/* Bottom row */}
                <div className="bg-violet-500 hover:bg-violet-400 transition-colors p-2 flex flex-col justify-end">
                  <p className="text-[10px] font-bold text-white leading-tight">Marriage vs Career</p>
                  <p className="text-[9px] text-violet-200">758k</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const logos = [
    { Icon: Instagram, name: "Instagram" },
    { Icon: Twitter, name: "Twitter / X" },
  ];

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold tracking-widest text-slate-500 uppercase mb-8">
          Optimized for Growth on
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, i) => (
            <div key={i} className="flex items-center gap-2 group cursor-pointer hover:opacity-100 transition-opacity">
              <logo.Icon className="text-white group-hover:text-white transition-colors" size={24} />
              <span className="font-semibold text-lg text-slate-300 group-hover:text-white transition-colors">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCaseTabs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("Script Ideas");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const tabs = [
    { id: "Script Ideas", label: "Script Ideas", color: "from-purple-500 to-pink-500", icon: FileText },
    { id: "Competitor Analysis", label: "Competitor Analysis", color: "from-orange-500 to-red-500", icon: BarChart3 },
    { id: "Dynamic AI Insights", label: "Dynamic AI Insights", color: "from-blue-500 to-cyan-500", icon: Zap },
  ];

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (latest < 0.33) {
      setActiveTab("Script Ideas");
    } else if (latest < 0.66) {
      setActiveTab("Competitor Analysis");
    } else {
      setActiveTab("Dynamic AI Insights");
    }
  });

  const content = {
    "Script Ideas": {
      title: "Never Run Out of Content",
      desc: "Generate unlimited high-performing scripts based on real-time trends. Our AI structures hooks, body, and CTA for maximum retention.",
      features: ["Viral Hook Templates", "Niche-Specific Scripts", "Topic Dominance"],
      image: "/landing/script-ideas-new.png"
    },
    "Competitor Analysis": {
      title: "Reverse Engineer Success",
      desc: "Track the top creators in your niche. Understand exactly why their videos go viral and replicate their strategies with precision.",
      image: "/landing/competitor-analysis-preview.png",
      features: [
        "Audio Trend Tracking",
        "Format Breakdown",
        "Engagement Benchmarks"
      ]
    },
    "Dynamic AI Insights": {
      title: "Your 24/7 Growth Strategist",
      desc: "Get personalized, data-backed recommendations. Our AI Consultant analyzes your metrics to tell you exactly what to post next.",
      features: ["Growth Forecasting", "Content Gap Analysis", "Real-time Feedback"],
      image: "/landing/dynamic-ai-insights.png"
    }
  } as any;

  return (
    <section id="features" ref={containerRef} className="h-[300vh] relative bg-[#0B0F19]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Use Trendsta for <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">{activeTab}</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4 relative">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 border ${activeTab === tab.id
                    ? "text-black border-white"
                    : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-white rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[450px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="text-3xl font-bold text-white mb-6">{content[activeTab].title}</h3>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                  {content[activeTab].desc}
                </p>
                <ul className="space-y-4 mb-8">
                  {content[activeTab].features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br ${tabs.find(t => t.id === activeTab)?.color}`}>
                        <CheckCircle2 size={14} className="text-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all group"
                >
                  Start creating now <ArrowRight size={18} className="group-hover:text-violet-400 transition-colors" />
                </a>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-img`}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-pink-600/20 rounded-2xl blur-2xl -z-10" />
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#131625] shadow-2xl">
                  <Image
                    src={content[activeTab].image}
                    alt={activeTab}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunityGrid() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "I like to describe it as \"steroids for my content strategy.\" Trendsta's insights enable us to spot trends before they peak. It's indispensable.",
      author: "Sarah Jenkins",
      role: "Head of Growth, Viral Inc.",
      image: "/sarah_headshot.png"
    },
    {
      quote: "Trendsta has completely changed how we approach viral content. The AI Consultant is like having a senior strategist on call 24/7.",
      author: "Marcus Chen",
      role: "Founder, SocialBoost",
      image: "/marcus_headshot.png"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Duplicating items for infinite scroll loop
  const column1 = [
    { src: "/landing/dashboard-analytics.png", height: "h-64" },
    { src: "/landing/script-ideas.png", height: "h-48" },
    { src: "/landing/twitter-insights.png", height: "h-64" },
    { src: "/landing/content-strategy.png", height: "h-48" },
  ];

  const column2 = [
    { src: "/landing/execution-plan.png", height: "h-48" },
    { src: "/landing/dashboard-analytics.png", height: "h-64" },
    { src: "/landing/twitter-insights.png", height: "h-48" },
    { src: "/landing/content-strategy.png", height: "h-64" },
  ];

  return (
    <section className="py-24 bg-[#0B0F19] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Join the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                New Wave.
              </span>
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-lg">
              Over 1,000+ creators and marketers are already using Trendsta to dominate their niche. Join the community and start growing faster.
            </p>

          </div>

          {/* Right Grid Visual */}
          <div className="relative h-[600px] w-full perspective-1000">
            {/* Floating Quote Card */}
            <div className="absolute top-1/2 -left-20 -translate-y-1/2 z-20 w-full max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#1A1D2D]/95 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
                >
                  <div className="text-4xl text-white/20 font-serif mb-4">“</div>
                  <p className="text-lg text-slate-200 mb-6 font-medium leading-relaxed min-h-[120px]">
                    {testimonials[activeTestimonial].quote}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                      <Image
                        src={testimonials[activeTestimonial].image}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        alt={testimonials[activeTestimonial].author}
                      />
                    </div>
                    <div>
                      <p className="text-white font-bold">{testimonials[activeTestimonial].author}</p>
                      <p className="text-sm text-slate-500">{testimonials[activeTestimonial].role}</p>
                    </div>
                  </div>

                  {/* Indicators */}
                  <div className="flex gap-1.5 mt-6">
                    {testimonials.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${activeTestimonial === i ? "w-4 bg-indigo-500" : "w-1 bg-white/10"}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Auto-Scrolling Image Grid Background */}
            <div className="absolute inset-0 grid grid-cols-2 gap-4 rotate-3 opacity-60">

              {/* Column 1 - Scrolling Up */}
              <motion.div
                className="space-y-4 -mt-32"
                animate={{ y: ["0%", "-50%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {column1.map((item, i) => (
                  <div key={i} className={`${item.height} bg-slate-800 rounded-2xl overflow-hidden relative shadow-lg border border-white/5`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
                    <Image src={item.src} alt="Community" fill className="object-cover" />
                  </div>
                ))}
              </motion.div>

              {/* Column 2 - Scrolling Up (Offset Speed) */}
              <motion.div
                className="space-y-4 mt-8"
                animate={{ y: ["0%", "-50%"] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                {column2.map((item, i) => (
                  <div key={i} className={`${item.height} bg-slate-800 rounded-2xl overflow-hidden relative shadow-lg border border-white/5`}>
                    {item.src ? (
                      <Image src={item.src} alt="Community" fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
                    )}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0B0F19] via-transparent to-[#0B0F19]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Which platforms does Trendsta support?",
      answer: "We focus exclusively on Instagram Reels growth to provide the deepest possible insights. We also offer Twitter/X Insights to help you spot trending topics early."
    },
    {
      question: "What is the AI Consultant?",
      answer: "Our salient feature. It's an AI agent catered specifically to your content. It analyzes your unique data to give personalized insights on how to grow and better your content strategy."
    },
    {
      question: "How does Competitor Analysis work?",
      answer: "We track top performers in your niche to break down their pacing, hooks, and audio choices, allowing you to replicate their viral success with your own spin."
    },
    {
      question: "Can I get Script Ideas?",
      answer: "Yes! Our engine generates unlimited script ideas based on real-time trends, complete with hooks and structural templates proven to engage audiences."
    },
    {
      question: "Is there a free trial?",
      answer: "Absolutely. You can explore our dashboard in Demo Mode as a guest to see exactly how our analytics and tools work before committing."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-[#0B0F19] relative border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-400">
            Everything you need to know about growing with Trendsta.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 ${openIndex === index
                ? "bg-white/5 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.1)]"
                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
              >
                <span className={`font-semibold text-lg ${openIndex === index ? "text-white" : "text-slate-300"}`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-slate-400"}`}>
                  {openIndex === index ? <X size={18} className="rotate-45" /> : <X size={18} className="rotate-0" />}
                  {/* Using X rotate logic or Plus/Minus if imported. Using X since it is imported and Plus/Minus arent */}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5 mt-2">
                      <div className="pt-4">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#05080E] border-t border-white/5 py-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Image src="/T_logo.png" width={32} height={32} alt="Trendsta" />
          <span className="text-xl font-bold text-white tracking-tight">Trendsta</span>
        </div>
        <div>© {new Date().getFullYear()} Trendsta Inc. All rights reserved.</div>
      </div>
    </footer>
  );
}

// --- Main Page ---

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-[#0B0F19] text-white selection:bg-violet-500/30">
      <Navbar />
      <Hero />
      <TrustStrip />
      <UseCaseTabs />
      <AIConsultantSection />
      <CommunityGrid />
      <FAQSection /> {/* Added FAQ Section */}
      <Footer />
    </div>
  );
}

function AIConsultantSection() {
  const features = [
    {
      title: "Context-Aware Intelligence",
      desc: "It understands your specific niche and history to provide advice that actually applies to you.",
      icon: TrendingUp
    },
    {
      title: "Proactive Strategy",
      desc: "Stop guessing. The Consultant suggests your next move based on emerging gaps in your market.",
      icon: Zap
    },
    {
      title: "Real-Time Trend Correlation",
      desc: "See exactly how global trends are impacting your engagement right now and how to pivot.",
      icon: BarChart3
    }
  ];

  return (
    <section className="py-24 bg-[#0B0F19] relative border-t border-white/5 overflow-hidden">
      {/* Creative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-indigo-500/10 to-purple-500/10 rounded-full blur-[120px] pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-8 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Zap size={14} className="animate-pulse" />
              <span className="tracking-wide">PREMIUM FEATURE</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.15]">
              Meet Your New <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                AI Growth Strategist
              </span>
            </h2>

            <p className="text-lg text-slate-400 mb-10 leading-relaxed border-l-2 border-indigo-500/30 pl-6">
              Go beyond static dashboards. Have a conversation with your data.
              Our AI Consultant analyzes millions of data points to answer your toughest
              growth questions in plain English.
            </p>

            <div className="space-y-6">
              {features.map((feature, i) => (
                <div key={i} className="group flex gap-5 p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.03] hover:border-white/10 border border-transparent">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                    <feature.icon className="text-indigo-400 group-hover:text-indigo-300" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1 group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300">{feature.desc}</p>
                  </div>
                  <div className="ml-auto flex items-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    <ArrowRight size={16} className="text-indigo-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 rounded-3xl blur-3xl -z-10 group-hover:opacity-75 transition-opacity duration-700" />

            {/* Main Image Container with Creative Tilt/Glow */}
            <div className="rounded-3xl border border-white/10 bg-[#131625]/80 backdrop-blur-sm overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:rotate-y-2 group-hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
              <Image
                src="/landing/ai-consultant-creative.png"
                alt="AI Consultant Interface"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>

            {/* Floating Element 1 */}
            <div className="absolute -top-6 -right-6 p-4 bg-[#1A1D2D] rounded-xl border border-white/10 shadow-xl flex items-center gap-3 animate-float-slow hidden md:flex">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Growth</p>
                <p className="text-sm font-bold text-white">+124%</p>
              </div>
            </div>

            {/* Floating Element 2 */}
            <div className="absolute -bottom-8 -left-8 p-4 bg-[#1A1D2D] rounded-xl border border-white/10 shadow-xl flex items-center gap-3 animate-float-slower hidden md:flex">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Zap className="text-purple-400" size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Strategy</p>
                <p className="text-sm font-bold text-white">Generated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
