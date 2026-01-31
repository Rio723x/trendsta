"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import { StatsOverview } from "./components/StatsOverview";
import ResearchSummaryView from "./components/ResearchSummaryView";
import { ScriptIdeasLink, QuickActions } from "./components/DashboardCards";
import { useSidebar } from "../context/SidebarContext";
import { TrendstaData } from "../types/trendsta";
import { Calendar } from "lucide-react";

// New Widgets
import ViralSweetSpotWidget from "./components/widgets/ViralSweetSpotWidget";
import HookLeaderboardWidget from "./components/widgets/HookLeaderboardWidget";
import OpportunityClockWidget from "./components/widgets/OpportunityClockWidget";
import TopicGapsWidget from "./components/widgets/TopicGapsWidget";
import ContentDietWidget from "./components/widgets/ContentDietWidget";
import TopicDominanceWidget from "./components/widgets/TopicDominanceWidget";
import ConsistencyWidget from "./components/widgets/ConsistencyWidget";
import TopHooksView from "./components/TopHooksView";
import KeyMetricsRow from "./components/widgets/KeyMetricsRow";

import { ViralTriggerWidget, ContentGapWidget, HookFormulaWidget } from "./components/widgets/StrategyWidgets";

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
    const scriptIdeas = data.LLM_script_ideas || [];
    const graphs = data.dashboard_graphs;

    // Prepare Metrics Data
    const metricsData = {
        best_time: summaryData.posting_strategy?.best_times?.[0] || "10:00 AM",
        best_days: (summaryData.posting_strategy?.best_days || []).join(" & "),
        target_pace: "190+",
        pace_detail: "High Energy Required",
        viral_trigger: summaryData.viral_triggers?.[0]?.trigger || "Unknown",
        trigger_detail: "VS Competitor",
        content_gap: summaryData.content_gap?.gap || "Unknown",
        gap_detail: summaryData.content_gap?.opportunity || "High Demand",
    };

    // Override with specific data if available
    if (summaryData.execution_plan?.production_spec_sheet?.target_wpm) {
        // Extract number from string if possible or use full string
        metricsData.target_pace = summaryData.execution_plan.production_spec_sheet.target_wpm.split(' ')[0] || "190+";
    }

    return (
        <div className="min-h-screen relative selection:bg-blue-200">


            <Sidebar />
            <MobileHeader />

            <main className={`relative z-10 transition-all duration-300 ease-in-out p-4 md:p-6 pb-32 ${isCollapsed ? 'md:ml-24' : 'md:ml-72'}`}>
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Page Header with Date Toggle */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-700 tracking-tight">
                                Analytics Dashboard
                            </h1>
                            <p className="text-slate-500 mt-1">Analysis based on research from {formattedDate}</p>
                        </div>

                        {/* Guest Banner */}
                        {data.isGuest && (
                            <div className="flex items-center gap-4 neu-pressed px-4 py-2 rounded-xl">
                                <div className="text-indigo-600 text-sm font-medium">
                                    Viewing as Guest Mode
                                </div>
                                <a href="/signin" className="neu-btn-primary text-xs">
                                    Log In to Save
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Key Metrics Row */}
                    <KeyMetricsRow data={metricsData} />

                    {/* New Dashboard Graphs Grid */}
                    {graphs && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Row 1: Viral Sweet Spot (Wide) & Hook Leaderboard */}
                            <div className="lg:col-span-2 h-[350px]">
                                <ViralSweetSpotWidget data={graphs.scatter_plot_viral_sweet_spot} />
                            </div>
                            <div className="h-[350px]">
                                <HookLeaderboardWidget data={graphs.bar_chart_hook_leaderboard} />
                            </div>

                            {/* Row 2: Topic Gaps (Wide) & Content Diet */}
                            <div className="lg:col-span-2 h-[400px]">
                                <TopicGapsWidget data={graphs.bubble_chart_topic_gaps} />
                            </div>
                            <div className="h-[400px]">
                                <ContentDietWidget data={graphs.pie_chart_content_diet} />
                            </div>

                            {/* Row 3: Topic Dominance & Opportunity Clock */}
                            <div className="lg:col-span-2 h-[350px]">
                                <TopicDominanceWidget data={graphs.treemap_topic_dominance} />
                            </div>
                            <div className="h-[350px]">
                                <OpportunityClockWidget data={graphs.heatmap_opportunity_clock} />
                            </div>


                            {/* Row 4: Consistency & Hook Formula */}
                            <div className="lg:col-span-2 min-h-[350px]">
                                <ConsistencyWidget data={graphs.stacked_bar_consistency} />
                            </div>
                            <div className="min-h-[350px]">
                                <HookFormulaWidget data={summaryData.hook_formula} />
                            </div>
                        </div>
                    )}

                    {/* Strategy & Top Hooks Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>

                        {/* Left Column: Strategy Widgets (Stacked) */}
                        <div className="space-y-6 flex flex-col h-full">
                            <div className="min-h-[200px] flex-1">
                                <ContentGapWidget data={summaryData.content_gap} />
                            </div>
                            <div className="min-h-[300px] flex-1">
                                <ViralTriggerWidget data={summaryData.viral_triggers} />
                            </div>
                        </div>

                        {/* Right Column: Thief Gallery (Top Hooks) - Takes 2/3 width */}
                        <div className="lg:col-span-2">
                            <TopHooksView hooks={data.hooks || []} />
                        </div>
                    </div>

                    {/* Execution Block (Research Summary) */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <ResearchSummaryView summary={summaryData} />
                    </div>

                </div>
            </main>
        </div>
    );
}
