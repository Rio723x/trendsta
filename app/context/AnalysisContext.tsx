"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RESEARCH_QUERY_KEY } from "@/hooks/useResearch";

type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | null;

interface AnalysisContextType {
    isAnalysing: boolean;
    jobId: string | null;
    jobStatus: JobStatus;
    error: string | null;
    startAnalysis: (socialAccountId: string, competitorIds?: string[]) => Promise<void>;
    clearJob: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<JobStatus>(null);
    const [error, setError] = useState<string | null>(null);
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const queryClient = useQueryClient();

    const isAnalysing = jobStatus === "PENDING" || jobStatus === "PROCESSING";

    // Poll for job status
    const pollJobStatus = useCallback(async (id: string) => {
        try {
            const res = await fetch(`/api/analysis/${id}/status`);
            const data = await res.json();

            setJobStatus(data.status);

            if (data.status === "COMPLETED") {
                // Invalidate research cache to refresh data
                queryClient.invalidateQueries({ queryKey: RESEARCH_QUERY_KEY });
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                }
            } else if (data.status === "FAILED") {
                setError(data.error || "Analysis failed");
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                }
            }
        } catch (err) {
            console.error("Failed to poll job status:", err);
        }
    }, [queryClient]);

    // Start analysis
    const startAnalysis = useCallback(async (socialAccountId: string, competitorIds: string[] = []) => {
        setError(null);
        try {
            const res = await fetch("/api/analysis/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ socialAccountId, competitorIds }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to start analysis");
            }

            setJobId(data.jobId);
            setJobStatus("PENDING");

            // Start polling every 10 seconds
            pollIntervalRef.current = setInterval(() => {
                pollJobStatus(data.jobId);
            }, 10000);

            // Initial poll after 2 seconds
            setTimeout(() => pollJobStatus(data.jobId), 2000);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to start analysis");
            throw err;
        }
    }, [pollJobStatus]);

    const clearJob = useCallback(() => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
        setJobId(null);
        setJobStatus(null);
        setError(null);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, []);

    return (
        <AnalysisContext.Provider value={{ isAnalysing, jobId, jobStatus, error, startAnalysis, clearJob }}>
            {children}
        </AnalysisContext.Provider>
    );
}

export function useAnalysis() {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error("useAnalysis must be used within an AnalysisProvider");
    }
    return context;
}
