"use client";

import React from 'react';
import { Bookmark, Lightbulb } from 'lucide-react';

interface HookItem {
    rank: number;
    hook: string;
    reelcaption: string;
    sourceusername: string;
}

interface TopHooksProps {
    hooks: HookItem[];
}

export default function TopHooksView({ hooks }: TopHooksProps) {
    if (!hooks || hooks.length === 0) return null;

    return (
        <div className="neu-convex p-6 flex flex-col h-full animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center shrink-0">
                    <Lightbulb size={20} className="text-amber-500" />
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate">Top Performing Hooks</h3>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <div className="col-span-1 text-center">Rank</div>
                    <div className="col-span-8">Hook Strategy</div>
                    <div className="col-span-3">Source</div>
                </div>

                {hooks.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-4 items-center p-4 neu-convex-sm rounded-xl transition-all group hover:bg-white/5">
                        <div className="col-span-1 flex justify-center">
                            {idx < 3 ? (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${idx === 0 ? 'bg-yellow-500 shadow-yellow-500/40' :
                                    idx === 1 ? 'bg-slate-400 shadow-slate-400/40' :
                                        'bg-amber-600 shadow-amber-600/40'
                                    }`}>
                                    {item.rank}
                                </div>
                            ) : (
                                <span className="text-slate-400 font-bold">#{item.rank}</span>
                            )}
                        </div>
                        <div className="col-span-8">
                            <p className="text-sm font-semibold text-slate-100 leading-relaxed group-hover:text-indigo-400 transition-colors">
                                "{item.hook}"
                            </p>
                            <p className="text-xs text-slate-400 mt-1 truncate">
                                {item.reelcaption}
                            </p>
                        </div>
                        <div className="col-span-3 flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400 glass-inset px-2 py-1 rounded-md border border-white/5">
                                @{item.sourceusername}
                            </span>
                            {/* Placeholder for link if we had it, keeping visuals clean */}
                            {/* <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                <ExternalLink size={16} />
                            </button> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
