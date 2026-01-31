"use client";

import React, { useState } from "react";
import { FileText, Clock, Target, Hash, ChevronDown, ChevronUp, Copy, Check, Sparkles, Lightbulb, MessageCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import NoSocialAccount from "../components/NoSocialAccount";
import NoResearchState from "../components/NoResearchState";
import { useScriptSuggestions } from "@/hooks/useResearch";
import { transformScriptSuggestion } from "@/lib/transformers";
import { useSession } from "@/lib/auth-client";
import { useSocialAccount } from "@/hooks/useSocialAccount";

export default function ScriptIdeasClient() {
    const { data: rawData, isLoading, error, isNoResearch } = useScriptSuggestions();
    const { data: session } = useSession();
    const { data: socialAccount } = useSocialAccount();

    const [expandedScript, setExpandedScript] = useState<number | null>(null);
    const [copiedSection, setCopiedSection] = useState<string | null>(null);

    // Debug logging
    console.log("ScriptIdeas Debug:", {
        hasSession: !!session?.user,
        sessionEmail: session?.user?.email,
        isNoResearch,
        hasData: !!rawData,
        error: error?.message,
    });
    console.log("=== COMPONENT RENDER ===");

    const scripts = Array.isArray(rawData) ? rawData.map(transformScriptSuggestion) : [];

    const copyToClipboard = (text: string, section: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    const toggleScript = (id: number) => {
        setExpandedScript(expandedScript === id ? null : id);
    };

    // Loading State - only show loading if not in error state
    if (isLoading && !error && !isNoResearch) {
        return (
            <div className="min-h-screen bg-transparent">
                <Sidebar />
                <MobileHeader />
                <main className="md:ml-64 p-4 md:p-8 flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        <p className="text-theme-secondary">Generating script ideas...</p>
                    </div>
                </main>
            </div>
        );
    }

    // No research state for logged-in users
    if (isNoResearch && session?.user) {
        return (
            <div className="min-h-screen bg-transparent">
                <Sidebar />
                <MobileHeader />
                <main className="md:ml-64 p-4 md:p-8">
                    <NoResearchState />
                </main>
            </div>
        );
    }

    // Error State - Check if it's a "no social account" error
    if (error) {
        const errorMessage = (error as { message?: string })?.message || "";
        const isNoAccountError = errorMessage.toLowerCase().includes("social account") ||
            errorMessage.toLowerCase().includes("connect your instagram");

        return (
            <div className="min-h-screen bg-transparent">
                <Sidebar />
                <MobileHeader />
                <main className="md:ml-64 p-4 md:p-8 flex items-center justify-center min-h-screen">
                    {isNoAccountError ? (
                        <NoSocialAccount message="Connect your Instagram account to generate personalized script ideas." />
                    ) : (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
                            <p className="text-red-600 font-medium">Failed to load scripts</p>
                            <p className="text-red-500 text-sm mt-2">{(error as Error).message}</p>
                        </div>
                    )}
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent">
            {/* Subtle Top Gradient */}
            <div className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />

            <Sidebar />
            <MobileHeader />

            <main className="md:ml-64 p-4 md:p-12 relative z-10">
                <div className="max-w-5xl mx-auto space-y-10">
                    {/* Header */}
                    <div className="space-y-3 animate-fadeInUp">
                        <h1 className="text-3xl font-bold text-theme-primary tracking-tight">Script Ideas</h1>
                        <p className="text-lg text-theme-secondary max-w-xl">
                            Curated high-viral potential scripts based on current trends.
                        </p>
                    </div>

                    {/* Scripts List */}
                    <div className="space-y-6">
                        {scripts.map((script, index) => {
                            const scriptId = index;
                            const isExpanded = expandedScript === scriptId;
                            const viralScore = script.viral_potential_score || 0;

                            return (
                                <motion.div
                                    layout
                                    key={scriptId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className={`
                                        glass-panel transition-all duration-300 overflow-hidden
                                        ${isExpanded ? 'border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/30' : 'hover:bg-white/5'}
                                    `}
                                >
                                    {/* Summary Card (Clickable) */}
                                    <div
                                        className="p-6 cursor-pointer"
                                        onClick={() => toggleScript(scriptId)}
                                    >
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                                            {/* Left Col: Viral Gauge & Info */}
                                            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-white/5 dark:bg-white/5 rounded-2xl border border-white/10 dark:border-white/10 relative group/gauge">
                                                <div className="absolute top-3 right-3">
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 dark:bg-white/10 rounded-full border border-white/20 dark:border-white/20 shadow-sm">
                                                        <Sparkles size={10} className="text-purple-400" />
                                                        <span className="text-[10px] font-bold text-theme-primary uppercase tracking-wide">
                                                            {viralScore >= 90 ? 'Viral' : 'High'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="relative w-28 h-28 mb-4">
                                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="8" />
                                                        <circle
                                                            cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="8"
                                                            strokeDasharray={`${2 * Math.PI * 40}`}
                                                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - viralScore / 100)}`}
                                                            strokeLinecap="round"
                                                            className="transition-all duration-1000 ease-out"
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-3xl font-black text-theme-primary">{viralScore}</span>
                                                    </div>
                                                </div>

                                                <div className="w-full space-y-3">
                                                    <div className="text-xs font-semibold text-theme-secondary">Why This Works</div>
                                                    <p className="text-xs text-theme-secondary leading-snug line-clamp-2">
                                                        {script.why_this_works}
                                                    </p>

                                                    {/* Audio Vibe Badge */}
                                                    {script.audio_vibe && (
                                                        <div className="flex items-start gap-2 text-left bg-white/5 border border-white/10 p-2 rounded-lg">
                                                            <div className="mt-0.5"><Sparkles size={10} className="text-purple-400" /></div>
                                                            <div>
                                                                <span className="text-[10px] font-bold text-theme-secondary uppercase block">Audio Vibe</span>
                                                                <p className="text-[10px] text-theme-secondary font-medium leading-tight">{script.audio_vibe}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 dark:bg-white/10 border border-white/20 dark:border-white/20 rounded-lg shadow-sm w-full justify-center">
                                                        <Clock size={12} className="text-theme-secondary" />
                                                        <span className="text-[10px] font-bold text-theme-primary">
                                                            {script.estimated_duration} • {script.script_word_count} words
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Col: Hook & Strategy */}
                                            <div className="lg:col-span-8 space-y-5 flex flex-col justify-center">
                                                {/* ... (Keep existing Header & Title ...) */}
                                                <div className="flex items-start justify-between">
                                                    <h2 className="text-lg font-bold text-theme-primary">{script.script_title}</h2>
                                                    <button className="text-sm font-semibold text-purple-600 flex items-center gap-1 hover:text-purple-700 transition-colors">
                                                        {isExpanded ? 'Collapse' : 'View Details'}
                                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                    </button>
                                                </div>

                                                {/* The Hook */}
                                                <div>
                                                    <h3 className="text-[10px] font-bold text-theme-muted uppercase tracking-widest mb-2">The Hook</h3>
                                                    <div className="p-4 bg-slate-900 dark:bg-slate-800 rounded-xl shadow-md border border-slate-800 dark:border-slate-700 relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Copy size={14} className="text-slate-400 hover:text-white cursor-pointer" onClick={(e) => { e.stopPropagation(); copyToClipboard(script.script_hook, `hook-${scriptId}`); }} />
                                                        </div>
                                                        <p className="text-lg md:text-xl font-bold text-white leading-snug">
                                                            "{script.script_hook}"
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Strategy Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <h3 className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">The Payoff</h3>
                                                        <div className="p-3 bg-green-500/10 dark:bg-green-500/10 border border-green-500/30 dark:border-green-500/30 rounded-xl h-full">
                                                            <p className="text-xs text-green-700 dark:text-green-300 font-medium leading-relaxed">
                                                                {script.script_value}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="text-[10px] font-bold text-theme-muted uppercase tracking-widest">Market Gap</h3>
                                                        <div className="p-3 bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/30 dark:border-blue-500/30 rounded-xl h-full">
                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                <Target size={12} className="text-blue-500" />
                                                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Fills Void</span>
                                                            </div>
                                                            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                                                                {script.content_gap_addressed}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content with Animation */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                            >
                                                <div className="border-t border-white/10 bg-black/20 p-6 md:p-8">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                                        {/* Full Script Text */}
                                                        <div className="lg:col-span-2 space-y-4">
                                                            {/* ... (Keep existing script editor ...) */}
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="text-sm font-bold text-theme-primary uppercase tracking-wider flex items-center gap-2">
                                                                    <MessageCircle size={16} className="text-theme-muted" />
                                                                    Video Script
                                                                </h3>
                                                            </div>

                                                            <div className="rounded-xl overflow-hidden border border-slate-700 dark:border-slate-600 shadow-lg group relative">
                                                                {/* Mock Window Controls */}
                                                                <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                                                                    <div className="flex gap-1.5">
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                                                                    </div>
                                                                    <div className="text-[10px] font-mono text-slate-500 font-medium tracking-widest uppercase">
                                                                        final_script_v1.txt
                                                                    </div>
                                                                    <div />
                                                                </div>

                                                                {/* Editor Body */}
                                                                <div className="bg-[#1e1e2e] p-6 relative">
                                                                    {/* Line Numbers Decoration */}
                                                                    <div className="absolute left-4 top-6 bottom-6 w-6 flex flex-col gap-1 text-[10px] text-slate-600 font-mono select-none text-right pr-2 border-r border-slate-700/50 leading-relaxed font-bold">
                                                                        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
                                                                    </div>

                                                                    <div className="pl-8">
                                                                        <p className="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap selection:bg-purple-500/30 selection:text-white">
                                                                            {script.full_text}
                                                                        </p>
                                                                    </div>

                                                                    {/* Floating Copy Button (Inside Editor) */}
                                                                    <div className="absolute top-4 right-4">
                                                                        <button
                                                                            onClick={() => copyToClipboard(script.full_text, `script-${scriptId}`)}
                                                                            className="p-2 bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white rounded-lg transition-colors backdrop-blur-sm"
                                                                            title="Copy Script"
                                                                        >
                                                                            {copiedSection === `script-${scriptId}` ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Caption Preview */}
                                                            <div className="bg-blue-500/10 dark:bg-blue-500/10 p-5 rounded-xl border border-blue-500/30 dark:border-blue-500/30 mt-6">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <h3 className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-2">
                                                                        <Hash size={14} /> Recommended Caption
                                                                    </h3>
                                                                    <button
                                                                        onClick={() => copyToClipboard(script.caption_full, `caption-${scriptId}`)}
                                                                        className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                                                    >
                                                                        {copiedSection === `caption-${scriptId}` ? 'Copied' : 'Copy'}
                                                                    </button>
                                                                </div>
                                                                <p className="text-sm text-theme-secondary mb-3 leading-relaxed">
                                                                    {script.caption_full}
                                                                </p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {script.hashtags_all?.split(/[\s,]+/).filter(Boolean).map((tag: string, i: number) => (
                                                                        <span key={i} className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-500/20 dark:bg-blue-500/20 px-2 py-1 rounded-md">
                                                                            #{tag.replace(/^#/, '')}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Sidebar Details (Breakdown) */}
                                                        <div className="space-y-6">
                                                            <div className="bg-white/5 dark:bg-white/5 p-5 rounded-xl border border-white/10 dark:border-white/10 shadow-sm">
                                                                <h3 className="text-xs font-bold text-theme-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                    <Target size={14} /> Structural Breakdown
                                                                </h3>
                                                                <div className="space-y-4 relative">
                                                                    {/* Timeline line */}
                                                                    <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-white/10 dark:bg-white/10" />

                                                                    {[
                                                                        { label: "Hook", text: script.script_hook },
                                                                        { label: "Buildup", text: script.script_buildup },
                                                                        { label: "Value", text: script.script_value },
                                                                        { label: "CTA", text: script.script_cta }
                                                                    ].map((item, i) => (
                                                                        <div key={i} className="relative pl-6">
                                                                            <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white/20 dark:border-white/20 bg-purple-500 shadow-sm z-10" />
                                                                            <span className="text-[10px] font-bold text-theme-secondary uppercase block mb-0.5">{item.label}</span>
                                                                            <p className="text-xs text-theme-secondary font-medium leading-relaxed">{item.text}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Visual Storyboard Section (NEW) */}
                                                            {script.visual_storyboard && (
                                                                <div className="bg-amber-500/10 dark:bg-amber-500/10 p-5 rounded-xl border border-amber-500/30 dark:border-amber-500/30">
                                                                    <h3 className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                                        <Sparkles size={14} /> Visual Storyboard
                                                                    </h3>
                                                                    <div className="space-y-3">
                                                                        <div>
                                                                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase block mb-1">Opening Frame</span>
                                                                            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                                                                                {script.visual_storyboard.opening_frame}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase block mb-1">Visual Style</span>
                                                                            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                                                                                {script.visual_storyboard.main_visual_style}
                                                                            </p>
                                                                        </div>
                                                                        {script.visual_storyboard.b_roll_suggestions?.length > 0 && (
                                                                            <div>
                                                                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase block mb-1">B-Roll Ideas</span>
                                                                                <ul className="list-disc pl-3 space-y-1">
                                                                                    {script.visual_storyboard.b_roll_suggestions.map((broll: string, i: number) => (
                                                                                        <li key={i} className="text-[10px] text-amber-800 dark:text-amber-200 leading-tight">{broll}</li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="bg-purple-500/10 dark:bg-purple-500/10 p-5 rounded-xl border border-purple-500/30 dark:border-purple-500/30">
                                                                <div className="flex items-start gap-3">
                                                                    <Lightbulb size={18} className="text-purple-500 mt-0.5" />
                                                                    <div>
                                                                        <h4 className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-1">Director's Note</h4>
                                                                        <p className="text-xs text-purple-700 dark:text-purple-200 leading-relaxed">
                                                                            {script.why_this_works}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}

                        {scripts.length === 0 && (
                            <div className="text-center py-20 glass-panel border-dashed border-slate-200">
                                <FileText size={48} className="mx-auto text-theme-muted mb-4" />
                                <h3 className="text-lg font-bold text-theme-primary">No scripts generated yet</h3>
                                <p className="text-theme-secondary">Run a new analysis to generate script ideas.</p>
                            </div>

                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
