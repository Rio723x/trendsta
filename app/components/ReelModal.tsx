import React from "react";
import { Play, Eye, Heart, MessageCircle, Share2, X, Clock, ExternalLink, TrendingUp } from "lucide-react";
import { VelocityBadge } from "./ReelCard";
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

interface ReelModalProps {
    reel: ReelData;
    onClose: () => void;
}

export default function ReelModal({ reel, onClose }: ReelModalProps) {
    const displayTitle = reel.captionHook || reel.caption || "No caption";
    const displayCreator = reel.creator || reel.creatorName || "Unknown Creator";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeInUp">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white hover:bg-slate-100 rounded-full shadow-md transition-colors"
                >
                    <X size={20} className="text-slate-500" />
                </button>

                <div className="flex flex-col md:flex-row max-h-[90vh]">
                    {/* Image Section */}
                    <a
                        href={reel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative md:w-1/2 aspect-[9/16] md:aspect-auto md:min-h-[400px] flex-shrink-0"
                    >
                        <img
                            src={reel.thumbnail}
                            alt={displayTitle}
                            className="w-full h-full object-cover"
                        />
                        {/* Play overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                            <div className="w-16 h-16 bg-slate-900/90 rounded-full flex items-center justify-center">
                                <Play size={28} className="text-white ml-1" fill="currentColor" />
                            </div>
                        </div>
                    </a>

                    {/* Details Section */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-slate-400" />
                                <span className="text-sm text-slate-500">{formatTimeAgo(reel.age_hours)}</span>
                            </div>
                            <VelocityBadge score={reel.velocity_score} />
                        </div>

                        {/* Creator */}
                        <p className="text-lg font-semibold text-blue-400 mb-4">{displayCreator}</p>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-2 text-slate-500 mb-1">
                                    <Eye size={14} />
                                    <span className="text-xs">Views</span>
                                </div>
                                <p className="text-xl font-bold text-slate-900">{reel.views}</p>
                            </div>
                            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                                <div className="flex items-center gap-2 text-rose-500 mb-1">
                                    <Heart size={14} />
                                    <span className="text-xs">Likes</span>
                                </div>
                                <p className="text-xl font-bold text-slate-900">{reel.likes}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-2 text-blue-500 mb-1">
                                    <MessageCircle size={14} />
                                    <span className="text-xs">Comments</span>
                                </div>
                                <p className="text-xl font-bold text-slate-900">{reel.comments}</p>
                            </div>
                            {/* Replaced Shares with Engagement Rate */}
                            <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                                <div className="flex items-center gap-2 text-green-600 mb-1">
                                    <TrendingUp size={14} />
                                    <span className="text-xs">Engagement Rate</span>
                                </div>
                                <p className="text-xl font-bold text-slate-900">{reel.engagement_rate?.toFixed(2)}%</p>
                            </div>
                        </div>

                        {/* Full Caption */}
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Complete Caption</h3>
                            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm">
                                {reel.caption}
                            </p>
                        </div>

                        {/* All Hashtags */}
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">All Hashtags</h3>
                            <div className="flex flex-wrap gap-2">
                                {reel.hashtags && reel.hashtags.map((tag) => (
                                    <span key={tag} className="tag-pill">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* View on Instagram Button */}
                        <a
                            href={reel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <ExternalLink size={16} />
                            View on Instagram
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
