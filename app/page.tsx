"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Check,
  ChevronRight,
  MapPin,
  BarChart3,
  FileText,
  Instagram,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";

interface WaitListProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  submitted: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
// --- Animation Variants ---

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
};

// --- Components ---

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Image src={"/logo3.png"} width={150} height={150} alt="logo" />
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#how-it-works"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                How it works
              </a>
              <a
                href="#features"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Features
              </a>
              <a
                href="/pricing"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#faqs"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                FAQs
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <a
                href="#waitlist"
                className="px-4 py-2 bg-white text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-200 transition-all shadow-sm hover:shadow-md"
              >
                Join Waitlist
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-slate-600 rounded-lg"
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
            className="md:hidden fixed inset-x-0 top-16 backdrop-blur-md z-50 overflow-hidden shadow-xl bg-white/90 border-b border-slate-200"
          >
            <div className="px-4 py-6 space-y-4">
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  // let el = document.getElementById("how-it-works");
                  // console.log(el);
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="block px-4 py-3 text-base font-semibold text-slate-600 rounded-lg"
              >
                How it works
              </a>
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="block px-4 py-3 text-base font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Features
              </a>
              <a
                href="#faqs"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document
                    .getElementById("faqs")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="block px-4 py-3 text-base font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                FAQs
              </a>
              <div>
                <a
                  href="#waitlist"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    document
                      .getElementById("waitlist")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block w-full text-center px-4 py-3 bg-white text-slate-900 text-base font-semibold rounded-xl hover:bg-slate-200 transition-all shadow-md active:scale-95"
                >
                  Join Waitlist
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero({ email, submitted, setEmail, handleSubmit }: WaitListProps) {
  return (
    <section className="relative overflow-hidden pt-12 md:pt-20 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-semibold lg:text-6xl text-slate-900 tracking-tight leading-[1.1] mb-6 "
            >
              Your AI content consultant. <br />
              <span className="text-slate-500">Not just a tool.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-md sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-lg"
            >
              Trendsta tells you exactly what to post, backed by real trending
              data from top-performing reels. Stop guessing, start growing.
            </motion.p>

            <motion.div variants={fadeInUp} className="max-w-sm">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-2"
                >
                  <Check size={20} />
                  <span className="font-medium">
                    You're on the list! We'll be in touch.
                  </span>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-2 mb-3"
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap"
                  >
                    Join Waitlist
                  </button>
                </form>
              )}
              {!submitted && (
                <p className="text-xs text-slate-400 pl-1">
                  <span className="text-green-600 font-medium">
                    ● 400+ creators
                  </span>{" "}
                  joined this week.
                </p>
              )}
            </motion.div>
          </motion.div>

          {/* Visual/Demo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full flex items-center justify-center lg:justify-end"
          >
            {/* Abstract Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-900/20 to-indigo-900/20 rounded-full blur-3xl -z-10 opacity-60" />

            {/* Float Cards */}
            <div className="relative w-full max-w-md">
              {/* Main Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-2xl p-6 relative z-10"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Viral Opportunity
                      </h3>
                      <p className="text-xs text-slate-500">
                        Found in your niche
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100">
                    94% Score
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wider text-[10px]">
                      Title Idea
                    </p>
                    <p className="text-slate-900 font-medium">
                      "Stop using generic hooks (Do this instead)"
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider text-[10px]">
                      Why it works
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Top creators in{" "}
                      <span className="font-medium text-slate-900">
                        Marketing
                      </span>{" "}
                      are pivoting to contrarian takes. This angle has{" "}
                      <span className="font-medium text-green-600">
                        2.5x higher engagement
                      </span>{" "}
                      this week.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300" />
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400 flex items-center justify-center text-[10px] text-white font-medium">
                      +12
                    </div>
                  </div>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    Use this script <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 z-20 hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                    <BarChart3 size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Trend Growth</p>
                    <p className="text-sm font-bold text-slate-900">+124% 🚀</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-xl border border-slate-100 z-20 hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Script Generated</p>
                    <p className="text-sm font-bold text-slate-900">Just now</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="py-10 mt-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <p className="text-center text-sm sm:font-medium text-slate-400 mb-6">
          INTEGRATES WITH YOUR FAVORITE PLATFORMS
        </p>
        <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center justify-center gap-2">
            <Instagram size={24} />
            <span className="font-semibold text-xl">Instagram</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
              <span className="text-[10px] font-bold">in</span>
            </div>
            <span className="font-semibold text-xl">LinkedIn</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="text-xl font-bold tracking-tighter">X</div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 bg-current rounded-sm"></div>
            <span className="font-semibold text-xl">Notion</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: "1. Tell us about you",
      desc: "Input your niche, location, and target audience. Trendsta adapts to your specific context.",
    },
    {
      icon: BarChart3,
      title: "2. Analysis",
      desc: "We analyze thousands of top-performing reels and competitor content in real-time.",
    },
    {
      icon: FileText,
      title: "3. Get Direction",
      desc: "Receive clear, data-backed content ideas and scripts. No more guessing what to post.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            How Trendsta Works
          </h2>
          <p className="text-slate-600 text-lg">
            Your personal content strategist, simplified into three steps.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                <step.icon size={24} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section >
  );
}

function Features() {
  return (
    <section id="features" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Feature 1 */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
              <Image
                src="/landing/execution-plan.png"
                alt="Execution Plan"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6">
              <BarChart3 size={12} />
              DATA-BACKED
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Stop guessing what will go viral.
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Most creators post randomly and hope for the best. Trendsta
              analyzes thousands of top reels in your niche to find patterns.
            </p>
            <ul className="space-y-4">
              {[
                "Identify trending hooked structures",
                "Analyze competitor performance gaps",
                "Spot rising topics before they peak",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Feature 2 */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-6">
              <FileText size={12} />
              ACTIONABLE
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Get specific scripts, not just "ideas".
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              We don't just dump data on you. We translate insights into
              ready-to-record scripts tailored to your voice.
            </p>
            <ul className="space-y-4">
              {[
                "Hook, value, and CTA structure included",
                "Why this script works (so you learn)",
                "Customized triggers for your audience",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
              <Image
                src="/landing/script-ideas.png"
                alt="Script Ideas"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PrimaryCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
    console.log(email);
  };

  return (
    <section id="waitlist" className="py-24 border-t border-slate-100">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-3xl mx-auto px-4 text-center"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-4xl font-bold text-slate-900 mb-6"
        >
          Start posting with confidence.
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-lg text-slate-600 mb-10">
          Join the waitlist to get early access and lock in founder pricing.
          <br className="hidden sm:block" /> No spam. Just value.
        </motion.p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center justify-center gap-2"
          >
            <Check size={20} />
            <span className="font-medium">
              You're in . We'll be in touch soon!
            </span>
          </motion.div>
        ) : (
          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 mb-4"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg whitespace-nowrap"
            >
              Join Waitlist
            </button>
          </motion.form>
        )}
        {!submitted && (
          <motion.p variants={fadeInUp} className="text-sm text-slate-400">
            Limited spots available for the beta release.
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}

function FAQS() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Who is Trendsta for?",
      a: "Trendsta is built for content creators, founders building personal brands, and social media managers who want data-backed direction rather than just analytics.",
    },
    {
      q: "Is this just another analytics tool?",
      a: "No. Analytics tools tell you what happened in the past. Trendsta acts as a consultant to tell you what to do in the future to grow.",
    },
    {
      q: "How does the AI know my niche?",
      a: "During onboarding, you provide details about your niche and location. Our system then identifies and monitors top performers in that specific vertical.",
    },
    {
      q: "When will I get access?",
      a: "We are rolling out invites weekly to ensure the best experience. Joining the waitlist secures your spot in line.",
    },
  ];

  return (
    <section id="faqs" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-slate-900 mb-12 text-center"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-blue-500/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-slate-900 pr-8">
                  {faq.q}
                </span>
                {openIndex === i ? (
                  <ChevronUp className="text-blue-600" />
                ) : (
                  <ChevronDown className="text-slate-400" />
                )}
              </button>

              {openIndex === i && (
                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Image src={"/logo3.png"} width={200} height={200} alt="Logo" />
        </div>

        <div className="flex gap-8 text-sm text-slate-500">
          <a href="#" className="hover:text-slate-900 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            Contact
          </a>
        </div>

        <div className="text-sm text-slate-400">
          © {new Date().getFullYear()} Trendsta. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// --- Main Page ---

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen font-sans text-slate-900">
      <Navbar />
      <Hero
        email={email}
        setEmail={setEmail}
        submitted={submitted}
        handleSubmit={handleSubmit}
      />
      <TrustStrip />
      <HowItWorks />
      <Features />
      <PrimaryCTA />
      <FAQS />
      <Footer />
    </div>
  );
}
