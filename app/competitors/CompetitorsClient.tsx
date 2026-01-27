"use client";

import React, { useState, useMemo } from "react";
import { Play, TrendingUp, Users, X, Search, Loader2, Sparkles, LayoutGrid } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import ReelCard from "../components/ReelCard";
import ReelModal from "../components/ReelModal";
import SmartInsightsView from "../components/SmartInsightsView";
import { CompetitorResearch, ReelData, ResearchSummary } from "@/app/types/trendsta";

interface CompetitorsClientProps {
    data: CompetitorResearch;
    researchSummary?: ResearchSummary[];
}

type SortField = "velocity" | "views" | "likes" | "engagement";

export default function CompetitorsClient({ data, researchSummary }: CompetitorsClientProps) {
    const [viewMode, setViewMode] = useState<'reels' | 'insights'>('insights');
    const [sortBy, setSortBy] = useState<SortField>("velocity");
    const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
    const [selectedReel, setSelectedReel] = useState<ReelData | null>(null);

    // State for filtering/adding (Visual only)
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

        if (!data || !data.reels) return [];

        data.reels.forEach(reel => {
            const username = reel.creator || reel.creatorName || "Unknown";
            if (!map.has(username)) {
                map.set(username, {
                    username,
                    fullName: reel.creatorName || username, // Best guess
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
            // Aggregates for avg later
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

    }, [data]);

    const allReels = data.reels || [];

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

    const handleAddCompetitor = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSearchQuery("");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <MobileHeader />

            <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fadeInUp">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                {viewMode === 'reels' ? 'Competitor Intelligence' : 'Competitor Strategy Analysis'}
                            </h1>
                            <p className="text-slate-500 mt-2">
                                {viewMode === 'reels'
                                    ? `Tracking ${data.summary?.competitorsTracked || 0} competitors and ${data.reels?.length || 0} viral uploads.`
                                    : 'AI breakdown of what your competitors are doing right.'}
                            </p>
                        </div>

                        {/* View Toggle */}
                        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm inline-flex">
                            <button
                                onClick={() => setViewMode('reels')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'reels'
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                <LayoutGrid size={18} />
                                Monitoring
                            </button>
                            <button
                                onClick={() => setViewMode('insights')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'insights'
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                <Sparkles size={18} />
                                AI Insights
                            </button>
                        </div>
                    </div>

                    {viewMode === 'insights' ? (
                        <SmartInsightsView
                            insightText={researchSummary?.[0]?.competitor_insights || ""}
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
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        {selectedCreator ? `@${selectedCreator}'s Reels` : 'All Competitor Reels'}
                                        <span className="ml-2 text-sm font-normal text-slate-500">({filteredReels.length})</span>
                                    </h2>
                                    <div className="flex gap-3">
                                        {selectedCreator && (
                                            <button
                                                onClick={() => setSelectedCreator(null)}
                                                className="px-3 py-1.5 text-xs bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 flex items-center gap-1"
                                            >
                                                <X size={12} /> Clear Filter
                                            </button>
                                        )}
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as SortField)}
                                            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="velocity">Sort by Velocity</option>
                                            <option value="views">Sort by Views</option>
                                            <option value="likes">Sort by Likes</option>
                                            <option value="engagement">Sort by Engagement</option>
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
                                        <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-slate-500">No reels found matching your criteria.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Sidebar - Filters */}
                            <div className="w-full lg:w-80 space-y-6 order-1 lg:order-2 h-fit static lg:sticky lg:top-8">
                                {/* Search Section removed as per request */}

                                {/* Tracked Competitors List - Compact Filter Style */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 px-1">
                                        <Users size={16} className="text-slate-500" />
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
                                                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
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
                                                        <p className={`text-sm font-semibold truncate ${selectedCreator === competitor.username ? 'text-white' : 'text-slate-900'}`}>
                                                            @{competitor.username}
                                                        </p>
                                                        {/* Badge */}
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCreator === competitor.username ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                            {competitor.reels.length}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {competitorsList.length === 0 && (
                                            <div className="text-center py-6 text-slate-400 text-xs italic">
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
