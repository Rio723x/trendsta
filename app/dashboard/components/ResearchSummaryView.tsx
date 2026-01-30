"use client";

import React from "react";
import { Zap, CheckCircle2, Lightbulb, AlertTriangle, ArrowRight, Sparkles, Target, FlaskConical, Music, Timer } from "lucide-react";

import { ResearchSummary } from "../../types/trendsta";

interface ResearchSummaryProps {
    summary: ResearchSummary;
}

export default function ResearchSummaryView({ summary }: ResearchSummaryProps) {
    const { execution_plan } = summary;

    if (!execution_plan) return null;

    return (
        <div className="w-full animate-fadeInUp">
            {/* Execution Card */}
            <div className="execution-card p-8 md:p-10 relative overflow-hidden neu-convex">

                {/* Header */}
                <div className="flex items-start gap-4 mb-10 relative z-10">
                    <div className="w-14 h-14 rounded-2xl neu-pressed flex items-center justify-center shrink-0">
                        <Zap size={28} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mb-1">Execution Plan</h2>
                        <p className="text-slate-500 font-medium text-sm tracking-wide">Immediate tactical actions & Strategy</p>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="relative z-10">

                    {/* Tactical Execution (Full Width) */}
                    <div className="space-y-8">

                        {/* 1. Immediate Action Checklist */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-200 pb-2">Immediate Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {execution_plan.immediate_action_checklist.map((action, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 neu-convex-sm rounded-xl transition-colors group">
                                        <div className="min-w-[20px] pt-0.5">
                                            <div className="w-5 h-5 rounded border-2 border-slate-300 group-hover:border-blue-500 transition-colors flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-sm font-medium leading-relaxed">{action}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Grid for Specs & Experiment */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* 2. Production Spec Sheet */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-200 pb-2">Production Specs</h3>
                                <div className="space-y-4">
                                    <div className="p-4 neu-convex-sm rounded-xl flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                            <Timer size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase text-emerald-600 font-bold">Duration & Pace</p>
                                            <p className="text-slate-700 text-xs font-semibold">{execution_plan.production_spec_sheet.target_duration}</p>
                                            <p className="text-slate-500 text-[10px]">{execution_plan.production_spec_sheet.target_wpm}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 neu-convex-sm rounded-xl flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
                                            <Music size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase text-purple-600 font-bold">Audio Mood</p>
                                            <p className="text-slate-700 text-xs font-semibold line-clamp-2">{execution_plan.production_spec_sheet.audio_mood}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Experiment This */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-200 pb-2">Active Experiment</h3>
                                <div className="neu-convex-sm rounded-2xl p-5 relative overflow-hidden h-full">
                                    <div className="absolute top-0 right-0 p-3 opacity-10">
                                        <FlaskConical size={64} className="text-blue-500" />
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-0.5 bg-blue-500/50 self-stretch rounded-full" />
                                            <div>
                                                <p className="text-[10px] uppercase text-blue-600 font-bold mb-1">Hypothesis</p>
                                                <p className="text-slate-600 text-sm leading-relaxed italic">"{execution_plan.experiment_this.hypothesis}"</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-0.5 bg-emerald-500/50 self-stretch rounded-full" />
                                            <div>
                                                <p className="text-[10px] uppercase text-emerald-600 font-bold mb-1">Test Protocol</p>
                                                <p className="text-slate-600 text-sm leading-relaxed">{execution_plan.experiment_this.how_to_test}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
