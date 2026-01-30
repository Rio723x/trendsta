"use client";

import React from "react";
import { Info, Clock, AlignLeft, Sparkles, ArrowRight } from "lucide-react";
import { ScriptIdea } from "../../types/trendsta";

interface ScriptLabViewProps {
    scripts: ScriptIdea[];
}

export default function ScriptLabView({ scripts }: ScriptLabViewProps) {
    // Only showing the top script for the "Lab" focus
    // If no scripts, use a fallback or empty state (not handled deeply here for brevity)
    const activeScript = scripts && scripts.length > 0 ? scripts[0] : null;

    if (!activeScript) return null;

    return (
        <div className="neu-convex p-6 animate-fadeInUp">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">The Script Lab</h2>
                        <p className="text-sm text-slate-500">What should you post right now?</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={12} />
                    AI Recommended
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Viral Gauge Section */}
                <div className="col-span-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="relative w-32 h-32 mb-4">
                        {/* Simple SVG Circular Gauge */}
                        <svg viewBox="0 0 100 100" className="w-full h-full rotate-90">
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke="#e2e8f0"
                                strokeWidth="8"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke="#9333ea" // Purple 600
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - activeScript.viral_potential_score / 100)}`}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-90">
                            <span className="text-3xl font-black text-slate-900">{activeScript.viral_potential_score}</span>
                            <span className="text-10px uppercase font-bold text-slate-400">Viral Score</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="flex items-center justify-center gap-1.5 mb-2 text-slate-600 text-sm font-medium">
                            <span>Why This Works</span>
                            <div className="group relative">
                                <Info size={14} className="text-slate-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    {activeScript.why_this_works}
                                    <div className="mt-2 text-purple-300 font-semibold">
                                        Trigger: {activeScript.emotional_trigger}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <Clock size={14} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-700">
                                {activeScript.estimated_duration} • {activeScript.script_word_count} words
                            </span>
                        </div>
                    </div>
                </div>

                {/* Script Details Section */}
                <div className="col-span-1 lg:col-span-2 space-y-6">
                    {/* The Hook */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">The Hook</h3>
                        <div className="p-5 bg-slate-900 rounded-xl shadow-lg border border-slate-800">
                            <p className="text-xl md:text-2xl font-bold text-white leading-tight">
                                "{activeScript.script_hook}"
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Value Prop */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">The Payoff</h3>
                            <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                                <p className="text-sm text-green-800 font-medium leading-relaxed">
                                    {activeScript.script_value}
                                </p>
                            </div>
                        </div>

                        {/* Content Gap */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Market Gap</h3>
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlignLeft size={16} className="text-blue-500" />
                                    <span className="text-xs font-bold text-blue-600 uppercase">Fills Void</span>
                                </div>
                                <p className="text-sm text-blue-800 font-medium">
                                    {activeScript.content_gap_addressed}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                        View Full Script <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
