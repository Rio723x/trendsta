"use client";

import React from 'react';
import { Clock, Zap, Target, AlertTriangle, Car, TrendingUp } from 'lucide-react';

interface KeyMetricsRowProps {
    data: {
        best_time: string;
        best_days: string;
        target_pace: string;
        pace_detail: string;
        viral_trigger: string;
        trigger_detail: string;
        content_gap: string;
        gap_detail: string;
    }
}

export default function KeyMetricsRow({ data }: KeyMetricsRowProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fadeInUp">
            {/* 1. BEST TIME TO POST (Green Theme) */}
            <div className="relative overflow-hidden neu-convex p-5 md:p-6 group transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-widest mb-2 truncate">Best Time to Post</h3>
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                        <span className="text-2xl md:text-3xl font-black text-white">{data.best_time}</span>
                        <span className="text-xs text-slate-400 font-medium">(2 PM)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                        <Clock size={12} className="text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold truncate">{data.best_days}</span>
                    </div>
                </div>

                {/* Left Side Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/80 rounded-l-2xl shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>

            {/* 2. TARGET PACE (Purple Theme) */}
            <div className="relative overflow-hidden neu-convex p-5 md:p-6 group transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-purple-300/80 uppercase tracking-widest mb-2 truncate">Target Pace</h3>
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                        <span className="text-2xl md:text-3xl font-black text-white">{data.target_pace}</span>
                        <span className="text-xs text-slate-400 font-medium">WPM</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-400">
                        <Zap size={12} className="text-purple-400 shrink-0" />
                        <span className="text-xs font-bold truncate">{data.pace_detail}</span>
                    </div>
                </div>

                {/* Left Side Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500/80 rounded-l-2xl shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
            </div>

            {/* 3. TOP VIRAL TRIGGER (Red/Rose Theme) */}
            <div className="relative overflow-hidden neu-convex p-5 md:p-6 group transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-rose-300/80 uppercase tracking-widest mb-2 truncate">Top Viral Trigger</h3>
                    <div className="mb-2">
                        <span className="text-lg md:text-xl font-black text-white leading-tight block break-words">{data.viral_trigger}</span>
                    </div>
                    <div className="flex items-center gap-2 text-rose-400">
                        <AlertTriangle size={12} className="text-rose-400 shrink-0" />
                        <span className="text-xs font-bold line-clamp-1 break-all">{data.trigger_detail}</span>
                    </div>
                </div>

                {/* Left Side Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/80 rounded-l-2xl shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
            </div>

            {/* 4. CONTENT GAP (Blue/Cyan Theme) */}
            <div className="relative overflow-hidden neu-convex p-5 md:p-6 group transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-blue-300/80 uppercase tracking-widest mb-2 truncate">Content Gap</h3>
                    <div className="mb-2">
                        <span className="text-lg md:text-xl font-black text-white leading-tight block break-words">{data.content_gap}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400">
                        <Car size={12} className="text-blue-400 shrink-0" />
                        <span className="text-xs font-bold line-clamp-1 break-all">{data.gap_detail}</span>
                    </div>
                </div>

                {/* Left Side Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/80 rounded-l-2xl shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            </div>
        </div>
    );
}
