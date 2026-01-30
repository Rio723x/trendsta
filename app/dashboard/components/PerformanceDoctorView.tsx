"use client";

import React from "react";
import { Activity, Gauge, TrendingUp, AlertCircle, Award } from "lucide-react";
import { UserPerformanceResearch } from "../../types/trendsta";

interface PerformanceDoctorViewProps {
    performance: UserPerformanceResearch;
}

export default function PerformanceDoctorView({ performance }: PerformanceDoctorViewProps) {
    if (!performance || !performance.reels) return null;

    // Derive WPM Data for graph
    // We want a list of { wpm: number, views: number }
    const wpmData = performance.reels
        .filter(r => r.wordsPerMinute !== undefined && r.wordsPerMinute > 0)
        .map(r => ({ wpm: Math.round(r.wordsPerMinute!), views: r.views }))
        .slice(0, 10); // Limit to 10 points for graph

    const maxViews = wpmData.length > 0 ? Math.max(...wpmData.map(d => d.views!)) : 1000;

    const transcriptCoverage = performance.aggregates.transcriptCoverage || 0;

    // Punching above weight
    const punchingReels = performance.reels.filter(r => r.is_punching_above_weight);
    const topPunch = punchingReels.length > 0 ? punchingReels[0] : null;

    const viewGoal = Math.round((performance.aggregates.avgViews || 1000) * 1.5);

    return (
        <div className="neu-convex p-6 animate-fadeInUp">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Performance Doctor</h2>
                        <p className="text-sm text-slate-500">How can you improve?</p>
                    </div>
                </div>

                {/* View Goal Badge */}
                <div className="flex items-center gap-3 pl-4 pr-1 py-1 bg-slate-50 rounded-full border border-slate-100">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Next Goal</span>
                        <span className="text-sm font-black text-slate-900">{viewGoal} Views</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                        <TrendingUp size={14} className="text-white" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* WPM Graph */}
                <div className="lg:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700">Speaking Pace vs. Views</h3>
                        <span className="text-xs font-medium text-slate-400">Sweet Spot: 145-150 WPM</span>
                    </div>

                    <div className="h-48 bg-slate-50 rounded-xl border border-slate-100 relative p-4 flex items-end justify-between gap-2 overflow-hidden">
                        {/* Simple Bars for Graph */}
                        {wpmData.map((data, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group cursor-pointer">
                                <div
                                    className="w-full max-w-[30px] bg-rose-200 rounded-t-sm group-hover:bg-rose-500 transition-colors relative"
                                    style={{ height: `${(data.views! / maxViews) * 80}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {data.views} Views
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600">{data.wpm}</span>
                            </div>
                        ))}
                        <div className="absolute bottom-2 left-0 right-0 h-px bg-slate-200 -z-10" />
                    </div>
                    <p className="text-xs text-slate-400 text-center">Words Per Minute (WPM)</p>
                </div>

                {/* Side Stats */}
                <div className="space-y-4">
                    {/* Punching Above Weight */}
                    {topPunch && (
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Award size={64} className="text-amber-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Award size={16} className="text-amber-600" />
                                    <span className="text-xs font-bold text-amber-700 uppercase">Punching Above Weight</span>
                                </div>
                                <h4 className="font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{topPunch.captionHook || topPunch.caption}</h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-amber-600">{topPunch.views_over_expected!.toFixed(1)}x</span>
                                    <span className="text-xs text-amber-800/70 font-medium">ROI multiplier</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {!topPunch && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                            <p className="text-slate-400 text-sm">No outlier content detected yet.</p>
                        </div>
                    )}

                    {/* Transcript Coverage */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <AlertCircle size={14} className={transcriptCoverage < 90 ? "text-red-500" : "text-emerald-500"} />
                                <span className="text-xs font-bold text-slate-500 uppercase">Audio Clarity</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{transcriptCoverage}%</p>
                        </div>
                        <div className="text-right max-w-[100px]">
                            <p className="text-[10px] text-slate-400 leading-tight">
                                High clarity helps algorithms index your content.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
