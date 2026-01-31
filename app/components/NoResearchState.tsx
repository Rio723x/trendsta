"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { useAnalysisStatus } from "@/hooks/useAnalysisStatus";
import AnalysisConfirm from "./AnalysisConfirm";

interface NoResearchStateProps {
    onAnalyse?: () => void; // Optional: Allow external override if needed
}

export default function NoResearchState({ onAnalyse }: NoResearchStateProps) {
    const router = useRouter();
    const { isAnalyzing, mutate } = useAnalysisStatus();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStartAnalysis = async (data: any) => {
        setIsStarting(true);
        setError(null);
        try {
            const res = await fetch("/api/analysis/start", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const resData = await res.json();

            if (!res.ok) throw new Error(resData.error || "Failed to start analysis");

            mutate(); // Refresh status immediately
            setIsConfirmOpen(false);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "Failed to start analysis");
        } finally {
            setIsStarting(false);
        }
    };

    const handleClick = () => {
        if (onAnalyse) {
            onAnalyse();
        } else {
            // Default behavior: Check if analyzing first
            if (isAnalyzing) {
                // Already analyzing, maybe show toast or just let the UI handle it

            } else {
                setIsConfirmOpen(true);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md px-4">
                <div className="mb-6">
                    {isAnalyzing ? (
                        <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
                            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                        </div>
                    ) : (
                        <Sparkles className="w-16 h-16 mx-auto text-purple-300" />
                    )}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                    {isAnalyzing ? "Analysis in Progress" : "No Research Yet"}
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                    {isAnalyzing
                        ? "We are currently analyzing your content. This may take a few minutes. You'll be notified when it's done."
                        : "Run your first analysis to unlock personalized insights, competitor research, and viral script ideas tailored to your content."
                    }
                </p>

                {!isAnalyzing && (
                    <button
                        onClick={handleClick}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2 mx-auto"
                    >
                        <Sparkles className="w-5 h-5" />
                        Analyse Now
                    </button>
                )}

                {isAnalyzing && (
                    <div className="flex items-center justify-center gap-2 text-sm text-purple-600 font-medium">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                    </div>
                )}

                <AnalysisConfirm
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleStartAnalysis}
                    isLoading={isStarting}
                    error={error}
                />
            </div>
        </div>
    );
}
