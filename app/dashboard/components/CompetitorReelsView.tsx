"use client";

import React, { useState } from "react";
import {
    Eye, Heart, MessageCircle, Clock, TrendingUp, TrendingDown,
    ExternalLink, Play, Award, Zap, Flame, User, Music, Calendar,
    ChevronDown, ChevronUp, Copy, Check, Bookmark, Share2
} from "lucide-react";

// Competitor Reel Interface matching the provided data structure
export interface CompetitorReel {
    id: string;
    url: string;
    thumbnail: string;
    creator: string;
    creatorName: string;
    caption: string;
    spokenHook: string;
    hookSource?: string;
    hasTranscript: boolean;
    transcript: string;
    hashtags: string[];
    comments?: string[];
    views: number;
    likes: number;
    commentsCount: number;
    saves: number;
    shares: number;
    duration: number;
    engagementRate: number;
    isQualityEngagement?: boolean;
    wordsPerMinute: number;
    finalScore?: number;
    rank: number;
    views_over_expected: number;
    is_punching_above_weight: boolean;
    age_label: string;
    timestamp?: string;
    ageInDays?: number;
    postHour?: number;
    postDay: string;
    audio: {
        songName: string;
        artistName: string;
    };
    performanceTier: string;
    performanceScore: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CompetitorReelsViewProps {
    reels: any[];
}

// Helper to format numbers
const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
};

// Get tier color
const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
        case "viral":
            return "bg-gradient-to-r from-orange-500 to-red-500 text-white";
        case "above_average":
            return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white";
        case "average":
            return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
        case "underperformer":
            return "bg-gradient-to-r from-slate-400 to-slate-500 text-white";
        default:
            return "bg-slate-200 text-slate-700";
    }
};

// Get age label color
const getAgeLabelColor = (label: string) => {
    switch (label?.toLowerCase()) {
        case "fresh":
            return "bg-emerald-100 text-emerald-700 border-emerald-200";
        case "recent":
            return "bg-blue-100 text-blue-700 border-blue-200";
        case "established":
            return "bg-amber-100 text-amber-700 border-amber-200";
        default:
            return "bg-slate-100 text-slate-600 border-slate-200";
    }
};

// Normalize reel data to handle both old ReelData format and new competitor format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeReel = (reel: any): CompetitorReel => {
    return {
        id: reel.id || String(Math.random()),
        url: reel.url || '',
        thumbnail: reel.thumbnail || '',
        creator: reel.creator || '',
        creatorName: reel.creatorName || reel.creator || 'Unknown',
        caption: reel.caption || '',
        spokenHook: reel.spokenHook || reel.captionHook || '',
        hookSource: reel.hookSource || 'transcript',
        hasTranscript: reel.hasTranscript ?? !!reel.transcript,
        transcript: reel.transcript || '',
        hashtags: reel.hashtags || [],
        comments: Array.isArray(reel.comments) ? reel.comments : [],
        views: reel.views || 0,
        likes: reel.likes || 0,
        // Handle both commentsCount (new format) and comments as number (ReelData format)
        commentsCount: reel.commentsCount || (typeof reel.comments === 'number' ? reel.comments : 0),
        saves: reel.saves || 0,
        shares: reel.shares || 0,
        duration: reel.duration || 0,
        // Handle both camelCase and snake_case
        engagementRate: reel.engagementRate || reel.engagement_rate || 0,
        isQualityEngagement: reel.isQualityEngagement || reel.is_quality_engagement || false,
        wordsPerMinute: reel.wordsPerMinute || 0,
        finalScore: reel.finalScore || reel.final_score || reel.velocity_score || 0,
        rank: reel.rank || 0,
        views_over_expected: reel.views_over_expected || 0,
        is_punching_above_weight: reel.is_punching_above_weight || false,
        age_label: reel.age_label || 'established',
        timestamp: reel.timestamp || reel.postedAt || '',
        ageInDays: reel.ageInDays || Math.round((reel.age_hours || 0) / 24),
        postHour: reel.postHour || 0,
        postDay: reel.postDay || '',
        audio: reel.audio || { songName: 'Original audio', artistName: reel.creator || '' },
        performanceTier: reel.performanceTier || 'average',
        performanceScore: reel.performanceScore || 1,
    };
};

