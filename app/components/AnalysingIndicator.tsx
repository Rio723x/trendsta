"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useAnalysis } from "@/app/context/AnalysisContext";

export default function AnalysingIndicator() {
    const { isAnalysing, jobStatus } = useAnalysis();

    if (!isAnalysing) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-full shadow-lg">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-sm font-medium text-blue-700">
                {jobStatus === "PENDING" ? "Starting..." : "Analysing..."}
            </span>
        </div>
    );
}
