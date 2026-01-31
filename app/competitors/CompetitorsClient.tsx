"use client";

import React, { useState, useMemo } from "react";
import { Users, X, Sparkles, LayoutGrid, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import ReelCard from "../components/ReelCard";
import ReelModal from "../components/ReelModal";
import SmartInsightsView from "../components/SmartInsightsView";
import NoResearchState from "../components/NoResearchState";
import { ReelData } from "@/app/types/trendsta";

// Hooks & Transformers
import { useCompetitorResearch, useOverallStrategy } from "@/hooks/useResearch";
import { useSocialAccount } from "@/hooks/useSocialAccount";
import { useSession } from "@/lib/auth-client";
import { transformCompetitorResearch, formatCompetitorInsights } from "@/lib/transformers";

type SortField = "velocity" | "views" | "likes" | "engagement";

export default function CompetitorsClient() {
    const [viewMode, setViewMode] = useState<'reels' | 'insights'>('insights');
    const [sortBy, setSortBy] = useState<SortField>("velocity");
    const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
    const [selectedReel, setSelectedReel] = useState<ReelData | null>(null);

    // Fetch data via hooks
    const { data: rawCompetitorData, isLoading: competitorLoading, error: competitorError, isNoResearch } = useCompetitorResearch();
    const { data: rawStrategyData, isLoading: strategyLoading } = useOverallStrategy();
    const { data: socialAccount } = useSocialAccount();
    const { data: session } = useSession();

    // Transform raw data to UI types
    const competitorResearch = transformCompetitorResearch(rawCompetitorData);
    const competitorInsightsText = formatCompetitorInsights(rawStrategyData?.competitor_reverse_engineering);

    const isLoading = competitorLoading || strategyLoading;

    // Derive Competitors List from Reels
    const competitorsList = useMemo(() => {
        const map = new Map<string, {
            username: string;
            fullName: string;
            reels: ReelData[];
            totalViews: number;
            totalLikes: number;
            avgVelocity: number;
            avgEngagement: number;
        }>();

        if (!competitorResearch || !competitorResearch.reels) return [];

        competitorResearch.reels.forEach(reel => {
            const username = reel.creator || reel.creatorName || "Unknown";
            if (!map.has(username)) {
                map.set(username, {
                    username,
                    fullName: reel.creatorName || username,
                    reels: [],
                    totalViews: 0,
                    totalLikes: 0,
                    avgVelocity: 0,
                    avgEngagement: 0
                });
            }
            const comp = map.get(username)!;
            comp.reels.push(reel);
            comp.totalViews += reel.views || 0;
            comp.totalLikes += reel.likes || 0;
        });

        const list = Array.from(map.values()).map(comp => {
            const count = comp.reels.length;
            const totalVelocity = comp.reels.reduce((acc, r) => acc + (r.velocity_score || 0), 0);
            const totalEng = comp.reels.reduce((acc, r) => acc + (r.engagement_rate || 0), 0);

            return {
                ...comp,
                avgVelocity: count > 0 ? totalVelocity / count : 0,
                avgEngagement: count > 0 ? totalEng / count : 0
            };
        });

        return list;

    }, [competitorResearch]);

    const allReels = competitorResearch?.reels || [];

    const sortedReels = [...allReels].sort((a, b) => {
        switch (sortBy) {
            case "velocity": return (b.velocity_score || 0) - (a.velocity_score || 0);
            case "views": return (b.views || 0) - (a.views || 0);
            case "likes": return (b.likes || 0) - (a.likes || 0);
            case "engagement": return (b.engagement_rate || 0) - (a.engagement_rate || 0);
            default: return 0;
        }
    });

    const filteredReels = selectedCreator
        ? sortedReels.filter(r => (r.creator === selectedCreator || r.creatorName === selectedCreator))
        : sortedReels;

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-transparent">
                <Sidebar />
                <MobileHeader />
                <main className="md:ml-64 p-4 md:p-8 flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        <p className="text-theme-secondary">Loading competitor data...</p>
                    </div>
                </main>
            </div>
        );
    }

    // No research state for logged-in users
    if (isNoResearch && session?.user) {
        return (
            <div className="min-h-screen bg-transparent">
                <Sidebar />
                <MobileHeader />
                <main className="md:ml-64 p-4 md:p-8">
                    <NoResearchState/>
                </main>
            </div>
        );
    }

    // Error State
    if (competitorError) {
        return (
            <div className="min-h-screen bg-transparent">
                <Sidebar />
                <MobileHeader />
                <main className="md:ml-64 p-4 md:p-8 flex items-center justify-center min-h-screen">
                    <div className="glass-panel border-red-500/30 p-6 max-w-md text-center">
                        <p className="text-red-500 font-medium">Failed to load competitor data</p>
                        <p className="text-red-400/80 text-sm mt-2">{(competitorError as Error).message}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent">
            <Sidebar />
            <MobileHeader />

            <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fadeInUp">
                        <div>
                            <h1 className="text-3xl font-bold text-theme-primary flex items-center gap-3">
                                {viewMode === 'reels' ? 'Competitor Intelligence' : 'Competitor Strategy Analysis'}
                            </h1>
                            <p className="text-theme-secondary mt-2">
                                {viewMode === 'reels'
                                    ? `Tracking ${competitorResearch?.summary?.competitorsTracked || 0} competitors and ${competitorResearch?.reels?.length || 0} viral uploads.`
                                    : 'AI breakdown of what your competitors are doing right.'}
                            </p>
                        </div>

                        {/* View Toggle */}
                        <div className="glass-panel p-1 rounded-xl inline-flex">
                            <button
                                onClick={() => setViewMode('reels')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'reels'
                                    ? 'bg-indigo-500/20 text-indigo-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/5'
                                    }`}
                            >
                                <LayoutGrid size={18} />
                                Monitoring
                            </button>
                            <button
                                onClick={() => setViewMode('insights')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'insights'
                                    ? 'bg-indigo-500/20 text-indigo-400 shadow-sm'
                                    : 'text-theme-secondary hover:text-theme-primary hover:bg-white/5'
                                    }`}
                            >
                                <Sparkles size={18} />
                                AI Insights
                            </button>
                        </div>
                    </div>

                    {viewMode === 'insights' ? (
                        <SmartInsightsView
                            insightText={competitorInsightsText}
                            title="Competitor Strategy Breakdown"
                            description="Reverse-engineering the top performing strategies in your niche."
                            theme="competitor"
                        />
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
                            {/* Main Content - Reels Grid */}
                            <div className="flex-1 order-2 lg:order-1">
                                {/* Sort Controls */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-theme-primary">
                                        {selectedCreator ? `@${selectedCreator}'s Reels` : 'All Competitor Reels'}
                                        <span className="ml-2 text-sm font-normal text-theme-muted">({filteredReels.length})</span>
                                    </h2>
                                    <div className="flex gap-3">
                                        {selectedCreator && (
                                            <button
                                                onClick={() => setSelectedCreator(null)}
                                                className="px-3 py-1.5 text-xs glass-panel hover:bg-white/10 flex items-center gap-1"
                                            >
                                                <X size={12} />Clear Filter
                                            </button>
                                        )}
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortField)}
                                            className="px-3 py-2 glass-panel border border-white/10 rounded-xl text-sm text-theme-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="velocity" className="bg-gray-800 dark:bg-gray-900 text-theme-primary">Sort by Velocity</option>
                                            <option value="views" className="bg-gray-800 dark:bg-gray-900 text-theme-primary">Sort by Views</option>
                                            <option value="likes" className="bg-gray-800 dark:bg-gray-900 text-theme-primary">Sort by Likes</option>
                                            <option value="engagement" className="bg-gray-800 dark:bg-gray-900 text-theme-primary">Sort by Engagement</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Reels Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                                    {filteredReels.map((reel, index) => (
                                        <ReelCard
                                            key={reel.id}
                                            reel={reel}
                                            index={index}
                                            onViewDetails={() => setSelectedReel(reel)}
                                        />
                                    ))}
                                    {filteredReels.length === 0 && (
                                        <div className="col-span-full text-center py-12 glass-panel border-dashed border-white/10">
                                            <p className="text-slate-500">No reels found matching your criteria.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Sidebar - Filters */}
                            <div className="w-full lg:w-80 space-y-6 order-1 lg:order-2 h-fit static lg:sticky lg:top-8">
                                {/* Tracked Competitors List - Compact Filter Style */}
                                <div>
                                    <h3 className="text-sm font-bold text-theme-primary mb-3 flex items-center gap-2 px-1">
                                        <Users size={16} className="text-theme-muted" />
                                        Filter by Creator
                                    </h3>
                                    <div className="space-y-2">
                                        {competitorsList.map((competitor, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedCreator(selectedCreator === competitor.username ? null : competitor.username)}
                                                className={`
                                                    group flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200
                                                    ${selectedCreator === competitor.username
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-[1.02]'
                                                        : 'glass-panel border-transparent hover:border-white/10 hover:shadow-sm'
                                                    }
                                                `}
                                            >
                                                {/* Avatar */}
                                                <div className={`
                                                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                                    ${selectedCreator === competitor.username ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white'}
                                                `}>
                                                    {competitor.username[0].toUpperCase()}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className={`text-sm font-semibold truncate ${selectedCreator === competitor.username ? 'text-white' : 'text-theme-primary'}`}>
                                                            @{competitor.username}
                                                        </p>
                                                        {/* Badge */}
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCreator === competitor.username ? 'bg-white/20 text-white' : 'bg-purple-500/20 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'}`}>
                                                            {competitor.reels.length}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {competitorsList.length === 0 && (
                                            <div className="text-center py-6 text-theme-muted text-xs italic">
                                                No competitors added yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal for Reel Details */}
            {selectedReel && (
                <ReelModal
                    reel={selectedReel}
                    onClose={() => setSelectedReel(null)}
                />
            )}
        </div>
    );
}