// Reel Card Component
const ReelCard = ({ reel, index }: { reel: CompetitorReel; index: number }) => {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopyHook = () => {
        navigator.clipboard.writeText(reel.spokenHook);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
            {/* Thumbnail Section */}
            <div className="relative aspect-[9/16] max-h-[280px] overflow-hidden bg-slate-900">
                <img
                    src={reel.thumbnail}
                    alt={`Reel by ${reel.creatorName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/270x480?text=Reel";
                    }}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    {/* Rank Badge */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${reel.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' :
                        reel.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700' :
                            reel.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-orange-700 text-white' :
                                'bg-white/90 text-slate-700'
                        }`}>
                        {reel.rank}
                    </div>

                    {/* Performance Tier */}
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg ${getTierColor(reel.performanceTier)}`}>
                        {reel.performanceTier.replace("_", " ")}
                    </span>
                </div>

                {/* Punching Above Weight Badge */}
                {reel.is_punching_above_weight && (
                    <div className="absolute top-12 right-3">
                        <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
                            <Zap size={10} />
                            {reel.views_over_expected.toFixed(1)}x
                        </div>
                    </div>
                )}

                {/* Play button */}
                <a
                    href={reel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                        <Play size={24} className="text-slate-800 ml-1" fill="currentColor" />
                    </div>
                </a>

                {/* Bottom Stats Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1">
                                <Eye size={14} />
                                {formatNumber(reel.views)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Heart size={14} />
                                {formatNumber(reel.likes)}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircle size={14} />
                                {formatNumber(reel.commentsCount)}
                            </span>
                        </div>
                        <span className="flex items-center gap-1 text-sm">
                            <Clock size={12} />
                            {reel.duration}s
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
                {/* Creator Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {reel.creatorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">{reel.creatorName}</p>
                            <p className="text-xs text-slate-400">@{reel.creator}</p>
                        </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getAgeLabelColor(reel.age_label)}`}>
                        {reel.age_label}
                    </span>
                </div>

                {/* Engagement Stats */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100">
                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">{reel.engagementRate.toFixed(1)}%</p>
                        <p className="text-[10px] text-slate-400 uppercase">Engagement</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">{reel.wordsPerMinute}</p>
                        <p className="text-[10px] text-slate-400 uppercase">WPM</p>
                    </div>
                    <div className="text-center">
                        <p className={`text-lg font-bold ${reel.performanceScore >= 1 ? 'text-emerald-600' : 'text-slate-600'}`}>
                            {reel.performanceScore.toFixed(1)}x
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase">Perf.</p>
                    </div>
                </div>

                {/* Hook Preview */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Spoken Hook</span>
                        <button
                            onClick={handleCopyHook}
                            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Copy Hook"
                        >
                            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        "{reel.spokenHook}"
                    </p>
                </div>

                {/* Expand/Collapse */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-indigo-600 py-1 transition-colors"
                >
                    {expanded ? (
                        <>
                            <span>Show Less</span>
                            <ChevronUp size={14} />
                        </>
                    ) : (
                        <>
                            <span>Show More</span>
                            <ChevronDown size={14} />
                        </>
                    )}
                </button>

                {/* Expanded Content */}
                {expanded && (
                    <div className="space-y-3 pt-2 border-t border-slate-100 animate-fadeIn">
                        {/* Audio */}
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Music size={12} />
                            <span className="truncate">{reel.audio.songName} - {reel.audio.artistName}</span>
                        </div>

                        {/* Posting Time */}
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar size={12} />
                            <span>{reel.postDay} at {reel.postHour}:00 ({reel.ageInDays}d ago)</span>
                        </div>

                        {/* Hashtags */}
                        {reel.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {reel.hashtags.slice(0, 5).map((tag, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Full Transcript Preview */}
                        {reel.hasTranscript && (
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Transcript</p>
                                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                                    {reel.transcript}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <a
                                href={reel.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <ExternalLink size={12} />
                                View Reel
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function CompetitorReelsView({ reels }: CompetitorReelsViewProps) {
    const [showAll, setShowAll] = useState(false);

    if (!reels || reels.length === 0) return null;

    // Normalize all reels to consistent format
    const normalizedReels = reels.map(normalizeReel);

    // Sort by rank
    const sortedReels = [...normalizedReels].sort((a, b) => a.rank - b.rank);
    const displayedReels = showAll ? sortedReels : sortedReels.slice(0, 6);

    // Calculate aggregate stats
    const totalViews = normalizedReels.reduce((acc, r) => acc + r.views, 0);
    const avgEngagement = normalizedReels.reduce((acc, r) => acc + r.engagementRate, 0) / normalizedReels.length;
    const viralCount = normalizedReels.filter(r => r.performanceTier?.toLowerCase() === "viral").length;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-fadeInUp">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                        <Play size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Competitor Reels</h2>
                        <p className="text-sm text-slate-500">What's working in your niche</p>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">{formatNumber(totalViews)}</p>
                        <p className="text-xs text-slate-400">Total Views</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">{avgEngagement.toFixed(1)}%</p>
                        <p className="text-xs text-slate-400">Avg Engagement</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-orange-500">{viralCount}</p>
                        <p className="text-xs text-slate-400">Viral Reels</p>
                    </div>
                </div>
            </div>

            {/* Reels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedReels.map((reel, index) => (
                    <ReelCard key={reel.id} reel={reel} index={index} />
                ))}
            </div>

            {/* Show More/Less */}
            {normalizedReels.length > 6 && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-200 transition-colors"
                    >
                        {showAll ? (
                            <>
                                Show Less
                                <ChevronUp size={16} />
                            </>
                        ) : (
                            <>
                                Show All {normalizedReels.length} Reels
                                <ChevronDown size={16} />
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
