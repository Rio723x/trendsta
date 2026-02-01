"use client";

import React, { useState } from "react";
import { Play, Eye, Heart, MessageCircle, Share2, Clock, ExternalLink, Zap, TrendingUp } from "lucide-react";
import { ReelData } from "../types/trendsta";

// Helper for relative time (e.g. 2d ago) from hours
function formatTimeAgo(hours: number): string {
    if (hours < 24) {
        return `${hours}h ago`;
    } else if (hours < 168) {
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    } else {
        const weeks = Math.floor(hours / 168);
        return `${weeks}w ago`;
    }
}

export function VelocityBadge({ score }: { score: number }) {
    const getVelocityLevel = (s: number) => {
        if (s >= 5) return { label: "🔥 Hot", className: "score-high" };
        if (s >= 1) return { label: "📈 Rising", className: "score-medium" };
        return { label: "📊 Steady", className: "score-low" };
    };
    const level = getVelocityLevel(score);
    return (
        <span className={`score-badge ${level.className}`}>
            <Zap size={12} />
            {score.toFixed(1)} {level.label}
        </span>
    );
}

interface ReelCardProps {
    reel: ReelData;
    index: number;
    onViewDetails: () => void;
}

export default function ReelCard({ reel, index, onViewDetails }: ReelCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Fallback for title/caption logic
    const displayTitle = reel.captionHook || reel.caption || "No caption";
    // Fallback for creator
    const displayCreator = reel.creator || "Unknown Creator";

    return (

        <div
            className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group hover:border-blue-500/20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            {/* Thumbnail Image - Clickable link to Instagram */}
            <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-[9/16] relative overflow-hidden cursor-pointer"
            >
                <img
                    src={reel.thumbnail}
                    alt={displayTitle}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? "scale-110 brightness-90" : "scale-100 brightness-100"}`}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/270x480/1e293b/94a3b8?text=Reel";
                    }}
                />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <div className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
                        <Eye size={14} className="text-slate-300" />
                        <span className="text-sm font-semibold text-white">{reel.views}</span>
                    </div>
                    {/* Posted time ago - top right */}
                    <div className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
                        <Clock size={12} className="text-slate-300" />
                        <span className="text-xs font-medium text-slate-200">{formatTimeAgo(reel.age_hours)}</span>
                    </div>
                </div>

                {/* Play Icon Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
                    <div className="w-16 h-16 bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transform transition-transform duration-300 hover:scale-110">
                        <Play size={28} className="text-white ml-1" fill="currentColor" />
                    </div>
                </div>

                {/* Hover Overlay with Engagement */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                        <span className="flex items-center gap-1">
                            <Heart size={14} className="text-rose-400" />
                            {reel.likes}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageCircle size={14} className="text-blue-400" />
                            {reel.comments}
                        </span>
                        {/* Share removed as per request */}
                    </div>
                </div>
            </a>

            {/* Card Footer */}
            <div className="p-4">
                {/* Title and Creator */}
                <p className="text-sm font-semibold text-theme-primary line-clamp-2 mb-2">{displayTitle}</p>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-theme-secondary">{displayCreator}</span>
                    {/* Velocity Score */}
                    <VelocityBadge score={reel.velocity_score} />
                </div>

                {/* View Details Button */}
                <button
                    onClick={onViewDetails}
                    className="w-full py-2.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500/30 hover:border-blue-600 rounded-xl transition-all duration-200"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
