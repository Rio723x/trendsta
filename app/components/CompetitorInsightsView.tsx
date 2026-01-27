"use client";

import React from 'react';
import { Target, Zap, ArrowRight, Brain, Lightbulb, Shield, Swords } from 'lucide-react';
import { CompetitorReverseEngineering } from '../types/trendsta';

interface CompetitorInsightsViewProps {
    insights: CompetitorReverseEngineering[];
    additionalInsights?: string[];
}

export default function CompetitorInsightsView({ insights, additionalInsights }: CompetitorInsightsViewProps) {
    if (!insights || insights.length === 0) {
        return (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                <Brain className="mx-auto text-slate-300 mb-3" size={48} />
                <h3 className="text-lg font-medium text-slate-900">No competitor analysis yet</h3>
                <p className="text-slate-500">Add competitors and tracking data to generate reverse-engineering insights.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Swords className="text-indigo-600" size={24} />
                    Competitor Reverse-Engineering
                </h2>
                <p className="text-slate-500 mt-1">
                    Deconstructed tactics from your niche's top performers.
                </p>
            </div>

            {/* Strategic Breakdown Cards */}
            <div className="grid grid-cols-1 gap-6">
                {insights.map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* Card Header with Competitor Name */}
                        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                {item.competitor_name.replace('@', '').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{item.competitor_name}</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Strategy Analysis</p>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                            {/* Vertical Divider line for desktop */}
                            <div className="hidden md:block absolute top-6 bottom-6 left-1/3 w-px bg-slate-100"></div>
                            <div className="hidden md:block absolute top-6 bottom-6 left-2/3 w-px bg-slate-100"></div>

                            {/* Column 1: Tactic Observed */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                                    <Target size={18} className="text-blue-500" />
                                    <h4>Tactic Observed</h4>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                                    "{item.tactic_observed}"
                                </p>
                            </div>

                            {/* Column 2: Why It Worked */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                                    <Brain size={18} className="text-purple-500" />
                                    <h4>Psychology / Hook</h4>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {item.why_it_worked}
                                </p>
                            </div>

                            {/* Column 3: Differentiation Plan (Actionable) */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                                    <Zap size={18} className="text-amber-500" />
                                    <h4>Your Differentiation</h4>
                                </div>
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100 h-full">
                                    <p className="text-sm text-amber-900 font-medium leading-relaxed">
                                        {item.differentiation_plan}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* General AI Insights Summary if available */}
            {additionalInsights && additionalInsights.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Lightbulb size={20} className="text-yellow-500" />
                        AI Market Observations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {additionalInsights.map((insight, idx) => (
                            <div key={idx} className="flex gap-3 bg-white p-4 rounded-xl border border-slate-100">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                <p className="text-sm text-slate-600">{insight}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
