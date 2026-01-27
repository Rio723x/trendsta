"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Play, TrendingUp, Sparkles, LayoutGrid, ListFilter } from "lucide-react";

import MobileHeader from "../components/MobileHeader";
import ReelCard from "../components/ReelCard";
import ReelModal from "../components/ReelModal";
import AIInsightsView from "../components/AIInsightsView";
import { ReelData, TrendstaData } from "../types/trendsta";

// Filter Button
function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${active
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
                }`}
        >
            {children}
        </button>
    );
}

interface TopReelsClientProps {
    data: TrendstaData;
}

export default function TopReelsClient({ data }: TopReelsClientProps) {
    const [viewMode, setViewMode] = useState<'reels' | 'insights'>('insights');
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedReel, setSelectedReel] = useState<ReelData | null>(null);

    const reels = data.niche_research?.reels || [];
    const researchSummary = data.llm_research_summary || [];
    const userPerformance = data.user_performance_research;

    const filters = [
        { id: "all", label: "All Reels" },
        { id: "viral", label: "Viral > 50k" },
        { id: "short", label: "Short (< 30s)" },
        { id: "long", label: "Long (> 60s)" },
    ];

    const filteredReels = (activeFilter === "all"
        ? reels
        : reels.filter(reel => {
            if (activeFilter === "viral") return reel.views > 50000;
            if (activeFilter === "short") return reel.duration < 30;
            if (activeFilter === "long") return reel.duration > 60;
            return true;
        })).slice(0, 7);

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <MobileHeader />

            <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header & Toggle */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fadeInUp">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                {viewMode === 'reels' ? 'Top Performing Reels' : 'AI Strategic Insights'}
                            </h1>
                            <p className="text-slate-500 mt-2">
                                {viewMode === 'reels'
                                    ? `Analyzing ${reels.length} viral reels in your niche.`
                                    : 'Deep dive analysis and actionable strategy.'}
                            </p>
                        </div>

                        {/* View Toggle */}
                        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm inline-flex">
                            <button
                                onClick={() => setViewMode('reels')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'reels'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                <LayoutGrid size={18} />
                                Top Reels
                            </button>
                            <button
                                onClick={() => setViewMode('insights')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'insights'
                                    ? 'bg-purple-50 text-purple-600'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                <Sparkles size={18} />
                                AI Insights
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    {viewMode === 'reels' ? (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Filter Tags */}
                            <div className="flex flex-wrap gap-2">
                                {filters.map((filter) => (
                                    <FilterButton
                                        key={filter.id}
                                        active={activeFilter === filter.id}
                                        onClick={() => setActiveFilter(filter.id)}
                                    >
                                        {filter.label}
                                    </FilterButton>
                                ))}
                            </div>

                            {/* Reels Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
                                {filteredReels.map((reel, index) => (
                                    <ReelCard
                                        key={reel.id}
                                        reel={reel}
                                        index={index}
                                        onViewDetails={() => setSelectedReel(reel)}
                                    />
                                ))}
                            </div>

                            {filteredReels.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-slate-500">No reels found for this filter.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <AIInsightsView
                            researchSummary={researchSummary}
                            userPerformance={userPerformance}
                        />
                    )}
                </div>
            </main>

            {/* Modal */}
            {selectedReel && (
                <ReelModal
                    reel={selectedReel}
                    onClose={() => setSelectedReel(null)}
                />
            )}
        </div>
    );
}
