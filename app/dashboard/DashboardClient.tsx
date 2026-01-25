"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import { StatsOverview } from "./components/StatsOverview";
import { VelocityChart, EngagementChart } from "./components/ChartsView";
import ResearchSummaryView from "./components/ResearchSummaryView";
import { ScriptIdeasLink, QuickActions } from "./components/DashboardCards";
import { NewMetricBarChart } from "./components/NewMetricBarChart";
import { Calendar } from "lucide-react";
// New Components
import ScriptLabView from "./components/ScriptLabView";
import PerformanceDoctorView from "./components/PerformanceDoctorView";
import SpyGlassView from "./components/SpyGlassView";
import { useSidebar } from "../context/SidebarContext";
import { TrendstaData } from "../types/trendsta";

export const dynamic = 'force-dynamic';

interface DashboardClientProps {
    data: TrendstaData;
}

export default function DashboardClient({ data }: DashboardClientProps) {
    const { isCollapsed } = useSidebar();
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const [dateRange, setDateRange] = useState("7d");

    // Extract Data Sections
    const summaryData = data.llm_research_summary?.[0] || {};
    // Map reels for charts (Adapting snake_case to camelCase if needed by ChartsView)
    // Checking ChartsView, it expects: creator, velocityScore, views, likes, comments, shares.
    const topReels = (data.niche_research?.reels || []).map(reel => ({
        creator: reel.creator || reel.creatorName || "Unknown",
        velocityScore: reel.velocity_score || 0,
        views: reel.views || 0,
        likes: reel.likes || 0,
        comments: reel.comments || 0,
        shares: reel.shares || 0
    }));

    const scriptIdeas = data.LLM_script_ideas || [];
    const performanceData = data.user_performance_research;
    const competitorData = data.competitor_research;

    // Latest viral score for the ScriptIdeasLink
    const topScriptScore = scriptIdeas.length > 0 ? scriptIdeas[0].viral_potential_score : 0;

    return (
        <div className="min-h-screen bg-white relative selection:bg-blue-200">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] opacity-70" />
                <div className="absolute top-[20%] right-0 w-[40%] h-[40%] bg-indigo-400/10 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-0 left-[20%] w-[60%] h-[40%] bg-amber-200/20 rounded-full blur-[120px] opacity-50" />
            </div>

            <Sidebar />
            <MobileHeader />

            <main className={`relative z-10 transition-all duration-300 ease-in-out p-4 md:p-8 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Page Header with Date Toggle */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                Analytics Dashboard
                            </h1>
                            <p className="text-slate-500 mt-1">{formattedDate}</p>
                        </div>

                        {/* Date Range Toggle */}
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                            <button
                                onClick={() => setDateRange("7d")}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${dateRange === "7d" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Last 7 Days
                            </button>
                            <button
                                onClick={() => setDateRange("30d")}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${dateRange === "30d" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Last 30 Days
                            </button>
                            <div className="px-3 border-l border-slate-100 ml-1">
                                <Calendar size={16} className="text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* Top Section: Bar Chart */}
                    <div className="animate-fadeInUp">
                        <NewMetricBarChart
                            timeRange={dateRange as '7d' | '30d'}
                            reels={performanceData?.reels || []}
                        />
                    </div>

                    {/* Charts Section */}
                    {topReels.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <VelocityChart data={topReels} />
                            <EngagementChart data={topReels} />
                        </div>
                    )}


                    {/* --- Advanced Dashboard Sections --- */}
                    <div className="space-y-8 animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
                        <ScriptLabView scripts={scriptIdeas} />
                        <PerformanceDoctorView performance={performanceData} />
                        <SpyGlassView research={summaryData} competitors={competitorData} />
                    </div>

                    {/* Execution Block (Research Summary) */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <ResearchSummaryView summary={summaryData} />
                    </div>

                    {/* Script Ideas Link Card */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <ScriptIdeasLink
                            count={scriptIdeas.length}
                            score={topScriptScore}
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                        <QuickActions reelsCount={topReels.length} />
                    </div>
                </div>
            </main>
        </div>
    );
}
