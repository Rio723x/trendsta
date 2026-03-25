"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
  useInView,
} from "framer-motion";
import {
  TrendingUp,
  ChevronRight,
  BarChart3,
  Instagram,
  Menu,
  X,
  Zap,
  ArrowRight,
  Cpu,
  Twitter,
  Repeat2,
  Heart,
  Eye,
  ExternalLink,
  Lightbulb,
  Users,
  Hash,
  PenTool,
  Mic,
  Play,
} from "lucide-react";
import Image from "next/image";

// --- Components ---

function ShutterReveal({ children, bgColor = "#fafafa" }: { children: React.ReactNode, bgColor?: string }) {
  return (
    <div className="relative inline-flex overflow-hidden">
      {/* The 4 Rectangles masking the text, sliding outwards */}
      <motion.div
        initial={{ y: 0 }}
        whileInView={{ y: "-100%" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        viewport={{ once: false, margin: "-50px" }}
        className="absolute top-0 left-0 right-0 h-1/2 z-20"
        style={{ backgroundColor: bgColor }}
      />
      <motion.div
        initial={{ y: 0 }}
        whileInView={{ y: "100%" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        viewport={{ once: false, margin: "-50px" }}
        className="absolute bottom-0 left-0 right-0 h-1/2 z-20"
        style={{ backgroundColor: bgColor }}
      />
      <motion.div
        initial={{ x: 0 }}
        whileInView={{ x: "-100%" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        viewport={{ once: false, margin: "-50px" }}
        className="absolute top-0 bottom-0 left-0 w-1/2 z-20"
        style={{ backgroundColor: bgColor }}
      />
      <motion.div
        initial={{ x: 0 }}
        whileInView={{ x: "100%" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        viewport={{ once: false, margin: "-50px" }}
        className="absolute top-0 bottom-0 right-0 w-1/2 z-20"
        style={{ backgroundColor: bgColor }}
      />

      {/* The inner content, slight scale effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        viewport={{ once: false, margin: "-50px" }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

function ScrollIndicator({ color = "#2e3131", duration = 2.5 }: { color?: string; duration?: number }) {
  return (
    <div
      className="flex flex-col items-center cursor-pointer group"
      onClick={() => {
        const el = document.getElementById("features");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {/* SCROLL label */}
      <motion.div
        animate={{
          y: [0, 0, 6, 6, 6],
          opacity: [1, 1, 1, 0, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          times: [0, 0.4, 0.6, 0.8, 1],
        }}
        style={{ color }}
        className="text-[9px] font-bold tracking-[3px] uppercase mb-2 select-none"
      >
        SCROLL
      </motion.div>

      {/* Vertical line */}
      <motion.div
        animate={{
          opacity: [1, 1, 1, 1, 0],
          scaleY: [1, 1, 1, 0.4, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeOut",
          times: [0, 0.6, 0.8, 0.9, 1],
        }}
        style={{ backgroundColor: color, originY: 0 }}
        className="w-px h-10"
      />
    </div>
  );
}

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav id="mainNav">
        <div className="nav-inner">
          <a href="/" className="nav-logo flex items-center gap-4">
            <Image src="/T_logo.png" alt="Trendsta Logo" width={40} height={40} className="rounded-xl drop-shadow-sm blur-none transition-transform group-hover:scale-105" />
            <span className="hidden sm:inline-block tracking-tight text-2xl font-body font-bold text-ink">Trendsta</span>
          </a>

          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how">How It Works</a></li>
            <li><a href="#stories">Stories</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>

          <div className="flex items-center gap-3">
            <a href="https://www.trendsta.in/login" className="hidden sm:inline-flex px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-900 font-bold text-[16px] hover:bg-gray-50 transition-all shadow-sm">Log in</a>
            <a href="https://www.trendsta.in/signup" className="px-6 py-3 rounded-full bg-linear-to-r from-[#ff5900] to-[#ffb800] text-white font-bold text-[16px] hover:scale-105 hover:shadow-[0_8px_24px_-6px_rgba(255,89,0,0.5)] transition-all">Get started</a>
          </div>

          <button className="nav-mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
            <span style={{ transform: isMobileMenuOpen ? "rotate(45deg) translateY(4px)" : "none" }}></span>
            <span style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
            <span style={{ transform: isMobileMenuOpen ? "rotate(-45deg) translateY(-4px)" : "none" }}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[min(340px,90vw)] bg-[#F5F3EE]/95 backdrop-blur-2xl z-40 border border-[#E4E2DC] rounded-2xl shadow-2xl p-5"
          >
            <div className="flex flex-col gap-1 mb-4">
              {[
                { label: "Features", href: "#features" },
                { label: "How It Works", href: "#how" },
                { label: "FAQ", href: "#faq" },
              ].map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-[#1A1A1A] font-semibold text-sm hover:bg-black/5 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t border-[#E4E2DC]">
              <a
                href="https://www.trendsta.in/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn btn-primary btn-orange w-full"
              >
                Get Started
              </a>
              <a
                href="https://www.trendsta.in/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn btn-ghost w-full"
              >
                View Demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


function Hero() {
  return (
    <section className="hero relative pt-32 pb-0 md:pt-40 lg:pt-48 overflow-hidden bg-cream flex flex-col items-center justify-center text-center z-10 w-full border-b border-black/5">
      {/* Floating gradient blobs like Patreon */}
      <div className="hero-blob blob-1"></div>
      <div className="hero-blob blob-2"></div>

      {/* Content Container */}
      <div className="relative max-w-4xl mx-auto px-4 z-20 flex flex-col items-center">
        {/* Eyebrow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium mb-10 shadow-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm"></span>
          Trusted by 10,000+ creators
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-[110px] leading-[0.9] font-display font-normal text-gray-900 tracking-[-0.04em] mb-6"
        >
          Know what goes <span className="text-[#ff5900] italic pr-1">viral</span><br/>before it does.
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10 font-medium tracking-tight"
        >
          Trendsta gives you real-time AI intelligence on what to post, when to post, and how to beat your competitors — on Instagram and X.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 w-full sm:w-auto z-20"
        >
          <a href="https://www.trendsta.in/signup" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-linear-to-r from-[#ff5900] to-[#ffb800] text-white font-bold text-lg hover:scale-[1.03] hover:shadow-[0_12px_30px_-8px_rgba(255,89,0,0.7)] transition-all duration-300">
            Start for free
          </a>
          <a href="https://www.trendsta.in/dashboard" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white border border-gray-200 text-gray-900 font-bold text-lg hover:bg-gray-50 hover:scale-[1.02] transition-all duration-300 shadow-sm">
            Watch demo →
          </a>
        </motion.div>

        {/* Hint */}
        <motion.p 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xs text-gray-400 font-medium mb-8"
        >
          No credit card required · Cancel anytime
        </motion.p>


        {/* Social Proof Row */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium"
        >
          <span className="text-gray-400">Works on</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-gray-700 font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md">
            <Instagram size={16} className="text-[#E1306C]" />
            <span>Instagram</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm text-gray-700 font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-black fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Twitter / X</span>
          </div>
        </motion.div>
      </div>

      {/* Hero Product Preview (Peek) */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
        className="hero-preview mt-12 mb-[-160px] md:mb-[-220px] lg:mb-[-280px] z-20"
      >
        <div className="preview-topbar">
          <div className="preview-dots">
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
          </div>
          <div className="preview-url">trendsta.in/dashboard</div>
        </div>
        <div className="preview-body text-left">
          <div className="preview-sidebar">
            <div className="preview-sidebar-title">Menu</div>
            <div className="sidebar-item active">Analytics</div>
            <div className="sidebar-item">AI Consultant</div>
            <div className="sidebar-item">Script Ideas</div>
            <div className="sidebar-item">Competitors</div>
            <div className="sidebar-item">Instagram Insights</div>
            <div className="sidebar-item">Twitter Insights</div>
          </div>
          <div className="preview-main">
            <div className="preview-main-header">
              <span className="preview-main-title">Live Analytics Dashboard</span>
              <span className="preview-live-badge"><span className="preview-live-dot"></span> LIVE</span>
            </div>
            <div className="metric-grid">
              <div className="metric-card">
                <div className="metric-card-label">Best Post Time</div>
                <div className="metric-card-val orange">10:00 AM</div>
                <div className="metric-card-sub">High engagement window</div>
              </div>
              <div className="metric-card">
                <div className="metric-card-label">Target Pace</div>
                <div className="metric-card-val green">194 WPM</div>
                <div className="metric-card-sub">Viral sweet spot</div>
              </div>
              <div className="metric-card">
                <div className="metric-card-label">Content Gap</div>
                <div className="metric-card-val" style={{fontSize:"16px", paddingTop:"3px"}}>AI Ethics</div>
                <div className="metric-card-sub">Zero niche coverage</div>
              </div>
            </div>
            <div className="sparkline-row">
              <div className="sparkline-header">
                <span className="sparkline-label">Engagement trend — past 7 days</span>
                <span className="sparkline-badge">↑ +38% this week</span>
              </div>
              <svg width="100%" height="56" viewBox="0 0 560 56" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5C1A" stopOpacity=".25"/>
                    <stop offset="100%" stopColor="#FF5C1A" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 48 L80 44 L160 36 L240 38 L320 22 L400 14 L480 8 L560 4 L560 56 L0 56Z" fill="url(#sg)"/>
                <path d="M0 48 L80 44 L160 36 L240 38 L320 22 L400 14 L480 8 L560 4" stroke="#FF5C1A" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <circle cx="480" cy="8" r="4" fill="#FF5C1A"/>
                <circle cx="560" cy="4" r="4" fill="#FFB800"/>
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function AnimatedCircularProgressBar({ score }: { score: number }) {
  const [displayScore, setDisplayScore] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const duration = 1200; // 1.2s to match the framer example
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing out cubic for smooth deceleration
        const ease = 1 - Math.pow(1 - progress, 3);
        setDisplayScore(Math.floor(ease * score));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setDisplayScore(score);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [inView, score]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius; // ~282.74

  return (
    <div ref={ref} className="relative w-32 h-32 mt-4 mb-6">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#2a2a2a" strokeWidth="8" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#A855F7"
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: circumference - (circumference * score) / 100 } : { strokeDashoffset: circumference }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-black text-white font-sans">{displayScore}</span>
      </div>
    </div>
  );
}

// ------------ ServicePanel helper component ------------
function ServicePanel({
  id,
  textSide = "left",
  badge,
  title,
  description,
  bullets,
  conclusion,
  graphic,
}: {
  id: string;
  textSide?: "left" | "right";
  badge?: string;
  title: React.ReactNode;
  description: React.ReactNode;
  bullets: string[];
  conclusion?: React.ReactNode;
  graphic: React.ReactNode;
}) {
  const graphicRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: graphicRef,
    offset: ["start end", "center 60%"],
  });

  const textCol = (
    <div className="flex flex-col justify-center gap-5 md:py-0">

      {/* Animated subheading — Space Mono, motion reveal */}
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: false, margin: "-60px" }}
          className="flex items-center gap-3"
        >
          <div className="h-px w-8 bg-orange-500 flex-shrink-0" />
          <span
            className="text-[13px] font-bold tracking-[0.2em] uppercase text-gray-500"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {badge}
          </span>
        </motion.div>
      )}

      {/* Title — Space Mono */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false, margin: "-60px" }}
        className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.05]"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {title}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false, margin: "-60px" }}
        className="text-lg text-gray-500 leading-relaxed max-w-md"
      >
        {description}
      </motion.div>

      <motion.ul
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false, margin: "-60px" }}
        className="space-y-3"
      >
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
            {b}
          </li>
        ))}
      </motion.ul>

      {conclusion && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: false, margin: "-60px" }}
          className="text-lg font-bold text-gray-800 leading-relaxed max-w-md mt-2"
        >
          {conclusion}
        </motion.p>
      )}
    </div>
  );

  const graphicCol = (
    <motion.div
      ref={graphicRef}
      initial={{ transform: "rotateX(60deg) translateY(50px)", opacity: 0 }}
      animate={{ transform: "rotateX(0deg) translateY(0px)", opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{ transformStyle: "preserve-3d" }}
      className="w-full perspective-1000"
    >
      {graphic}
    </motion.div>
  );

  return (
    <div id={id} className="py-16 md:py-24 lg:min-h-screen flex items-center bg-[#fafafa] border-b border-black/5 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {textSide === "left" ? (
            <>
              {textCol}
              {graphicCol}
            </>
          ) : (
            <>
              {graphicCol}
              {textCol}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ------------ Dashboard Graphic with scroll-driven floaters ------------
function DashboardGraphic() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });

  // Floaters start spread outward and converge inward as user scrolls in
  const leftX = useTransform(scrollYProgress, [0, 1], [-80, 0]);
  const rightX = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const topY = useTransform(scrollYProgress, [0, 1], [-60, 0]);
  const bottomY = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const floatOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <div ref={ref} className="relative">
      {/* Floater TL — Best Time */}
      <motion.div
        style={{ x: leftX, y: topY, opacity: floatOpacity }}
        className="absolute -top-10 -left-6 xl:-left-16 z-30 hidden md:flex w-44 bg-white rounded-2xl border border-black/10 shadow-xl p-3 flex-col gap-1.5"
      >
        <div className="flex items-center gap-2 text-[9px] font-bold text-orange-500 uppercase tracking-wider">
          <Zap size={10} fill="currentColor" /> Best Time to Post
        </div>
        <p className="text-lg font-bold text-gray-900 leading-none">10:00 AM</p>
        <p className="text-[9px] text-gray-400">High Engagement Window</p>
      </motion.div>

      {/* Floater TR — Viral Trigger */}
      <motion.div
        style={{ x: rightX, y: topY, opacity: floatOpacity }}
        className="absolute -top-10 -right-6 xl:-right-16 z-30 hidden md:flex w-44 bg-white rounded-2xl border border-black/10 shadow-xl p-3 flex-col gap-1.5"
      >
        <div className="flex items-center gap-2 text-[9px] font-bold text-purple-500 uppercase tracking-wider">
          <TrendingUp size={10} /> Viral Trigger
        </div>
        <p className="text-lg font-bold text-gray-900 leading-none">Hidden Enemy</p>
        <p className="text-[9px] text-gray-400">VS Competitor angle</p>
      </motion.div>

      {/* Floater BL — Competitor Speed */}
      <motion.div
        style={{ x: leftX, y: bottomY, opacity: floatOpacity }}
        className="absolute -bottom-10 -left-6 xl:-left-16 z-30 hidden md:flex w-48 bg-white rounded-2xl border border-black/10 shadow-xl p-3 flex-col gap-1.5"
      >
        <div className="flex items-center gap-2 text-[9px] font-bold text-sky-500 uppercase tracking-wider">
          <BarChart3 size={10} /> Competitor Speed
        </div>
        <div className="flex items-center gap-2 mt-1">
          {[70, 45, 90, 55, 80].map((h, i) => (
            <div key={i} className={`flex-1 rounded-t-sm ${i === 2 ? "bg-orange-500" : "bg-gray-300"}`} style={{ height: `${h * 0.3}px` }} />
          ))}
        </div>
        <p className="text-[9px] text-gray-400">You're 2× faster than avg</p>
      </motion.div>

      {/* Floater BR — Content Gap */}
      <motion.div
        style={{ x: rightX, y: bottomY, opacity: floatOpacity }}
        className="absolute -bottom-10 -right-6 xl:-right-16 z-30 hidden md:flex w-44 bg-white rounded-2xl border border-black/10 shadow-xl p-3 flex-col gap-1.5"
      >
        <div className="flex items-center gap-2 text-[9px] font-bold text-green-600 uppercase tracking-wider">
          <ChevronRight size={10} /> Content Gap
        </div>
        <p className="text-base font-bold text-gray-900 leading-tight">AI Ethics</p>
        <p className="text-[9px] text-gray-400">Zero coverage in your niche</p>
      </motion.div>

      {/* Main Dashboard Window */}
      <div className="relative z-20 rounded-2xl overflow-hidden shadow-2xl border border-black/10 bg-white">
        <div className="h-10 bg-gray-50 border-b border-black/10 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="mx-auto w-1/3 h-5 bg-black/5 rounded text-[10px] flex items-center justify-center text-gray-400">trendsta.app/dashboard</div>
        </div>
        <div className="bg-[#fafafa] p-5 flex flex-col gap-4 font-sans text-left">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-0.5">Analytics Dashboard</h3>
            <p className="text-[10px] text-gray-500">Analysis based on research from Saturday, Jan 31, 2026</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Best Time", value: "10:00 AM", sub: "High Engagement", bar: "bg-orange-500", txt: "text-orange-500", accent: "border-orange-500/20" },
              { label: "Target Pace", value: "190-200 WPM", sub: "High Energy", bar: "bg-amber-400", txt: "text-amber-500", accent: "border-amber-400/20" },
              { label: "Viral Trigger", value: "Hidden Enemy", sub: "VS Competitor", bar: "bg-gray-400", txt: "text-gray-700", accent: "border-gray-400/20" },
              { label: "Content Gap", value: "AI Ethics", sub: "Cover the Dark Side", bar: "bg-black", txt: "text-black", accent: "border-black/20" },
            ].map((s, i) => (
              <div key={i} className={`bg-white rounded-xl p-3 border ${s.accent} relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-1 h-full ${s.bar}`} />
                <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${s.txt}`}>{s.label}</p>
                <p className="text-sm font-bold text-gray-900 leading-tight">{s.value}</p>
                <p className="text-[9px] text-gray-400 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 border border-black/10 flex flex-col">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">Viral Sweet Spot</h4>
              <p className="text-[10px] text-gray-500 mb-3">Faster (194+ WPM) and longer (60s+) than the niche average.</p>
              <div className="flex items-end gap-4 px-4 pb-2 border-b border-black/10" style={{ height: 60 }}>
                {[["65s", "60%", "bg-orange-500"], ["45s", "40%", "bg-gray-300"], ["50s", "50%", "bg-gray-200"]].map(([l, h, c], i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div className={`w-full rounded-t-sm ${c}`} style={{ height: h }} />
                    <span className="text-[8px] text-gray-400">{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-black/10 flex flex-col">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Hook Leaderboard</h4>
              <div className="flex flex-col gap-2 flex-1 justify-center">
                {[["Controversial Q", "98%", "bg-orange-500"], ["Direct Benefit", "75%", "bg-gray-300"], ["Tech Urgency", "60%", "bg-gray-200"]].map(([l, p, c], i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[9px] text-gray-700 font-medium"><span>{l}</span><span>{p}</span></div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${c}`} style={{ width: p }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------ Script Ideas 3D Card Stack ------------
const SCRIPT_CARDS = [
  {
    score: 98,
    tag: "VIRAL",
    title: "Humans Are Banned",
    whyWorks: "Leverages the #1 viral story in the niche right now.",
    audioVibe: "Tense, cinematic background drone. No upbeat music.",
    duration: "00:45 · 124 words",
    hook: '"Imagine a social network where you are banned simply for being a human."',
    payoff: "Details on AI agents creating religion and private chats.",
    marketGap: "User has zero coverage of this viral trend.",
    scoreColor: "#a855f7",
  },
  {
    score: 92,
    tag: "VIRAL",
    title: "Elon's Space Server Farm",
    whyWorks: "Elon Musk content has high viral velocity on Twitter.",
    audioVibe: "Sci-fi, futuristic, high energy.",
    duration: "00:40 · 111 words",
    hook: '"Elon Musk just made the wildest announcement of the decade."',
    payoff: "Explaining the energy crisis on Earth vs solar power in space.",
    marketGap: "Major news story missing from user feed.",
    scoreColor: "#a855f7",
  },
  {
    score: 88,
    tag: "HIGH",
    title: "Robots Hiring Humans",
    whyWorks: "Reverses the common narrative of 'AI taking jobs'.",
    audioVibe: "Curious, slightly dystopian.",
    duration: "00:35 · 103 words",
    hook: '"We thought robots would take our jobs. Instead, they are becoming our bosses."',
    payoff: "Real examples of tasks: picking up packages, digital evangelism.",
    marketGap: "Trending topic on Twitter and Competitor feeds.",
    scoreColor: "#a855f7",
  },
];

function ScriptCard({ card }: { card: typeof SCRIPT_CARDS[0] }) {
  const pct = card.score;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="w-full bg-[#1a1a2e] rounded-2xl overflow-hidden flex flex-col md:flex-row select-none">
      {/* Left panel — horizontal strip on mobile, sidebar on md+ */}
      <div className="flex flex-row md:flex-col items-center gap-4 p-4 md:p-6 bg-[#141428] md:w-52 shrink-0 relative">
        {/* Tag — top-right on md, hidden on mobile (shown in right panel instead) */}
        <div className="hidden md:flex absolute top-3 right-3 items-center gap-1 px-2 py-0.5 rounded-full bg-[#2a2a4a] border border-purple-500/30 text-purple-400 text-[9px] font-bold tracking-wider">
          <Zap size={8} fill="currentColor" /> {card.tag}
        </div>
        {/* Score ring — smaller on mobile */}
        <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center shrink-0">
          <svg width="64" height="64" viewBox="0 0 96 96" className="-rotate-90 absolute inset-0 w-full h-full">
            <circle cx="48" cy="48" r={r} fill="none" stroke="#2a2a4a" strokeWidth="6" />
            <circle
              cx="48" cy="48" r={r} fill="none"
              stroke={card.scoreColor} strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
            />
          </svg>
          <span className="relative text-xl md:text-2xl font-bold text-white font-mono">{card.score}</span>
        </div>
        {/* Why This Works — beside ring on mobile, below on md */}
        <div className="flex-1 md:text-center">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1">Why This Works</p>
          <p className="text-[11px] text-gray-300 leading-snug">{card.whyWorks}</p>
        </div>
        {/* Audio Vibe — hidden on mobile */}
        <div className="hidden md:block w-full bg-[#1a1a2e]/80 rounded-xl px-3 py-2 border border-white/5">
          <p className="text-[8px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
            <Zap size={8} fill="currentColor" /> Audio Vibe
          </p>
          <p className="text-[10px] text-gray-300">{card.audioVibe}</p>
        </div>
        {/* Duration — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1.5 w-full bg-[#1a1a2e] border border-white/5 rounded-xl px-3 py-2 justify-center">
          <ArrowRight size={10} className="text-gray-400" />
          <span className="text-[10px] text-gray-300 font-mono">{card.duration}</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-base md:text-lg">{card.title}</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 text-gray-400 text-[10px] hover:border-purple-500/30 hover:text-purple-400 transition-colors">
            Details <ChevronRight size={10} />
          </button>
        </div>

        {/* Hook */}
        <div>
          <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mb-2">The Hook</p>
          <div className="bg-[#0f1729] border border-blue-900/40 rounded-xl p-4">
            <p className="text-white text-sm md:text-base font-semibold leading-snug">{card.hook}</p>
          </div>
        </div>

        {/* Payoff + Market Gap */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          <div>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mb-2">The Payoff</p>
            <div className="h-full bg-[#0d2318] border border-green-900/40 rounded-xl p-3">
              <p className="text-green-400 text-[11px] leading-snug">{card.payoff}</p>
            </div>
          </div>
          <div>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mb-2">Market Gap</p>
            <div className="h-full bg-[#0f122a] border border-blue-900/40 rounded-xl p-3">
              <p className="text-[8px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" /> Fills Void
              </p>
              <p className="text-blue-300 text-[11px] leading-snug">{card.marketGap}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScriptIdeas3DCards() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % SCRIPT_CARDS.length);
    }, 2000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleNext = () => { setActive((p) => (p + 1) % SCRIPT_CARDS.length); startTimer(); };
  const handleDot = (i: number) => { setActive(i); startTimer(); };

  return (
    <div className="relative w-full" style={{ perspective: "1200px" }}>
      <div className="relative" style={{ height: "clamp(320px, 50vw, 380px)" }}>
        {SCRIPT_CARDS.map((card, i) => {
          const offset = (i - active + SCRIPT_CARDS.length) % SCRIPT_CARDS.length;
          // 0 = active (front), 1 = behind-right, 2 = behind-left
          const isActive = offset === 0;
          const isNext = offset === 1;
          const isPrev = offset === 2;

          const rotateY = isActive ? 0 : isNext ? 25 : -25;
          const translateZ = isActive ? 0 : -80;
          const translateX = isActive ? 0 : isNext ? "8%" : "-8%";
          const scale = isActive ? 1 : 0.88;
          const zIndex = isActive ? 30 : isNext ? 20 : 10;
          const opacity = isActive ? 1 : 0.55;

          return (
            <motion.div
              key={i}
              animate={{ rotateY, translateZ, translateX, scale, opacity }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={handleNext}
              style={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
                zIndex,
                cursor: isActive ? "pointer" : "default",
              }}
            >
              <ScriptCard card={card} />
            </motion.div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {SCRIPT_CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === active ? "bg-purple-500 w-5" : "bg-gray-600"}`}
          />
        ))}
      </div>
      <p className="text-center text-[10px] text-gray-500 mt-3">Auto-plays · click to jump</p>
    </div>
  );
}

// ------------ Main Services Section ------------

function AIChatUI() {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Mobile Graphic */}
      <div className="md:hidden relative z-20 rounded-4xl overflow-hidden shadow-xl border border-white/5 bg-[#0a0a0a] flex flex-col items-center pt-10 px-6 pb-8 select-none scale-[0.8] origin-top">
        <div className="mb-4">
          <Image src="/T_logo.png" alt="Trendsta" width={44} height={44} className="object-contain" />
        </div>
        <div className="text-center mb-5">
          <h3 className="text-base md:text-lg font-medium text-[#8F9BB3] font-sans tracking-tight leading-snug">
            Your AI-powered content strategist.<br />Ask me anything about reels, trends, and growth.
          </h3>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full text-xs text-[#636C7A] mb-6 font-sans">
          <BarChart3 size={12} className="text-indigo-400" />
          <span>Results based on data from 06/02/2026.</span>
        </div>
        <div className="grid grid-cols-3 gap-3 w-full max-w-lg mb-5">
          {[{ c: "#2D9CDB", Icon: TrendingUp, label: "Trending" }, { c: "#F2994A", Icon: Lightbulb, label: "Viral Ideas" }, { c: "#DE5EAC", Icon: Users, label: "Competitors" }, { c: "#27AE60", Icon: BarChart3, label: "Performance" }, { c: "#EB5757", Icon: Hash, label: "Hashtags" }, { c: "#9B51E0", Icon: PenTool, label: "Scripts" }].map(({ c, Icon, label }, i) => (
            <div key={i} className="bg-[#141414] border border-white/5 rounded-xl p-3 flex flex-col gap-2 cursor-pointer hover:border-white/10 transition-colors">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: c }}><Icon size={14} /></div>
              <span className="text-[#8F9BB3] text-xs font-medium font-sans">{label}</span>
            </div>
          ))}
        </div>
        <div className="w-full max-w-lg">
          <div className="w-full bg-[#141414] border border-white/10 rounded-2xl flex items-center p-2">
            <div className="flex-1 px-3 text-[#636C7A] text-sm font-sans">Ask Trendsta anything...</div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5"><Mic size={16} /></button>
              <button className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white"><ArrowRight size={16} /></button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-sans mt-3 justify-center">
            <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FFF2DE] text-[#CA8215] rounded-full font-bold">
              <Zap size={11} fill="currentColor" /> Fast Mode
            </div>
            <div className="flex items-center gap-1.5 px-4 py-1.5 text-gray-500 font-medium">
              <Cpu size={11} /> Deep Research
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Video */}
      <div className="hidden md:flex relative w-full h-[280px] z-20 rounded-4xl shadow-2xl overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        <video
          src="/landing/AI_CONSULTANT%20(1).mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

function TwitterInsightsUI() {
  return (
    <div className="relative z-20 rounded-2xl overflow-hidden shadow-2xl border border-black/10 bg-[#0d0d0d] scale-[0.85] origin-top lg:origin-left">
      <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-white/5 text-sm font-semibold">
        <button className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-500 rounded-lg border border-orange-500/20 text-xs">
          <Zap size={12} fill="currentColor" /> Top Tweets
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 text-gray-400 rounded-lg text-xs transition-colors">Latest</button>
      </div>
      <div className="p-5 space-y-4">
        {[
          { name: "Banxcartoons", handle: "@Banxcartoons", score: "8.2", text: 'From today\'s @FT #ElonMusk #SpaceX #ArtificialIntelligence', likes: "30", retweets: "10", views: "472", grad: "from-green-400 to-cyan-500" },
          { name: "Ronald_vanLoon", handle: "@Ronald_vanLoon", score: "3.3", text: '7 #Skills #AI Can\'t Replace (Yet) — #ArtificialIntelligence #MachineLearning', likes: "210", retweets: "54", views: "12K", grad: "from-blue-400 to-purple-500" },
        ].map((t, i) => (
          <div key={i} className="bg-[#161819] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full bg-linear-to-br ${t.grad} shrink-0`} />
                <div>
                  <p className="font-bold text-white text-xs">{t.name}</p>
                  <div className="flex items-center gap-1 text-gray-500 text-[10px]">
                    <span>{t.handle}</span><span>·</span>
                    <span className="flex items-center gap-0.5"><Zap size={8} className="text-gray-500" /> {t.score}</span>
                  </div>
                </div>
              </div>
              <ExternalLink size={14} className="text-gray-500" />
            </div>
            <p className="text-[12px] text-white/80 leading-relaxed mb-3">{t.text}</p>
            <div className="flex items-center gap-4 text-gray-400 text-[10px]">
              <span className="flex items-center gap-1"><Heart size={12} /> {t.likes}</span>
              <span className="flex items-center gap-1"><Repeat2 size={12} /> {t.retweets}</span>
              <span className="flex items-center gap-1"><Eye size={12} /> {t.views}</span>
            </div>
          </div>
        ))}
        <div className="grid grid-cols-3 gap-3 mt-2">
          {[["#AI", "2.4M"], ["#SpaceX", "1.1M"], ["#Startups", "890K"]].map(([tag, vol], i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 flex flex-col gap-1">
              <span className="font-bold text-orange-400 text-sm">{tag}</span>
              <span className="text-gray-400 text-[10px] flex items-center gap-1">{vol} <TrendingUp size={10} className="text-green-500" /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InteractiveFeatureTree() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<string>("dashboard");

  const leafNodes = [
    {
      id: "dashboard",
      icon: "📊",
      title: "Dashboard",
      question: "Wanna see what's actually working?",
      description: "Trendsta shows real-time niche analytics so you know what content is winning, what hooks are performing, and what topics are trending — before everyone else.",
      graphic: <div className="mt-4 lg:mt-8 w-full lg:w-[460px] max-w-full"><DashboardGraphic /></div>
    },
    {
      id: "scripts",
      icon: "📝",
      title: "Scripts",
      question: "Still confused what to post?",
      description: "Trendsta converts live data into ready-to-post content ideas, including hooks, structure, and viral angles.",
      graphic: <div className="mt-4 lg:mt-8 w-full lg:w-[460px] max-w-full"><ScriptIdeas3DCards /></div>
    },
    {
      id: "competitors",
      icon: "🔍",
      title: "Competitors",
      question: "Why are your competitors growing faster?",
      description: "See what they post, when they post, and what's working for them — then beat them.",
      graphic: <div className="mt-4 lg:mt-8 w-full lg:w-[460px] max-w-full"><CompetitorAnalysis3DCards /></div>
    },
    {
      id: "ai",
      icon: "🤖",
      title: "AI Consultant",
      question: "Need guidance? Just ask.",
      description: "Your 24/7 AI content strategist that understands your niche, competitors, and trends — and tells you exactly what to do.",
      graphic: <div className="mt-4 lg:mt-8 w-full lg:w-[460px] max-w-full"><AIChatUI /></div>
    },
    {
      id: "instagram",
      icon: "📷",
      title: "Instagram",
      question: "Want to understand your Instagram better?",
      description: "Trendsta analyzes your Instagram and tells you what content works, what doesn't, and how to grow faster.",
      graphic: <div className="mt-4 lg:mt-8 w-full lg:w-[460px] max-w-full"><InstagramInsights3DCards /></div>
    },
    {
      id: "twitter",
      icon: "𝕏",
      title: "Twitter",
      question: "Growing on Twitter but not sure what's working?",
      description: "Trendsta analyzes your tweets, engagement patterns, and trending topics in your niche.",
      graphic: <div className="mt-4 lg:mt-8 w-full lg:w-[460px] max-w-full"><TwitterInsightsUI /></div>
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="section-inner w-full max-w-[1440px] px-auto">
        {/* Header Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="flex flex-col items-center text-center px-4 mb-16 md:mb-24"
        >
          <div className="section-tag mx-auto mb-6 text-sm md:text-base">⚡ Everything you need</div>
          <h2 className="text-6xl md:text-8xl lg:text-[110px] leading-[0.95] font-display font-normal text-ink tracking-[-0.03em] mb-8">
            Built for creators<br/>
            who want to <em className="italic text-transparent bg-clip-text bg-[linear-gradient(135deg,#FF5C1A_0%,#FF8C00_60%,#FFB800_100%)]">win.</em>
          </h2>
          <p className="text-muted text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Every tool Trendsta gives you is powered by real-time AI analysis — so every decision is data-backed.
          </p>
        </motion.div>

        {/* Tree Layout logic */}
        <div className="w-full mt-10 md:mt-20">
          <div className="hidden lg:flex flex-col items-center w-full mb-6">
            <div className="bg-orange-50 text-orange-600 font-bold px-6 py-3 rounded-full border border-orange-200 shadow-sm z-10 font-sans tracking-wide">
              Trendsta Intelligence
            </div>
            
            {/* Tree Branch lines */}
            <div className="w-[85%] h-8 border-t-2 border-l-2 border-r-2 border-border-patreon rounded-t-[30px] mt-4 relative">
              <div className="absolute top-0 left-[20%] h-full w-0 border-l-2 border-border-patreon"></div>
              <div className="absolute top-0 left-[40%] h-full w-0 border-l-2 border-border-patreon"></div>
              <div className="absolute top-0 left-[60%] h-full w-0 border-l-2 border-border-patreon"></div>
              <div className="absolute top-0 left-[80%] h-full w-0 border-l-2 border-border-patreon"></div>
            </div>
          </div>

          {/* Mobile Layout (Tabs) */}
          <div className="flex flex-col lg:hidden w-full gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
              {leafNodes.map((node) => {
                const isActive = activeMobileTab === node.id;
                return (
                  <button
                    key={`mobile-tab-${node.id}`}
                    onClick={() => setActiveMobileTab(node.id)}
                    className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all text-sm font-bold font-sans shadow-sm ${
                      isActive 
                        ? 'bg-white border-orange-400 text-orange-600' 
                        : 'bg-cream border-border-patreon text-gray-500 hover:border-orange-300'
                    }`}
                  >
                    <span className="text-lg">{node.icon}</span>
                    <span className="whitespace-nowrap">{node.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Mobile Pane */}
            <div className="w-full bg-white rounded-3xl border border-border-patreon p-6 sm:p-8 flex flex-col shadow-sm">
              <AnimatePresence mode="wait">
                {leafNodes.map((node) => {
                  if (activeMobileTab !== node.id) return null;
                  return (
                    <motion.div
                      key={`mobile-pane-${node.id}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex flex-col"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[linear-gradient(135deg,#FF5C1A,#FF8C00)] text-white text-xl mb-6 shadow-md shadow-orange-500/30">
                        {node.icon}
                      </div>
                      <h3 className="text-[26px] sm:text-[28px] font-bold font-sans tracking-tight text-ink mb-4 leading-tight">
                        {node.question}
                      </h3>
                      <p className="text-muted leading-relaxed font-body text-base mb-8">
                        {node.description}
                      </p>
                      <div className="w-full relative flex items-center justify-center overflow-hidden">
                        {node.graphic}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Layout (Expanding Cards) */}
          <div className="hidden lg:flex flex-row gap-3 w-full h-[620px] items-stretch">
            {leafNodes.map((node) => {
              const isActive = hoveredNode === node.id;
              
              return (
                <motion.div
                  key={node.id}
                  layout
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setHoveredNode(isActive ? null : node.id)}
                  animate={{
                    flexGrow: isActive ? 6 : 1,
                    scale: isActive ? 1.02 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 35 }}
                  className={`relative flex flex-col justify-start overflow-hidden rounded-[24px] bg-white border cursor-pointer min-h-full
                    ${isActive ? 'border-orange-400 shadow-[0_8px_32px_rgba(255,115,0,0.15)] z-20' : 'border-border-patreon shadow-sm z-10 hover:border-orange-300'}`}
                  style={{ flexBasis: "0" }}
                >
                  {/* Minimized State overlay */}
                  <motion.div 
                    initial={false}
                    animate={{ opacity: isActive ? 0 : 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-start pt-10 gap-4 p-6 pb-10 select-none z-30"
                    style={{ pointerEvents: isActive ? 'none' : 'auto' }}
                  >
                    <div className="flex items-center justify-center w-[72px] h-[72px] shrink-0 rounded-[18px] bg-cream border border-border-patreon text-[32px]">
                      {node.icon}
                    </div>
                    <span className="font-bold text-ink font-sans text-xl [writing-mode:vertical-lr] uppercase tracking-widest mt-6 whitespace-nowrap">{node.title}</span>
                  </motion.div>

                  {/* Expanded State content */}
                  <motion.div 
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    className="flex flex-col w-full h-full p-12 z-20 min-w-[400px] absolute inset-0 overflow-hidden items-start"
                    style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[linear-gradient(135deg,#FF5C1A,#FF8C00)] text-white text-xl mb-6 shadow-md shadow-orange-500/30 shrink-0">
                      {node.icon}
                    </div>
                    <h3 className="text-[40px] font-bold font-sans tracking-[-0.04em] text-ink mb-4 leading-[1.05] shrink-0">
                      {node.question}
                    </h3>
                    <p className="text-muted leading-relaxed font-body text-lg mb-8 max-w-[400px] shrink-0">
                      {node.description}
                    </p>
                    
                    <motion.div 
                      className="mt-6 relative w-full flex-1 flex flex-col justify-start shrink-0 pointer-events-auto"
                      initial={{ y: 20, opacity: 0 }}
                      animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                    >
                      {node.graphic}
                    </motion.div>
                    
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ——— Insight Card Data ———

const INSTAGRAM_CARDS = [
  {
    num: "1",
    title: "Tutorials and 'Tech Tips' have high view potential but lower engagement than News.",
    signal: "TechTips hashtag has 117k avg views but lower engagement than AI News reels.",
    action: "Use Tech Tips for reach/followers, use AI News for community/engagement.",
    accent: "#3d1a2a",
    actionBg: "#4a1a2e",
  },
  {
    num: "2",
    title: "Speaking pace is a critical differentiator.",
    signal: "Top Viral Competitor speaks at 224 WPM; User speaks at 25 WPM.",
    action: "Script videos to be read fast, removing all filler words.",
    accent: "#2a1a3a",
    actionBg: "#3a1a4a",
  },
  {
    num: "3",
    title: "Short-form hooks under 3 seconds drive 4× more saves.",
    signal: "Most saved reels in niche open with a bold visual statement, not text.",
    action: "Lead every reel with a visually striking scene before the hook copy.",
    accent: "#1a2a3a",
    actionBg: "#1a3048",
  },
];

const COMPETITOR_CARDS = [
  {
    num: "1",
    title: "[@thevarunmayya] Rapid-fire news delivery with 'Existential' framing.",
    signal: "Combines high information density (224 WPM) with emotional hooks (Fear/Awe).",
    action: "Match the pace but add visual data overlays which Varun lacks.",
    accent: "#1a2a3a",
    actionBg: "#1a3048",
  },
  {
    num: "2",
    title: "[@chriswinfield] Sequential updates on the same story (Moltbook Part 1, Part 2).",
    signal: "Builds a narrative arc that keeps people coming back.",
    action: "Create a 'Weekly AI Recap' series to capture multiple stories.",
    accent: "#1e1a3a",
    actionBg: "#252060",
  },
  {
    num: "3",
    title: "[@waitbutwhy] Long-form curiosity loops with cliffhanger endings.",
    signal: "Avg watch time 82% — driven by \"wait, what next?\" structure.",
    action: "End every reel with an open question that seeds the next video.",
    accent: "#1a2a1a",
    actionBg: "#1a3a28",
  },
];

function InsightCard({ card }: { card: typeof INSTAGRAM_CARDS[0] }) {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden relative flex flex-col gap-5 p-6 select-none"
      style={{ background: "linear-gradient(135deg, #1a1128 0%, #0e0c1a 100%)", minHeight: 240 }}
    >
      {/* Ghost number */}
      <span
        className="absolute top-3 right-5 font-black text-7xl leading-none pointer-events-none select-none"
        style={{ color: "rgba(255,255,255,0.05)" }}
      >
        {card.num}
      </span>

      {/* Title */}
      <h3 className="text-white font-bold text-base md:text-lg leading-snug max-w-[85%] z-10">
        {card.title}
      </h3>

      {/* Data signal */}
      <div className="flex items-start gap-2 z-10">
        <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0 mt-1" />
        <p className="text-[11px] leading-snug">
          <span className="text-pink-400 font-bold uppercase tracking-wider text-[9px]">Data Signal: </span>
          <span className="text-cyan-300">{card.signal} →</span>
        </p>
      </div>

      {/* Recommended action */}
      <div
        className="flex items-start gap-3 rounded-xl p-4 mt-auto z-10 border border-white/5"
        style={{ background: card.actionBg }}
      >
        {/* Target icon */}
        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #ec4899, #f43f5e)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="white" /></svg>
        </div>
        <div>
          <p className="text-[8px] text-gray-400 uppercase tracking-widest font-bold mb-1">Recommended Action</p>
          <p className="text-white font-semibold text-sm leading-snug">{card.action}</p>
        </div>
      </div>
    </div>
  );
}

function Insight3DStack({ cards }: { cards: typeof INSTAGRAM_CARDS }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % cards.length);
    }, 2000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleNext = () => { setActive((p) => (p + 1) % cards.length); startTimer(); };
  const handleDot = (i: number) => { setActive(i); startTimer(); };

  return (
    <div className="relative w-full" style={{ perspective: "1200px" }}>
      <div className="relative" style={{ height: "clamp(340px, 55vw, 400px)" }}>
        {cards.map((card, i) => {
          const offset = (i - active + cards.length) % cards.length;
          const isActive = offset === 0;
          const isNext = offset === 1;
          const rotateY = isActive ? 0 : isNext ? 22 : -22;
          const translateZ = isActive ? 0 : -90;
          const translateX = isActive ? 0 : isNext ? "7%" : "-7%";
          const scale = isActive ? 1 : 0.87;
          const zIndex = isActive ? 30 : isNext ? 20 : 10;
          const opacity = isActive ? 1 : 0.5;

          return (
            <motion.div
              key={i}
              animate={{ rotateY, translateZ, translateX, scale, opacity }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={isActive ? handleNext : undefined}
              style={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
                zIndex,
                cursor: isActive ? "pointer" : "default",
              }}
            >
              <InsightCard card={card} />
            </motion.div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-5">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === active ? "bg-pink-500 w-5" : "w-2 bg-white/20"}`}
          />
        ))}
      </div>
      <p className="text-center text-[10px] text-gray-500 mt-2">Auto-plays · click to jump</p>
    </div>
  );
}

function InstagramInsights3DCards() {
  return <Insight3DStack cards={INSTAGRAM_CARDS} />;
}

function CompetitorAnalysis3DCards() {
  return <Insight3DStack cards={COMPETITOR_CARDS} />;
}

function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Connect your profile",
      desc: "Link your Instagram or Twitter/X account. Trendsta ingests your history, niche, and competitors in seconds.",
    },
    {
      num: "02",
      title: "Get your intelligence brief",
      desc: "Every session, Trendsta delivers a live brief — best post time, viral topics, content gaps, competitor moves, and ready-to-shoot scripts.",
    },
    {
      num: "03",
      title: "Post. Grow. Repeat.",
      desc: "Use your brief to create with confidence. Watch your engagement climb as every post is backed by data — not guesswork.",
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="how">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff5900]/10 border border-[#ff5900]/20 text-[#ff5900] text-xs font-semibold tracking-wide mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#ff5900]">
              <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path>
              <path d="M15 5.764v15"></path>
              <path d="M9 3.236v15"></path>
            </svg>
            Simple process
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-[100px] leading-[0.95] font-display font-normal text-[#1a1a1a] tracking-[-0.03em]">
            From sign-up to<br/>
            <span className="text-[#ff5900] italic">going viral</span>{" "}
            <span className="font-display tracking-tight text-4xl md:text-6xl lg:text-[80px]">— in 3 steps.</span>
          </h2>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* The Card */}
              <div className="h-full bg-cream border border-black/5 rounded-4xl p-8 md:p-10 flex flex-col justify-start relative z-10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                {/* Number */}
                <div className="text-[120px] md:text-[140px] leading-[0.7] font-display italic text-black/4 mb-4 select-none drop-shadow-sm">
                  {step.num}
                </div>
                {/* Text Content */}
                <div className="mt-4 md:mt-6">
                  <h3 className="text-xl md:text-2xl font-bold text-ink mb-4">{step.title}</h3>
                  <p className="text-muted text-sm md:text-base leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* The Bridging Arrow (only between 1-2 and 2-3 on desktop) */}
              {i < 2 && (
                <div className="hidden lg:flex absolute top-1/2 -right-6 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm items-center justify-center text-gray-400 group-hover:text-indigo-500 group-hover:border-indigo-100 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function SuccessStoriesSection() {
  const stories = [
    {
      name: "Arjun Mehta",
      role: "Tech & AI Creator · Instagram",
      initial: "A",
      bgClass: "bg-gradient-to-br from-orange-400 to-[#ff5900]",
      stat: "+340% reach in 6 weeks",
      quote: `"Trendsta told me about AI Ethics before it hit 2M hashtag views. I posted first. 800K views on that reel."`
    },
    {
      name: "Sara Okafor",
      role: "Finance Creator · Twitter / X",
      initial: "S",
      bgClass: "bg-gradient-to-br from-[#00b4ff] to-[#0084ff]",
      stat: "+22K followers in 60 days",
      quote: `"The hook leaderboard alone is worth the subscription. I went from 2% to 9% engagement rate by switching my opening style."`
    },
    {
      name: "Maya Patel",
      role: "Lifestyle · Instagram Reels",
      initial: "M",
      bgClass: "bg-gradient-to-br from-[#a855f7] to-[#ec4899]",
      stat: "First reel hit 1.2M views",
      quote: `"I used to spend hours researching what to post. Now Trendsta does it in seconds — better than I ever could."`
    }
  ];

  return (
    <section className="py-24 bg-cream relative overflow-hidden" id="stories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff5900]/10 border border-[#ff5900]/20 text-[#ff5900] text-xs font-semibold tracking-wide mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#ff5900]">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Success stories
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-[90px] leading-[0.95] font-display font-normal text-[#1a1a1a] tracking-[-0.03em]">
            Creators who stopped<br/>
            guessing — and <span className="text-[#ff5900] italic">started winning.</span>
          </h2>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {stories.map((story, i) => (
            <div key={i} className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg border border-black/5 hover:-translate-y-1 transition-transform duration-300">
              {/* Colored Header */}
              <div className={`h-32 w-full ${story.bgClass} relative`}>
                {/* Avatar overlapping */}
                <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-full bg-[#ff5900] border-4 border-white flex items-center justify-center text-white font-bold text-xl shadow-sm z-10">
                  {story.initial}
                </div>
              </div>
              
              {/* Card Body */}
              <div className="pt-10 pb-8 px-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-ink mb-1">{story.name}</h3>
                <p className="text-muted text-xs font-medium mb-4">{story.role}</p>
                
                {/* Stat Badge */}
                <div className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded bg-[#10b981]/10 text-[#10b981] text-[11px] font-bold self-start mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                  {story.stat}
                </div>
                
                <div className="border-t border-black/5 my-4"></div>
                
                <p className="text-muted text-sm italic leading-relaxed mt-auto">
                  {story.quote}
                </p>
              </div>
            </div>
          ))}
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
    <section id="faq" className="py-24 md:py-32 bg-cream relative border-t border-black/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mb-16 md:mb-24 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff5900]/10 border border-[#ff5900]/20 text-[#ff5900] text-xs font-semibold tracking-wide mb-6 font-sans">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#ff5900]">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Got questions?
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-[90px] leading-[0.95] font-display font-normal text-ink tracking-[-0.03em]">
            Frequently asked<br/>
            <span className="text-[#ff5900] italic">questions.</span>
          </h2>
          <p className="text-muted text-lg md:text-xl font-medium mt-6 font-sans">
            Everything you need to know about growing with Trendsta.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${openIndex === index
                ? "bg-white border-orange-400 shadow-[0_8px_30px_rgba(255,89,0,0.08)]"
                : "bg-white border-border-patreon hover:border-orange-300 shadow-sm"
                }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4"
              >
                <span className={`font-bold font-sans tracking-tight text-lg md:text-xl transition-colors ${openIndex === index ? "text-orange-600" : "text-ink"}`}>
                  {faq.question}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${openIndex === index ? "bg-orange-500/10 text-orange-500" : "bg-cream border border-border-patreon text-muted"}`}>
                  <X size={20} className={`transition-transform duration-300 ${openIndex === index ? "rotate-0" : "rotate-45"}`} />
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
                    <div className="px-6 pb-6 pt-0 md:px-8 md:pb-8 md:pt-0 font-body text-muted leading-relaxed text-base md:text-lg">
                      {faq.answer}
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
    <footer className="bg-[#f6f5f0] border-t border-black/5 py-16 md:py-24 text-gray-500 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand */}
          <div className="flex flex-col gap-6 md:pr-8">
            <div className="flex items-center gap-3">
              <Image src="/T_logo.png" alt="Trendsta Logo" width={36} height={36} className="rounded-xl drop-shadow-sm" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">Trendsta</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              AI-powered content intelligence for creators who want to grow faster, post smarter, and trend harder.
            </p>
          </div>

          {/* Col 2: Product */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold tracking-wider text-gray-900 uppercase mb-1">Product</h4>
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Features</a>
            <a href="#how" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">How it works</a>
            <a href="https://www.trendsta.in/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Demo</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Pricing</a>
          </div>

          {/* Col 3: Company */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold tracking-wider text-gray-900 uppercase mb-1">Company</h4>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">About</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Blog</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Careers</a>
            <a href="mailto:info@trendsta.in" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Contact</a>
          </div>

          {/* Col 4: Legal */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold tracking-wider text-gray-900 uppercase mb-1">Legal</h4>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">Cookie Policy</a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-black/5">
          <div className="text-sm font-medium text-gray-400">© 2026 Trendsta Inc. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <a href="#" className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm">
              <Twitter size={14} fill="currentColor" />
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm font-bold font-sans text-[13px] leading-none">
              in
            </a>
            <a href="#" className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm">
              <Instagram size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Shared CTA ---

function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center text-center px-4">
      {/* Soft warm glow effect behind text (Orb Haze) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#ff5900]/15 blur-[160px] rounded-full pointer-events-none opacity-60"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <h2 className="text-6xl md:text-8xl lg:text-[100px] leading-[0.95] font-display italic text-[#f5f5f5] mb-6 tracking-tight drop-shadow-sm">
          <span className="font-normal not-italic tracking-[-0.04em]">Your</span> next post is<br/>
          a <span className="text-[#ff5900]">viral hit</span><br/>
          waiting to happen.
        </h2>

        <p className="text-[#a1a1aa] text-lg md:text-xl font-medium mb-12 max-w-lg leading-relaxed font-sans">
          Join 10,000+ creators who know what goes viral before they hit publish.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <a href="https://www.trendsta.in/signup" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#18181b] font-bold text-lg hover:-translate-y-0.5 transition-transform shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]">
            Start for free today
          </a>
          <a href="https://www.trendsta.in/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-colors">
            Watch the demo
          </a>
        </div>
      </div>
    </section>
  );
}

// --- Main Page ---

function StatsStrip() {
  const stats = [
    { value: "10K+", label: "Creators growing with Trendsta" },
    { value: "95%", label: "Average engagement boost in 30 days" },
    { value: "2M+", label: "Viral scripts generated" }
  ];

  return (
    <section className="w-full bg-[#111111] py-16 border-y border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] text-center">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-8 md:py-0 px-4">
              <span className="text-6xl md:text-7xl font-display italic text-[#ff5900] mb-3 tracking-tight drop-shadow-sm">
                {stat.value}
              </span>
              <span className="text-gray-400 text-sm md:text-base font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-[#fafafa] text-gray-900 selection:bg-orange-500/30">
      <Navbar />
      <Hero />
      <StatsStrip />
      <InteractiveFeatureTree />
      <HowItWorksSection />
      <SuccessStoriesSection />
      <FAQSection /> {/* Replaced Testimonials with FAQ */}
      <CTASection />
      <Footer />
    </div>
  );
}

