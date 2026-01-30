"use client";

import React from "react";
import { Search, Sparkles } from "lucide-react";

interface NoResearchFoundProps {
    onAnalyse: () => void;
}

export default function NoResearchFound({ onAnalyse }: NoResearchFoundProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <Search className="w-10 h-10 text-blue-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mb-2">
                No research found
            </h2>
            <p className="text-slate-500 text-center max-w-sm mb-6">
                We haven&apos;t analysed your account yet. Run your first analysis to unlock insights and recommendations.
            </p>

            <button
                onClick={onAnalyse}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
                <Sparkles className="w-5 h-5" />
                Analyse Now
            </button>
        </div>
    );
}
