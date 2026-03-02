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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none"
      >
        {/* Main Navbar Pill */}
        <div
          className="pointer-events-auto flex items-center justify-between h-14 px-2 pr-6 rounded-[20px] bg-[#1a1c1d]/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300"
          style={{ width: "min(600px, 90vw)" }}
        >
          {/* Logo Container */}
          <a href="#home-page" className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden group shrink-0 transition-opacity hover:opacity-80">
            <Image src="/T_logo.png" alt="Trendsta" width={32} height={32} className="object-contain" />
          </a>

          {/* Desktop Navigation Links (Hidden on small screens) */}
          <div className="hidden sm:flex items-center gap-6 mx-auto absolute left-1/2 -translate-x-1/2 text-white/80 font-medium text-sm tracking-wide">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#faqs" className="hover:text-white transition-colors duration-200">FAQs</a>
            <a href="mailto:hello@trendsta.com" className="hover:text-white transition-colors duration-200">Contact</a>
          </div>

          {/* Spacer */}
          <div className="flex-1 sm:hidden" />

          {/* Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/5 flex flex-col items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-white/20 z-10"
          >
            <motion.div
              animate={isMobileMenuOpen ? { rotate: 45, y: 4, backgroundColor: "#fff" } : { rotate: 0, y: 0, backgroundColor: "#fff" }}
              className="w-4 h-[1.5px] rounded-full origin-center"
            />
            <motion.div
              animate={isMobileMenuOpen ? { rotate: -45, y: -3.5, backgroundColor: "#fff" } : { rotate: 0, y: 0, backgroundColor: "#fff" }}
              className="w-4 h-[1.5px] rounded-full origin-center"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mega Menu Dropdown Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[min(480px,95vw)] bg-white/95 backdrop-blur-2xl z-40 border border-black/10 rounded-3xl shadow-2xl p-6 sm:p-8"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* Column 1: Explore */}
              <div className="flex flex-col space-y-3">
                <h6 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Explore</h6>
                <a href="#overview" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 hover:text-indigo-400 font-medium text-sm transition-colors">Overview</a>
                <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 hover:text-indigo-400 font-medium text-sm transition-colors">About</a>
                <a href="#why-us" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 hover:text-indigo-400 font-medium text-sm transition-colors">Why Us</a>
              </div>

              {/* Column 2: What We Do */}
              <div className="flex flex-col space-y-3">
                <h6 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">What We Do</h6>
                <a href="#products" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 hover:text-indigo-400 font-medium text-sm transition-colors">Products</a>
                <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 hover:text-indigo-400 font-medium text-sm transition-colors">Features</a>
                <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 hover:text-indigo-400 font-medium text-sm transition-colors">Testimonials</a>
              </div>

              {/* Column 3: Contact */}
              <div className="flex flex-col space-y-3 col-span-2 sm:col-span-1 border-t border-black/10 pt-6 sm:pt-0 sm:border-t-0">
                <h6 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Contact</h6>
                <a href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 hover:text-indigo-400 font-medium text-sm transition-colors">Start a project</a>
                <a href="mailto:hello@mvnstudio.com" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 hover:text-indigo-400 font-medium text-sm transition-colors">Email us</a>
                <a href="tel:+10001234567" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-900 hover:text-indigo-400 font-medium text-sm transition-colors">Book a call</a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/10 flex flex-col sm:flex-row gap-3">
              <a
                href="/signup"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl"
              >
                Get Started
              </a>
              <a
                href="/dashboard"
                className="w-full text-center px-6 py-3 bg-black/5 border border-black/10 text-gray-900 text-sm font-semibold rounded-xl hover:bg-black/5 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden flex flex-col items-center min-h-[100svh] px-4 sm:px-8 py-8 md:py-12 bg-[#0a0a0a]">

      {/* Background Image with Overlay */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        style={{ opacity }}
      >
        <img
          src="/trendsta_background_24fps.webp"
          alt="Background"
          className="object-cover w-full h-full opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
      </motion.div>

      {/* Main Content Area */}
      <div className="w-full h-full flex flex-col justify-end relative z-20 flex-1">

        {/* Giant Main Title (Left Aligned) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full"
        >
          <motion.h1
            className="text-[12vw] sm:text-[10vw] md:text-[80px] leading-[0.9] tracking-[-0.03em] font-sans font-black m-0 p-0 text-white"
            style={{
              background: "linear-gradient(90deg, #ffffffff, #ffffffff, #f97316, #ea580c, #ffffffff, #ffffffff)",
              backgroundSize: "400% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
            animate={{ backgroundPosition: ["100% 50%", "-300% 50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          >
            TRENDSTA
          </motion.h1>
        </motion.div>



        {/* Bottom Section (Buttons & Text stacked left) */}
        <div className="mt-4 w-full flex flex-col items-start gap-8 pb-12 pt-40 md:pt-0">

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto relative z-20">
            <a
              href="/signup"
              className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-full hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all hover:scale-105 active:scale-95 text-base md:text-lg flex justify-center"
            >
              Get Started
            </a>
            <a
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white border border-white/50 text-sm font-bold tracking-wider uppercase transition-all hover:bg-white/10 hover:-translate-y-0.5"
            >
              View Demo
            </a>
          </div>

          {/* Punchline under buttons */}
          <div className="max-w-[500px] md:max-w-[700px] text-left mt-6">
            <p className="text-xl md:text-3xl text-gray-200 leading-[1.3] font-medium tracking-tight">
              Your personal AI consultant for growth. Custom AI solutions, built for the content innovators of tomorrow.
            </p>
          </div>

        </div>

      </div>


      {/* Scroll Indicator — elegantly centered at bottom of hero */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <ScrollIndicator color="#e5e7eb" duration={2.5} />
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
    <section className="pt-6 md:pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4 md:mb-8">
          Optimized for Growth on
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, i) => (
            <div key={i} className="flex items-center gap-2 group cursor-pointer hover:opacity-100 transition-opacity">
              <logo.Icon className="text-gray-900 group-hover:text-gray-900 transition-colors" size={20} />
              <span className="font-semibold text-base md:text-lg text-gray-600 group-hover:text-gray-900 transition-colors">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
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
  graphic,
}: {
  id: string;
  textSide?: "left" | "right";
  badge: string;
  title: React.ReactNode;
  description: string;
  bullets: string[];
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

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false, margin: "-60px" }}
        className="text-lg text-gray-500 leading-relaxed max-w-md"
      >
        {description}
      </motion.p>

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
    <div id={id} className="min-h-screen flex items-center bg-[#fafafa] border-b border-black/5 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-8 bg-white rounded-xl p-4 border border-black/10 flex flex-col">
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
            <div className="col-span-4 bg-white rounded-xl p-4 border border-black/10 flex flex-col">
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
    <div className="w-full bg-[#1a1a2e] rounded-2xl overflow-hidden flex flex-col md:flex-row select-none" style={{ minHeight: 220 }}>
      {/* Left panel */}
      <div className="flex flex-col items-center justify-center gap-3 p-6 bg-[#141428] md:w-52 shrink-0 relative">
        {/* Tag */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2a2a4a] border border-purple-500/30 text-purple-400 text-[9px] font-bold tracking-wider">
          <Zap size={8} fill="currentColor" /> {card.tag}
        </div>
        {/* Score ring */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90 absolute inset-0">
            <circle cx="48" cy="48" r={r} fill="none" stroke="#2a2a4a" strokeWidth="6" />
            <circle
              cx="48" cy="48" r={r} fill="none"
              stroke={card.scoreColor} strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
            />
          </svg>
          <span className="relative text-2xl font-bold text-white font-mono">{card.score}</span>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1">Why This Works</p>
          <p className="text-[11px] text-gray-300 leading-snug text-center">{card.whyWorks}</p>
        </div>
        {/* Audio Vibe */}
        <div className="w-full bg-[#1a1a2e]/80 rounded-xl px-3 py-2 border border-white/5">
          <p className="text-[8px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
            <Zap size={8} fill="currentColor" /> Audio Vibe
          </p>
          <p className="text-[10px] text-gray-300">{card.audioVibe}</p>
        </div>
        {/* Duration */}
        <div className="flex items-center gap-1.5 w-full bg-[#1a1a2e] border border-white/5 rounded-xl px-3 py-2 justify-center">
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
      <div className="relative" style={{ height: 280 }}>
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

function HoverListFeaturesSection() {
  return (
    <section id="features" className="relative bg-[#fafafa]">

      {/* Section Header â€” non-sticky, just an intro */}
      <div className="flex flex-col items-center justify-center text-center w-full pt-16 md:pt-20 px-4 bg-[#fafafa]">
        <ShutterReveal bgColor="#fafafa">
          <h2 className="text-6xl md:text-8xl lg:text-[110px] leading-[0.85] font-bold font-mono text-gray-900 flex flex-col uppercase items-center">
            {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">trendsta</span> */}
            <span>services</span>
          </h2>
        </ShutterReveal>
        <p className="text-xl md:text-3xl text-gray-500 leading-tight font-medium max-w-2xl mt-6">
          In the content wilderness,<br />creators find our AI tools truly invaluable.
        </p>
      </div>

      {/* â€”â€”â€” Dashboard â€”â€”â€” */}
      <div>
        <ServicePanel
          id="service-dashboard"
          textSide="left"
          badge="Analytics Dashboard"
          title={<><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">Real-time</span> data,{" "}optimised for you</>}
          description="Your personal growth command centre. Trendsta pulls live data from your niche, analyses every metric that matters, and surfaces the exact actions that will scale your channel."
          bullets={[
            "Picks up real-time trend & competitor data every session",
            "Analyses your pace, hook style, and content gaps automatically",
            "Gives you the best posting time, topic, and audio recommendations",
            "Deep-dive into any insight with one click â€” know more, grow faster",
          ]}
          graphic={
            <DashboardGraphic />
          }
        />
      </div>

      {/* â€”â€”â€” AI Consultant â€”â€”â€” */}
      <div>
        <ServicePanel
          id="service-ai-consultant"
          textSide="right"
          badge="AI Consultant"
          title={<>Your personal<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">AI strategist</span></>}
          description="Go beyond dashboards. Have a real conversation with your data. Ask any growth question and get a personalised answer built from your channel's unique history and real-time trends."
          bullets={[
            "Context-aware â€” understands your specific niche and history",
            "Proactive Strategy â€” suggests your next move before you ask",
            "Real-time trend correlation mapped to your engagement",
            "Six specialised modes: Trending, Viral Ideas, Competitors, and more",
          ]}
          graphic={
            <div className="relative z-20 rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 bg-[#0a0a0a] flex flex-col items-center pt-10 px-6 pb-8 select-none">
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
          }
        />
      </div>

      {/* â€”â€”â€” Twitter Insights â€”â€”â€” */}
      <div>
        <ServicePanel
          id="service-twitter"
          textSide="left"
          badge="Twitter / X Insights"
          title={<>Spot trends<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-500">before they peak</span></>}
          description="Monitor the Twitter/X pulse in real time. Track viral hashtags, top creators in your niche, and audience sentiment â€” then ride the wave with perfectly timed content."
          bullets={[
            "Real-time trending hashtags with volume & velocity data",
            "Top tweet analysis: hooks, engagement patterns, and reach",
            "Audience sentiment breakdown â€” positive, neutral, negative",
            "Competitor growth tracking mapped day-by-day",
          ]}
          graphic={
            <div className="relative z-20 rounded-2xl overflow-hidden shadow-2xl border border-black/10 bg-[#0d0d0d]">
              <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-white/5 text-sm font-semibold">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-500 rounded-lg border border-orange-500/20 text-xs">
                  <Zap size={12} fill="currentColor" /> Top Tweets
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 text-gray-400 rounded-lg text-xs transition-colors">Latest</button>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { name: "Banxcartoons", handle: "@Banxcartoons", score: "8.2", text: 'From today\'s @FT #ElonMusk #SpaceX #ArtificialIntelligence', likes: "30", retweets: "10", views: "472", grad: "from-green-400 to-cyan-500" },
                  { name: "Ronald_vanLoon", handle: "@Ronald_vanLoon", score: "3.3", text: '7 #Skills #AI Can\'t Replace (Yet) â€” #ArtificialIntelligence #MachineLearning', likes: "210", retweets: "54", views: "12K", grad: "from-blue-400 to-purple-500" },
                ].map((t, i) => (
                  <div key={i} className="bg-[#161819] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.grad} flex-shrink-0`} />
                        <div>
                          <p className="font-bold text-white text-xs">{t.name}</p>
                          <div className="flex items-center gap-1 text-gray-500 text-[10px]">
                            <span>{t.handle}</span><span>â€¢</span>
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
          }
        />
      </div>

      {/* â€”â€”â€” Script Ideas â€”â€”â€” */}
      <div>
        <ServicePanel
          id="service-scripts"
          textSide="right"
          badge="Script Ideas"
          title={<>Never run out<br />of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">viral ideas</span></>}
          description="Trendsta generates ready-to-use script ideas scored by viral potential, built on real-time trend data. Each idea comes with a hook, payoff, and audio recommendation."
          bullets={[
            "Scored 0â€“100 for viral potential based on your niche data",
            "Complete hook + payoff structure for every idea",
            "Audio vibe and target length recommendations included",
            "Pinpoints market gaps your competitors are missing",
          ]}
          graphic={
            <ScriptIdeas3DCards />
          }
        />
      </div>

      {/* ——— Instagram Insights ——— */}
      <div>
        <ServicePanel
          id="service-instagram"
          textSide="left"
          badge="Instagram Insights"
          title={<>Know exactly what<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">works on Instagram</span></>}
          description="Trendsta dissects your Instagram niche in real time — analysing hashtags, content types, and engagement patterns so you post with precision, not guesswork."
          bullets={[
            "Hashtag velocity: which tags drive reach vs community",
            "Content-type breakdown: reels vs carousels vs stories",
            "Speaking pace benchmarks vs top creators in your niche",
            "Actionable recommendations tied directly to data signals",
          ]}
          graphic={<InstagramInsights3DCards />}
        />
      </div>

      {/* ——— Competitor Analysis ——— */}
      <div>
        <ServicePanel
          id="service-competitors"
          textSide="right"
          badge="Competitor Analysis"
          title={<>Reverse-engineer<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">your competition</span></>}
          description="See exactly why your top competitors are winning. Trendsta decodes their formats, hooks, and narrative strategies so you can adopt what works and fill what they miss."
          bullets={[
            "Frame-by-frame breakdown of competitor storytelling style",
            "Pace, density, and emotional hook analysis",
            "Surface content formats your rivals haven't tried yet",
            "Actionable copy-and-improve strategies for each competitor",
          ]}
          graphic={<CompetitorAnalysis3DCards />}
        />
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
        <span className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0 mt-1" />
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
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
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
      <div className="relative" style={{ height: 300 }}>
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

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "We needed intelligent automation — and they nailed it. Every step was collaborative, transparent, and focused on delivering the best outcome for us.",
      author: "Brendan",
      role: "Marketing Director at StratIQ",
      image: "https://framerusercontent.com/images/cZ9VBNOcSpg8RiRzIkAXdz6ScF4.png",
      rating: 5
    },
    {
      quote: "Their team helped us identify key opportunities for AI, then built tools that boosted both our speed and accuracy. We're already seeing results.",
      author: "Lena M",
      role: "Manager at NovaTech",
      image: "https://framerusercontent.com/images/PG5vQAQIzOrDyrT8NDWpDNTPoY.png",
      rating: 5
    },
    {
      quote: "From ideation to final delivery, they were incredibly proactive and sharp. Our new AI-powered assistant reduced manual work and improved user satisfaction.",
      author: "Eli R",
      role: "COO at GridFrame",
      image: "https://framerusercontent.com/images/gcvmIxm2XRx6NG3kYAPz3zZXc6E.jpg",
      rating: 5
    }
  ];

  const stats = [
    { value: "10k+", label: "Creators Onboarded" },
    { value: "95%", label: "Engagement Boost" },
    { value: "2M+", label: "Scripts Generated" }
  ];

  return (
    <section id="reviews" className="py-16 md:py-24 bg-[#fafafa] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 text-gray-600 text-[10px] font-bold tracking-widest uppercase mb-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-4 h-4 text-gray-500 fill-current">
              <path d="M240,102c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,228.66,16,172,16,102A62.07,62.07,0,0,1,78,40c20.65,0,38.73,8.88,50,23.89C139.27,48.88,157.35,40,178,40A62.07,62.07,0,0,1,240,102Z" />
            </svg>
            CUSTOMERS
          </div>
          <ShutterReveal bgColor="#fafafa">
            <h2 className="text-6xl md:text-8xl lg:text-[110px] leading-[0.85] font-bold tracking-[-0.06em] font-mono text-gray-900 mb-4 md:mb-6 flex flex-col uppercase items-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">
                what our
              </span>
              <span>clients say</span>
            </h2>
          </ShutterReveal>
          <p className="text-lg text-gray-500">
            Join customers who trust AI to transform their business.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-stretch mb-20">

          {/* Main Hero Testimonial */}
          <div className="flex-1 w-full bg-black/5 border border-black/10 rounded-3xl p-8 md:p-12 flex flex-col justify-center items-center shadow-inner relative overflow-hidden">

            <h4 className="text-xl md:text-3xl font-bold text-gray-900 leading-snug text-center max-w-2xl relative z-10">
              Their <span className="text-indigo-500">AI-driven</span> approach helped us reach the right audience and <span className="text-indigo-500">grow faster</span> with smarter insights—streamlining our strategy, improving engagement, and <span className="text-indigo-500">delivering results</span> we couldn't achieve before.
            </h4>
            <div className="absolute opacity-5 -top-10 -left-10 w-64 h-64 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
                <path d="M116,72v88a48.05,48.05,0,0,1-48,48,8,8,0,0,1,0-16,32,32,0,0,0,32-32v-8H40a16,16,0,0,1-16-16V72A16,16,0,0,1,40,56h60A16,16,0,0,1,116,72ZM216,56H156a16,16,0,0,0-16,16v64a16,16,0,0,0,16,16h60v8a32,32,0,0,1-32,32,8,8,0,0,0,0,16,48.05,48.05,0,0,0,48-48V72A16,16,0,0,0,216,56Z" />
              </svg>
            </div>
          </div>

          {/* Hero Banner Image */}
          <div className="w-full lg:w-[45%] h-64 md:h-[400px] lg:h-auto rounded-3xl overflow-hidden shadow-2xl relative border border-black/10 shrink-0">
            <Image
              src="https://framerusercontent.com/images/LQKuaHoocBNNOUwcuUIayGZ8z8.png"
              alt="Customer Success Banner"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* 3 Column Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {testimonials.map((test, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-xl border border-black/5 flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(test.rating)].map((_, idx) => (
                    <svg key={idx} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="w-5 h-5 text-gray-900 fill-current">
                      <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-500 leading-relaxed text-sm mb-6">
                  {test.quote}
                </p>
              </div>

              <div>
                <div className="border-t-[3px] border-dotted border-black/20 w-full mb-4" />
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative shadow-sm border border-black/10 shrink-0">
                    <Image src={test.image} alt={test.author} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{test.author}</p>
                    <p className="text-xs text-gray-500 font-medium">{test.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats Line */}
        <div className="flex flex-col md:flex-row justify-around items-center gap-10 md:gap-4 pt-10 border-t border-black/10">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <h3 className="text-3xl md:text-4xl font-mono font-bold text-gray-900 tracking-[-0.05em] mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-500 text-sm underline decoration-gray-300 underline-offset-4">
                {stat.label}
              </p>
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
    <section id="faq" className="py-8 md:py-24 bg-[#fafafa] relative border-t border-black/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <ShutterReveal bgColor="#fafafa">
            <h2 className="text-6xl md:text-8xl lg:text-[110px] leading-[0.85] font-bold tracking-[-0.06em] font-mono text-gray-900 mb-6 flex flex-col uppercase items-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">
                frequently
              </span>
              <span>asked</span>
            </h2>
          </ShutterReveal>
          <p className="text-xl md:text-3xl text-gray-600 leading-tight font-medium mt-6">
            Everything you need to know about growing with Trendsta.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 ${openIndex === index
                ? "bg-black/5 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.1)]"
                : "bg-white/[0.02] border-black/10 hover:bg-white/[0.04]"
                }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-5 py-4 md:px-6 md:py-5 flex items-center justify-between gap-4"
              >
                <span className={`font-semibold text-base md:text-lg ${openIndex === index ? "text-gray-900" : "text-gray-600"}`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${openIndex === index ? "bg-indigo-500/20 text-indigo-400" : "bg-black/5 text-gray-500"}`}>
                  {openIndex === index ? <X size={16} className="rotate-45" /> : <X size={16} className="rotate-0" />}
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
                    <div className="px-5 pb-5 pt-0 md:px-6 md:pb-6 md:pt-0 text-gray-500 leading-relaxed border-t border-black/10 mt-2 text-sm md:text-base">
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
    <footer className="bg-gray-100 border-t border-black/10 py-8 text-gray-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Image src="/T_logo.png" width={32} height={32} alt="Trendsta" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">Trendsta</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <a href="mailto:info@trendsta.in" className="hover:text-gray-900 transition-colors">
            info@trendsta.in
          </a>
          <div>© {new Date().getFullYear()} Trendsta Inc. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

// --- Main Page ---

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-[#fafafa] text-gray-900 selection:bg-violet-500/30">
      <Navbar />
      <Hero />
      <TrustStrip />
      <HoverListFeaturesSection />
      <TestimonialsSection />
      <FAQSection /> {/* Added FAQ Section */}
      <Footer />
    </div>
  );
}

