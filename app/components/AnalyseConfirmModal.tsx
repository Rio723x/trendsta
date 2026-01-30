"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Minus, Loader2, Sparkles, Lock } from "lucide-react";
import { ANALYSIS_CONFIG, calculateAnalysisCost } from "@/lib/analysis/config";
import { useUserCapabilities } from "@/hooks/useUserCapabilities";
import { useAnalysis } from "@/app/context/AnalysisContext";
import { useCompetitorResearch } from "@/hooks/useResearch";

interface AnalyseConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    socialAccountId: string;
}

interface CompetitorProfile {
    username: string;
}

export default function AnalyseConfirmModal({
    open,
    onOpenChange,
    socialAccountId
}: AnalyseConfirmModalProps) {
    const [competitors, setCompetitors] = useState<string[]>([]);
    const [newCompetitor, setNewCompetitor] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const { data: capabilities, isLoading: capLoading } = useUserCapabilities();
    const { data: competitorData } = useCompetitorResearch();
    const { startAnalysis, error: analysisError } = useAnalysis();

    const hasCompetitorAccess = capabilities?.competitorAnalysisAccess ?? false;

    // Load past competitors from last research
    useEffect(() => {
        if (competitorData?.competitors) {
            const profiles = competitorData.competitors as CompetitorProfile[];
            const usernames = profiles.map((c) => c.username);
            setCompetitors(usernames.slice(0, 5)); // Max 5
        }
    }, [competitorData]);

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setLocalError(null);
            setIsSubmitting(false);
        }
    }, [open]);

    const cost = calculateAnalysisCost(competitors.length);

    const addCompetitor = () => {
        const trimmed = newCompetitor.trim().replace(/^@/, "");
        if (trimmed && !competitors.includes(trimmed) && competitors.length < 5) {
            setCompetitors([...competitors, trimmed]);
            setNewCompetitor("");
        }
    };

    const removeCompetitor = (username: string) => {
        setCompetitors(competitors.filter(c => c !== username));
    };

    const handleConfirm = async () => {
        if (!socialAccountId) {
            setLocalError("No social account connected");
            return;
        }

        setIsSubmitting(true);
        setLocalError(null);

        try {
            await startAnalysis(socialAccountId, hasCompetitorAccess ? competitors : []);
            onOpenChange(false);
        } catch {
            // Error is set in context, but we can also set a local one
            setLocalError(analysisError || "Failed to start analysis");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Start Analysis</h2>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-5">
                    {/* Cost Display */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
                        <p className="text-sm text-slate-600 mb-1">This analysis will cost</p>
                        <p className="text-3xl font-bold text-blue-600">
                            {cost} <span className="text-lg font-normal">Stellas</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Base: {ANALYSIS_CONFIG.BASE_STELLA_COST} + {competitors.length} competitors × {ANALYSIS_CONFIG.PER_COMPETITOR_COST}
                        </p>
                    </div>

                    {/* Error Display */}
                    {(localError || analysisError) && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
                            {localError || analysisError}
                        </div>
                    )}

                    {/* Competitor Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-slate-700">Competitors to analyse</h3>
                            {!hasCompetitorAccess && (
                                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                    <Lock className="w-3 h-3" />
                                    Upgrade to unlock
                                </span>
                            )}
                        </div>

                        {/* Competitor Chips */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {competitors.map(username => (
                                <div
                                    key={username}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-full text-sm"
                                >
                                    <span className="text-slate-700">@{username}</span>
                                    <button
                                        onClick={() => removeCompetitor(username)}
                                        disabled={!hasCompetitorAccess}
                                        className="text-slate-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {competitors.length === 0 && (
                                <p className="text-sm text-slate-400 italic">No competitors added</p>
                            )}
                        </div>

                        {/* Add Competitor Input */}
                        {hasCompetitorAccess && competitors.length < 5 && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newCompetitor}
                                    onChange={(e) => setNewCompetitor(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addCompetitor()}
                                    placeholder="@username"
                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={addCompetitor}
                                    className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-5 border-t border-slate-100 bg-slate-50">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isSubmitting || capLoading}
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Starting...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Proceed
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
