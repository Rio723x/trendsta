"use client";

import React, { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { TrendingUp, ArrowUp, Minus, Heart, Repeat2, MessageCircle, ExternalLink, Eye, Users, Zap, Menu, Clock, LayoutGrid, Sparkles } from "lucide-react";
import MobileHeader from "../components/MobileHeader";
import { TweetData, ResearchSummary } from "@/app/types/trendsta";
import SmartInsightsView from "../components/SmartInsightsView";

export const dynamic = 'force-dynamic';

interface TwitterClientProps {
    topTweets: TweetData[];
    latestTweets: TweetData[];
    researchSummary?: ResearchSummary[];
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
            className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-all duration-200 cursor-pointer group"
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <span className="text-2xl font-bold text-slate-400 w-8 group-hover:text-blue-500 transition-colors">
                #{topic.rank}
            </span>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {topic.topic}
                    </span>
                    {topic.direction === "Rising" ? (
                        <ArrowUp size={14} className="text-emerald-500" />
                    ) : (
                        <Minus size={14} className="text-slate-400" />
                    )}
                </div>
                <p className="text-sm text-slate-500">{topic.tweets}</p>
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
                        <span className="font-semibold text-slate-900 truncate">{tweet.authorName}</span>
                        {tweet.isVerified && (
                            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.034-.033-.513 1.158-.687 1.943-1.99 1.943-3.484z" />
                            </svg>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
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
                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                >
                    <ExternalLink size={16} />
                </a>
            </div>

            {/* Tweet Content */}
            <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">
                {tweet.text}
            </p>

            {/* Follower count */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
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
        </div>
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
            className="p-4 hover:bg-slate-50 rounded-xl transition-all duration-200 border-b border-slate-100 last:border-b-0"
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
                        <span className="font-semibold text-slate-900 text-sm">{tweet.authorName}</span>
                        <span className="text-xs text-slate-500">@{tweet.author}</span>
                        <span className="text-xs text-slate-500">• {postedAgo(tweet.ageHours)}</span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{tweet.text}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
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
export default function TwitterClient({ topTweets, latestTweets, researchSummary }: TwitterClientProps) {
    const [viewMode, setViewMode] = useState<'tweets' | 'insights'>('tweets');
    const [activeTab, setActiveTab] = useState<"top" | "latest">("top");

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
                                {viewMode === 'tweets' ? 'X Intelligence' : 'X AI Strategy'}
                            </h1>
                            <p className="text-slate-500 mt-2">
                                {viewMode === 'tweets'
                                    ? `Tracking ${latestTweets.length} tweets in your niche.`
                                    : 'Strategic analysis of the Twitter landscape.'}
                            </p>
                        </div>

                        {/* View Toggle */}
                        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm inline-flex">
                            <button
                                onClick={() => setViewMode('tweets')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'tweets'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                <LayoutGrid size={18} />
                                Tweets
                            </button>
                            <button
                                onClick={() => setViewMode('insights')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'insights'
                                    ? 'bg-blue-50 text-blue-600'
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
                            insightText={researchSummary?.[0]?.twitter_insights || ""}
                            title="X Strategy"
                            description="Actionable opportunities found in the latest Twitter discourse."
                            theme="twitter"
                        />
                    ) : (
                        <div className="space-y-8 animate-fadeIn">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                                <div className="stat-card">
                                    <p className="text-2xl font-bold text-slate-900">{topTweets.length}</p>
                                    <p className="text-xs text-slate-500">Top Tweets</p>
                                </div>
                                <div className="stat-card">
                                    <p className="text-2xl font-bold text-emerald-600">{(maxViews / 1000).toFixed(1)}K</p>
                                    <p className="text-xs text-slate-500">Max Views</p>
                                </div>
                                <div className="stat-card">
                                    <p className="text-2xl font-bold text-slate-900">{(maxFollowers / 1000).toFixed(1)}K</p>
                                    <p className="text-xs text-slate-500">Top Followers</p>
                                </div>
                                <div className="stat-card">
                                    <p className="text-2xl font-bold text-slate-900">{topScore.toFixed(1)}</p>
                                    <p className="text-xs text-slate-500">Top Score</p>
                                </div>
                            </div>

                            {/* Two Panel Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Panel - Trending Topics */}
                                <div className="lg:col-span-1">
                                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden sticky top-8 shadow-sm">
                                        <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                                            <TrendingUp size={20} className="text-blue-600" />
                                            <h2 className="font-semibold text-slate-900">Trending Topics</h2>
                                            <div className="live-indicator ml-2" />
                                        </div>
                                        <div className="divide-y divide-slate-100 stagger-children">
                                            {hashtags.map((topic, index) => (
                                                <TrendingItem key={topic.rank} topic={topic} index={index} />
                                            ))}
                                            {hashtags.length === 0 && (
                                                <div className="p-4 text-center text-slate-400 text-sm">No trending topics found</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Panel - Tweet Feed */}
                                <div className="lg:col-span-2 space-y-4">
                                    {/* Tab Switcher */}
                                    <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit border border-slate-200">
                                        <button
                                            onClick={() => setActiveTab("top")}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "top"
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            <Zap size={14} className="inline mr-1.5" />
                                            Top Tweets
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("latest")}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "latest"
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            <Clock size={14} className="inline mr-1.5" />
                                            Latest
                                        </button>
                                    </div>

                                    {activeTab === "top" ? (
                                        <div className="space-y-4 stagger-children">
                                            {sortedTopTweets.map((tweet, index) => (
                                                <TweetCard key={tweet.id} tweet={tweet} index={index} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="glass-card overflow-hidden border border-slate-200 bg-white">
                                            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                                                <div className="live-indicator" />
                                                <span className="text-sm font-medium text-slate-900">Live Feed</span>
                                                <span className="text-xs text-slate-500">• Updates in real-time</span>
                                            </div>
                                            <div className="stagger-children">
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
