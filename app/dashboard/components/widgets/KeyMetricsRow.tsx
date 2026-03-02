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
                        <span className="text-2xl md:text-3xl font-black text-theme-primary">{data.best_time}</span>
                        <span className="text-xs text-theme-secondary font-medium">(2 PM)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                        <Clock size={12} className="text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold truncate">{data.best_days}</span>
                    </div>
                </div>

                {/* Left Side Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/80 rounded-l-2xl shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>

            {/* 2. TARGET PACE (Orange Theme) */}
            <div className="relative overflow-hidden neu-convex p-5 md:p-6 group flex flex-col justify-between h-full transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="relative z-10 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 neu-pressed group-hover:scale-110 transition-transform">
                            <Zap size={14} className="text-orange-500" />
                        </div>
                        <h3 className="text-[10px] font-bold text-orange-600/80 uppercase tracking-widest truncate">Target Pace</h3>
                    </div>

                    <div className="flex items-baseline gap-2 mb-1 pl-1">
                        <span className="text-2xl md:text-3xl font-black text-theme-primary tracking-tighter drop-shadow-sm">{data.target_pace}</span>
                        <span className="text-xs font-bold text-theme-secondary">WPM</span>
                    </div>
                </div>

                <div className="relative z-10 mt-auto pt-3 border-t border-slate-700/50">
                    <div className="flex items-center gap-2 text-orange-500">
                        <span className="text-[10px] font-bold uppercase tracking-wider">High Energy</span>
                    </div>
                </div>

                {/* Left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500/50 rounded-l-2xl shadow-[0_0_10px_rgba(249,115,22,0.3)]"></div>
            </div>

            {/* 3. TOP VIRAL TRIGGER (Red/Rose Theme) */}
            <div className="relative overflow-hidden neu-convex p-5 md:p-6 group transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-rose-300/80 uppercase tracking-widest mb-2 truncate">Top Viral Trigger</h3>
                    <div className="mb-2">
                        <span className="text-lg md:text-xl font-black text-theme-primary leading-tight block break-words">{data.viral_trigger}</span>
                    </div>
                    <div className="flex items-center gap-2 text-rose-400">
                        <AlertTriangle size={12} className="text-rose-400 shrink-0" />
                        <span className="text-xs font-bold line-clamp-1 break-all">{data.trigger_detail}</span>
                    </div>
                </div>

                {/* Left Side Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/80 rounded-l-2xl shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
            </div>

            {/* 4. DRIVING TOPIC (Gray/Black Theme) */}
            <div className="relative overflow-hidden neu-convex p-5 md:p-6 group flex flex-col justify-between h-full transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(75,85,99,0.2)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="relative z-10 flex-1 flex flex-col justify-center">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 truncate">Driving Topic</h3>

                    <div className="text-lg md:text-xl font-black text-theme-primary leading-tight mb-2 drop-shadow-sm truncate-2-lines">
                        {data.content_gap}
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 mt-auto">
                        <TrendingUp size={12} className="text-gray-500 shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider truncate">High viral potential</span>
                    </div>
                </div>

                {/* Left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-600/80 rounded-l-2xl shadow-[0_0_10px_rgba(75,85,99,0.3)]"></div>
            </div>
        </div>
    );
}
