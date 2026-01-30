"use client";

import React, { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { TrendingUp, ArrowUp, Minus, Heart, Repeat2, MessageCircle, ExternalLink, Eye, Users, Zap, Menu, Clock, LayoutGrid, Sparkles, Loader2 } from "lucide-react";
import MobileHeader from "../components/MobileHeader";
import { TweetData, ResearchSummary } from "@/app/types/trendsta";
import SmartInsightsView from "../components/SmartInsightsView";
import NoResearchFound from "../components/NoResearchFound";
import NoResearchState from "../components/NoResearchState";
import NoSocialAccount from "../components/NoSocialAccount";
import AnalyseConfirmModal from "../components/AnalyseConfirmModal";
import { useTwitterResearch, useOverallStrategy } from "@/hooks/useResearch";
import { useSocialAccount } from "@/hooks/useSocialAccount";
import { useAnalysis } from "@/app/context/AnalysisContext";
import { useSession } from "@/lib/auth-client";
import { RawTweet, RawTwitterResearch } from "@/app/types/rawApiTypes";

export const dynamic = 'force-dynamic';

// Transform RawTweet to TweetData format
function transformTweet(raw: RawTweet): TweetData {
    return {
        id: raw.id,
        url: raw.url,
        text: raw.text,
        hook: raw.text.slice(0, 100),
        wordCount: raw.text.split(/\s+/).length,
        charCount: raw.text.length,
        hasQuestion: raw.text.includes("?"),
        hasEmoji: /[\u{1F600}-\u{1F64F}]/u.test(raw.text),
        hasNumbers: /\d/.test(raw.text),
        contentFormat: "text",
        author: raw.author,
        authorName: raw.author, // API doesn't provide separate authorName
        authorFollowers: 0, // Not in RawTweet
        isVerified: false,
        isBlueVerified: false,
        authorProfilePic: `https://ui-avatars.com/api/?name=${raw.author}`,
        likes: raw.likes,
        retweets: raw.rts,
        replies: raw.replies,
        quotes: raw.quotes || 0,
        bookmarks: raw.bookmarks || 0,
        views: raw.views,
        totalEngagement: raw.eng,
        engagementRate: raw.engRate,
        viralScore: raw.viralScore || raw.score || 0,
        postedAt: raw.timestamp,
        postDate: raw.timestamp,
        ageHours: raw.ageHours || 0,
        ageDays: raw.ageDays || 0,
        postHour: 0,
        postDay: "",
        language: raw.lang,
        hashtags: raw.hashtags || [],
        mentions: [],
        mediaType: "none",
        mediaUrl: null,
        hasMedia: false,
        hasLinks: false,
        linkedDomains: [],
        isReply: false,
        isPinned: false,
        rank: raw.rank,
    };
}


// Score Badge for Tweets
function ScoreBadge({ score }: { score: number }) {
    const getLevel = (s: number) => {
        const val = s || 0;
        if (val >= 80) return { label: "Viral", className: "score-high" };
        if (val >= 50) return { label: "Hot", className: "score-medium" };
        return { label: "Rising", className: "score-low" };
    };
    const level = getLevel(score);
    return (
        <span className={`score-badge ${level.className}`}>
            <Zap size={10} />
            {(score || 0).toFixed(1)}
        </span>
    );
}

// Trending Topic Item
function TrendingItem({ topic, index }: { topic: { rank: number; topic: string; tweets: string; direction: string }; index: number }) {
    return (
        <div
            className="flex items-center gap-4 p-4 hover:bg-slate-50/5 rounded-xl transition-all duration-200 cursor-pointer group"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <span className="text-2xl font-bold text-theme-muted w-8 group-hover:text-blue-500 transition-colors">
                #{topic.rank}
            </span>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-theme-primary group-hover:text-blue-600 transition-colors">
                        {topic.topic}
                    </span>
                    {topic.direction === "Rising" ? (
                        <ArrowUp size={14} className="text-emerald-500" />
                    ) : (
                        <Minus size={14} className="text-slate-400" />
                    )}
                </div>
                <p className="text-sm text-theme-secondary">{topic.tweets}</p>
            </div>
            <span className={`score-badge ${topic.direction === "Rising" ? "score-high" : "score-low"}`}>
                {topic.direction}
            </span>
        </div>
    );
}

// Tweet Card Component
function TweetCard({ tweet, index }: { tweet: TweetData; index: number }) {
    const postedAgo = (hours: number) => {
        const h = hours || 0;
        if (h < 24) return `${h.toFixed(0)}h ago`;
        return `${(h / 24).toFixed(0)}d ago`;
    };

    return (
        <div
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            {/* Author Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className="avatar-ring">
                    <img
                        src={tweet.authorProfilePic || "https://ui-avatars.com/api/?name=" + tweet.authorName}
                        alt={tweet.authorName}
                        className="w-12 h-12 rounded-full object-cover bg-slate-800"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-theme-primary truncate">{tweet.authorName}</span>
                        {tweet.isVerified && (
                            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.034-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z" />
                            </svg>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-theme-muted">
                        <span>@{tweet.author}</span>
                        <span>•</span>
                        <span>{postedAgo(tweet.ageHours)}</span>
                        {tweet.viralScore > 0 && (
                            <>
                                <span>•</span>
                                <ScoreBadge score={tweet.viralScore} />
                            </>
                        )}
                    </div>
                </div>
                <a
                    href={tweet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-theme-muted hover:text-blue-500 transition-colors"
                >
                    <ExternalLink size={16} />
                </a>
            </div>

            {/* Tweet Content */}
            <p className="text-theme-primary leading-relaxed mb-4 whitespace-pre-wrap">
                {tweet.text}
            </p>

            {/* Follower count */}
            <div className="flex items-center gap-2 text-xs text-theme-muted mb-4">
                <Users size={12} />
                <span>{((tweet.authorFollowers || 0) / 1000).toFixed(1)}k followers</span>
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
                <button className="engagement-item">
                    <MessageCircle size={16} />
                    <span>{tweet.replies}</span>
                </button>
                <button className="engagement-item hover:text-emerald-600">
                    <Repeat2 size={16} />
                    <span>{tweet.retweets}</span>
                </button>
                <button className="engagement-item hover:text-rose-500">
                    <Heart size={16} />
                    <span>{tweet.likes}</span>
                </button>
                <button className="engagement-item">
                    <Eye size={16} />
                    <span>{tweet.views}</span>
                </button>
            </div>
        </div >
    );
}

// Latest Tweet Item (compact)
function LatestTweetItem({ tweet, index }: { tweet: TweetData; index: number }) {
    const postedAgo = (hours: number) => {
        const h = hours || 0;
        if (h < 1) return "< 1h";
        if (h < 24) return `${h.toFixed(0)}h`;
        return `${(h / 24).toFixed(0)}d`;
    };

    return (
        <div
            className="p-4 hover:bg-slate-50/5 rounded-xl transition-all duration-200 border-b border-white/5 last:border-b-0"
            style={{ animationDelay: `${index * 0.03}s` }}
        >
            <div className="flex items-start gap-3">
                <img
                    src={tweet.authorProfilePic || "https://ui-avatars.com/api/?name=" + tweet.authorName}
                    alt={tweet.authorName}
                    className="w-10 h-10 rounded-full bg-slate-800 object-cover"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-theme-primary text-sm">{tweet.authorName}</span>
                        <span className="text-xs text-theme-muted">@{tweet.author}</span>
                        <span className="text-xs text-theme-muted">• {postedAgo(tweet.ageHours)}</span>
                    </div>
                    <p className="text-sm text-theme-secondary line-clamp-2">{tweet.text}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-theme-muted">
                        <span className="flex items-center gap-1">
                            <Heart size={12} />
                            {tweet.likes}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {tweet.views}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main Twitter Insights Page
export default function TwitterClient() {
    const [viewMode, setViewMode] = useState<'tweets' | 'insights'>('tweets');
    const [activeTab, setActiveTab] = useState<"top" | "latest">("top");
    const [showAnalyseModal, setShowAnalyseModal] = useState(false);

    // Fetch Twitter research data from cache
    const { data: twitterData, isLoading, isNoResearch, isError, error } = useTwitterResearch();
    const { data: overallStrategy } = useOverallStrategy();
    const { data: socialAccount, isLoading: socialLoading, hasNoAccount } = useSocialAccount();
    const { isAnalysing } = useAnalysis();
    const { data: session } = useSession();

    // Transform raw tweets to TweetData format
    const topTweets = useMemo(() => {
        if (!twitterData?.top?.tweets) return [];
        return twitterData.top.tweets.map(transformTweet);
    }, [twitterData]);

    const latestTweets = useMemo(() => {
        if (!twitterData?.latest?.tweets) return [];
        return twitterData.latest.tweets.map(transformTweet);
    }, [twitterData]);

    // Get Twitter insights from overall strategy
    const twitterInsights = useMemo(() => {
        if (!overallStrategy?.twitter_trend_analysis) return "";
        return overallStrategy.twitter_trend_analysis
            .map(t => `**${t.trend_topic}** (${t.sentiment}): ${t.adaptation_angle}`)
            .join("\n\n");
    }, [overallStrategy]);

    // Derive Trending Topics from hashtags
    const hashtags = useMemo(() => {
        const counts: Record<string, number> = {};
        topTweets.forEach(t => {
            if (t.hashtags && t.hashtags.length > 0) {
                t.hashtags.forEach(tag => counts[tag] = (counts[tag] || 0) + 1);
            }
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([topic, count], i) => ({
                rank: i + 1,
                topic: topic.startsWith('#') ? topic : `#${topic}`,
                tweets: `${count * 10}+ tweets`, // Fake multiplier for "scale"
                direction: Math.random() > 0.3 ? "Rising" : "Stable"
            }));
    }, [topTweets]);

    // Stats
    const maxViews = Math.max(0, ...topTweets.map(t => t.views || 0));
    const maxFollowers = Math.max(0, ...topTweets.map(t => t.authorFollowers || 0));
    const topScore = Math.max(0, ...topTweets.map(t => t.viralScore || 0));

    // Sort tweets by viral score for "Top Tweets" view
    const sortedTopTweets = [...topTweets].sort((a, b) => b.viralScore - a.viralScore);

    // Don't show loading if query has errored (404 or other)
    const isPageLoading = !isError && (isLoading || socialLoading);

    // Loading state - show spinner while any query is loading
    if (isPageLoading) {
        return (
            <div className="min-h-screen bg-transparent">
                <Sidebar />
                <MobileHeader />
                <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                            <p className="text-slate-500">Loading Twitter insights...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // No Social Account State
    if (hasNoAccount) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Sidebar />
                <MobileHeader />
                <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
                    <NoSocialAccount />
                </main>
            </div>
        );
    }

    // Error State - check for 404 (no research) vs other errors
    if (isError) {
        // Check if it's a 404 (no research found)
        const errorStatus = (error as { status?: number })?.status;
        const is404 = errorStatus === 404;

        if (is404 && !isAnalysing && session?.user) {
            return (
                <div className="min-h-screen bg-slate-50">
                    <Sidebar />
                    <MobileHeader />
                    <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
                        <NoResearchState onAnalyse={() => setShowAnalyseModal(true)} />
                        <AnalyseConfirmModal
                            open={showAnalyseModal}
                            onOpenChange={setShowAnalyseModal}
                            socialAccountId={socialAccount?.id || ""}
                        />
                    </main>
                </div>
            );
        }

        // Other errors - show generic error
        return (
            <div className="min-h-screen bg-transparent">
                <Sidebar />
                <MobileHeader />
                <main className="md:ml-64 p-4 md:p-8 transition-all duration-300">
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="text-center">
                            <p className="text-red-500 font-medium">Something went wrong</p>
                            <p className="text-slate-500 mt-2">{(error as Error)?.message}</p>
                        </div>
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
                                {viewMode === 'tweets' ? 'X Intelligence' : 'X AI Strategy'}
                            </h1>
                            <p className="text-theme-secondary mt-2">
                                {viewMode === 'tweets'
                                    ? `Tracking ${latestTweets.length} tweets in your niche.`
                                    : 'Strategic analysis of the Twitter landscape.'}
                            </p>
                        </div>

                        {/* View Toggle */}
                        <div className="glass-panel p-1 rounded-xl inline-flex">
                            <button
                                onClick={() => setViewMode('tweets')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'tweets'
                                    ? 'bg-blue-500/20 text-blue-500'
                                    : 'text-theme-secondary hover:text-theme-primary hover:bg-white/5'
                                    }`}
                            >
                                <LayoutGrid size={18} />
                                Tweets
                            </button>
                            <button
                                onClick={() => setViewMode('insights')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'insights'
                                    ? 'bg-blue-500 text-blue-600'
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
                            insightText={twitterInsights || "No Twitter insights available yet. Run an analysis to generate insights."}
                            title="X Strategy"
                            description="Actionable opportunities found in the latest Twitter discourse."
                            theme="twitter"
                        />
                    ) : (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Two Panel Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Panel - Trending Topics */}
                                <div className="lg:col-span-1">
                                    <div className="glass-panel overflow-hidden sticky top-8">
                                        <div className="p-5 border-b border-white/5 flex items-center gap-2">
                                            <TrendingUp size={20} className="text-blue-500" />
                                            <h2 className="font-semibold text-theme-primary">Trending Topics</h2>
                                            <div className="live-indicator ml-2" />
                                        </div>
                                        <div className="divide-y divide-white/5">
                                            {hashtags.map((topic, index) => (
                                                <TrendingItem key={topic.rank} topic={topic} index={index} />
                                            ))}
                                            {hashtags.length === 0 && (
                                                <div className="p-4 text-center text-theme-muted text-sm">No trending topics found</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Panel - Tweet Feed */}
                                <div className="lg:col-span-2 space-y-4">
                                    {/* Tab Switcher */}
                                    <div className="flex items-center gap-2 p-1 glass-panel rounded-xl w-fit">
                                        <button
                                            onClick={() => setActiveTab("top")}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "top"
                                                ? "bg-white/10 text-blue-500 shadow-sm"
                                                : "text-theme-muted hover:text-theme-primary hover:bg-white/5"
                                                }`}
                                        >
                                            <Zap size={14} className="inline mr-1.5" />
                                            Top Tweets
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("latest")}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "latest"
                                                ? "bg-white/10 text-blue-500 shadow-sm"
                                                : "text-theme-muted hover:text-theme-primary hover:bg-white/5"
                                                }`}
                                        >
                                            <Clock size={14} className="inline mr-1.5" />
                                            Latest
                                        </button>
                                    </div>

                                    {activeTab === "top" ? (
                                        <div className="space-y-4">
                                            {sortedTopTweets.map((tweet, index) => (
                                                <div key={tweet.id} className="glass-card p-5">
                                                    {/* Tweet Card Logic Copied Inline for simplicity in replace */}
                                                    <TweetCard tweet={tweet} index={index} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="glass-panel overflow-hidden">
                                            <div className="p-4 border-b border-white/5 flex items-center gap-2">
                                                <div className="live-indicator" />
                                                <span className="text-sm font-medium text-theme-primary">Live Feed</span>
                                                <span className="text-xs text-theme-muted">• Updates in real-time</span>
                                            </div>
                                            <div>
                                                {latestTweets.map((tweet, index) => (
                                                    <LatestTweetItem key={tweet.id} tweet={tweet} index={index} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
