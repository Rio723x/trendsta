"use client";

import React from "react";
import { Search, Flame, Bookmark, Clock, MessageSquare, ExternalLink, TrendingUp, Award } from "lucide-react";
import { CompetitorResearch, ResearchSummary } from "../../types/trendsta";
import { SPY_GLASS_DATA } from "../data/advancedDashboardData"; // Keep for fallback visuals

interface SpyGlassViewProps {
    research: ResearchSummary;
    competitors: CompetitorResearch;
}

export default function SpyGlassView({ research, competitors }: SpyGlassViewProps) {
    if (!research || !competitors) return null;

    // Use specific data if available, else fallback to mock for visuals where data is just a summary string
    // The user wants "original state" which implies the visual heatmap. 
    // Since real data `posting_times` is just a string, we'll use the mock heatmap for the visual "vibe" 
    // but display the real text summary below it.
    const { heatmap } = SPY_GLASS_DATA;

    // For Viral Trigger, use real data text
    const viralTriggerText = research.viral_triggers || "Analysis pending...";

    // For Top Hooks, use real data but formatted as Leaderboard
    const topHooks = (competitors.top_hooks || []).slice(0, 7);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-fadeInUp">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Search size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">The Spy Glass</h2>
                        <p className="text-sm text-slate-500">What is working for everyone else?</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Availability & Heatmap Text */}
                <div className="space-y-6">
                    {/* Heatmap Mini - Visual (Restored) */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Clock size={16} className="text-slate-400" />
                            <h3 className="text-xs font-bold text-slate-700 uppercase">Best Posting Times</h3>
                        </div>

                        {/* Visual Heatmap Grid (Simulated/Mock for "Original State" visual) */}
                        <div className="space-y-3 bg-slate-50 border border-slate-100 rounded-xl p-4 mb-3">
                            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
                                const dayData = heatmap.filter(h => h.day === day);
                                if (dayData.length === 0) return null;

                                return (
                                    <div key={day} className="flex items-center gap-3">
                                        <div className="w-8 text-[10px] font-bold text-slate-400 uppercase text-right">{day}</div>
                                        <div className="flex-1 flex gap-1">
                                            {dayData.map((cell, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-6 flex-1 rounded-md transition-all flex items-center justify-center text-[9px] font-medium text-white ${cell.value > 80 ? 'bg-indigo-600' :
                                                        cell.value > 50 ? 'bg-indigo-400' :
                                                            'bg-indigo-200'
                                                        }`}
                                                    title={`${cell.day} ${cell.hour}:00`}
                                                >
                                                    {cell.hour}:00
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Real Data Summary */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">AI Analysis</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {research.posting_times || "No data available."}
                            </p>
                        </div>
                    </div>

                    {/* Viral Trigger Tip */}
                    <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-blue-900 relative overflow-hidden border border-blue-200">
                        <div className="flex items-center gap-2 mb-2 relative z-10">
                            <Flame size={16} className="text-orange-500" />
                            <span className="text-xs font-bold text-blue-600 uppercase">Viral Trigger</span>
                        </div>
                        <h4 className="font-bold text-lg mb-1 relative z-10 text-blue-800">Core insight</h4>
                        <p className="text-blue-700 text-sm leading-relaxed relative z-10">
                            {viralTriggerText}
                        </p>
                        {/* Decor */}
                        <div className="absolute -right-4 -bottom-4 bg-blue-200/50 w-24 h-24 rounded-full blur-xl" />
                    </div>

                    {/* Content Gap Card */}
                    <div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl text-amber-900 relative overflow-hidden mt-4 border border-amber-200">
                        <div className="flex items-center gap-2 mb-2 relative z-10">
                            <TrendingUp size={16} className="text-amber-600" />
                            <span className="text-xs font-bold text-amber-600 uppercase">Opportunity</span>
                        </div>
                        <h4 className="font-bold text-lg mb-1 relative z-10 text-amber-800">Content Gap</h4>
                        <p className="text-amber-700 text-sm leading-relaxed relative z-10">
                            {research.content_gap || "Analysis pending..."}
                        </p>
                        {/* Decor */}
                        <div className="absolute -right-4 -bottom-4 bg-amber-200/50 w-24 h-24 rounded-full blur-xl" />
                    </div>
                </div>

                {/* Middle Col: Thief's Gallery (Leaderboard) */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Bookmark size={16} className="text-slate-400" />
                            <h3 className="text-xs font-bold text-slate-700 uppercase">Thief's Gallery</h3>
                        </div>
                        <span className="text-[10px] bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-bold uppercase tracking-wide border border-amber-100">
                            Top Performing Hooks
                        </span>
                    </div>

                    {/* Leaderboard Layout */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <div className="col-span-1">Rank</div>
                            <div className="col-span-9">Hook Strategy</div>
                            <div className="col-span-2 text-right">Action</div>
                        </div>

                        {topHooks.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-4 items-center p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-indigo-100 transition-all group">
                                <div className="col-span-1 flex justify-center">
                                    {idx < 3 ? (
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${idx === 0 ? 'bg-yellow-400 shadow-yellow-200' :
                                            idx === 1 ? 'bg-slate-300' :
                                                'bg-amber-600'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 font-bold ml-2">#{idx + 1}</span>
                                    )}
                                </div>
                                <div className="col-span-9">
                                    <p className="text-sm font-semibold text-slate-800 leading-relaxed group-hover:text-indigo-600 transition-colors">
                                        "{item.hook}"
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-slate-400">Source: Viral Reel</span>
                                        {/* <span className="text-xs text-slate-300">•</span>
                                        <span className="text-xs text-slate-400">{item.reelId.substring(0,8)}...</span> */}
                                    </div>
                                </div>
                                <div className="col-span-2 text-right">
                                    <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {topHooks.length === 0 && (
                            <div className="text-center py-8 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
                                <p className="text-slate-400 text-sm">No viral hooks identified yet.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
