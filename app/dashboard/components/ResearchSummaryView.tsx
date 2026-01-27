"use client";

import React from "react";
import { Zap, Clock, Calendar, CheckCircle2, Lightbulb, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";

interface ResearchSummaryProps {
    summary: {
        instagram_insights?: string;
        twitter_insights?: string;
        competitor_insights?: string;
        content_gap?: string;
        viral_triggers?: string;
        postingSchedule?: string;
        posting_times?: string;
        hook_formula?: string;
        [key: string]: any;
    };
}

// --- Parsing Helpers ---
const parseKeyValues = (text?: string) => {
    if (!text) return [];
    return text.split("\n").map(line => {
        const [key, value] = line.split(":").map(s => s.trim());
        if (!value) return null;
        return { key, value };
    }).filter(Boolean) as { key: string, value: string }[];
};

export default function ResearchSummaryView({ summary }: ResearchSummaryProps) {
    // Parse data for the "Execution Plan" view
    const rawDetails = parseKeyValues(summary.postingSchedule || summary.posting_times);
    const hookDetails = parseKeyValues(summary.hook_formula);

    // Check if we have "Insight" data structure
    const isInsightMode = rawDetails.some(d => d.key === "Insight");

    // Group insights if in Insight Mode
    const insightsGrouped = [];
    if (isInsightMode) {
        let currentGroup: any = {};
        rawDetails.forEach((item) => {
            if (item.key === "Insight") {
                if (currentGroup.Insight) insightsGrouped.push(currentGroup);
                currentGroup = { Insight: item.value };
            } else if (item.key === "Action" || item.key === "Evidence") {
                currentGroup[item.key] = item.value;
            } else {
                // Fallback for other keys
                currentGroup[item.key] = item.value;
            }
        });
        if (currentGroup.Insight) insightsGrouped.push(currentGroup);
    }

    const validPostingDetails = rawDetails.length > 0 ? rawDetails : [
        { key: "Times", value: "6:00 PM - 9:00 PM" },
        { key: "Days", value: "Tuesday, Thursday" },
        { key: "Frequency", value: "Daily" },
        { key: "Evidence", value: "High engagement during evening commute hours." }
    ];

    const validHookDetails = hookDetails.length > 0 ? hookDetails : [
        { key: "Pattern", value: "Statement of Disbelief + Visual Proof" },
        { key: "Examples", value: "\"Power without wires?! This is not CGI.\"" },
        { key: "Why", value: "Immediate pattern interrupt that forces the brain to verify the claim" }
    ];

    return (
        <div className="w-full animate-fadeInUp">
            {/* Execution Card */}
            <div className="execution-card p-8 md:p-10 relative overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">

                {/* Header */}
                <div className="flex items-start gap-4 mb-12 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
                        <Zap size={28} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Execution Plan</h2>
                        <p className="text-blue-200/80 font-medium text-sm tracking-wide">Immediate tactical actions</p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10">

                    {/* Left Column: Posting Window OR Insights */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">
                            {isInsightMode ? "Strategic Insights" : "Posting Window"}
                        </h3>

                        <div className="space-y-8">
                            {isInsightMode ? (
                                insightsGrouped.map((group, idx) => (
                                    <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/60 transition-colors">

                                        {/* Insight */}
                                        <div className="mb-4">
                                            <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider block mb-1">Insight</span>
                                            <p className="text-white font-medium leading-relaxed">{group.Insight}</p>
                                        </div>

                                        {/* Recommended Action (Pink/Rose Block) */}
                                        <div className="mb-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle2 size={14} className="text-rose-400" />
                                                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Recommended Action</span>
                                            </div>
                                            <p className="text-rose-100 text-sm font-medium leading-relaxed">
                                                {group.Action}
                                            </p>
                                        </div>

                                        {/* Evidence (Separate Block as requested) */}
                                        {group.Evidence && (
                                            <div className="pl-4 border-l-2 border-blue-500/30">
                                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">Evidence</span>
                                                <p className="text-slate-400 text-xs italic leading-relaxed">
                                                    "{group.Evidence}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                validPostingDetails.map((item, idx) => (
                                    <div key={idx} className="group">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className={`text-sm font-semibold ${item.key === 'Evidence' ? 'text-blue-400' : 'text-slate-400'} min-w-[100px]`}>
                                                {item.key}
                                            </span>
                                            <span className={`text-md font-medium text-right ${item.key === 'Evidence' ? 'text-slate-300 text-sm leading-relaxed max-w-[280px]' : 'text-white'}`}>
                                                {item.value}
                                            </span>
                                        </div>
                                        {item.key !== 'Evidence' && <div className="h-px w-full bg-white/5 group-hover:bg-white/10 transition-colors mt-2" />}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column: Hook Frameworks */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">
                            Hook Frameworks
                        </h3>
                        <div className="space-y-4">
                            {validHookDetails.map((item, idx) => (
                                <div key={idx} className="inner-card p-5 group hover:-translate-y-1 transition-transform duration-300 bg-slate-800/50 border-slate-700/50">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Lightbulb size={14} className="text-yellow-400" />
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.key}</span>
                                    </div>
                                    <p className="text-white text-lg font-medium leading-normal">
                                        {item.value.replace(/^"|"$/g, '')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none" />
            </div>
        </div>
    );
}
