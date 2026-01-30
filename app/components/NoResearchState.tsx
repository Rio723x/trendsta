"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface NoResearchStateProps {
    onAnalyse: () => void;
}

export default function NoResearchState({ onAnalyse }: NoResearchStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md px-4">
                <div className="mb-6">
                    <Sparkles className="w-16 h-16 mx-auto text-purple-300" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                    No Research Yet
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                    Run your first analysis to unlock personalized insights, competitor research, and viral script ideas tailored to your content.
                </p>
                <button
                    onClick={onAnalyse}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2 mx-auto"
                >
                    <Sparkles className="w-5 h-5" />
                    Analyse Now
                </button>
            </div>
        </div>
    );
}
