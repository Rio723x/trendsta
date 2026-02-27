"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { RESEARCH_QUERY_KEY } from "@/hooks/useResearch";

type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | null;

interface AnalysisContextType {
    isAnalysing: boolean;
    jobId: string | null;
    jobStatus: JobStatus;
    error: string | null;
    startAnalysis: (options: { socialAccountId: string, competitorUsernames?: string[], reelCountTier?: 'LOW' | 'MEDIUM' | 'HIGH', writingStyle?: string, scriptLanguage?: string, captionLanguage?: string }) => Promise<void>;
    clearJob: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<JobStatus>(null);
    const [error, setError] = useState<string | null>(null);
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const queryClient = useQueryClient();
    const router = useRouter();

    const isAnalysing = jobStatus === "PENDING" || jobStatus === "PROCESSING";

    // Poll for job status
    const pollJobStatus = useCallback(async (id: string) => {
        try {
            const res = await fetch(`/api/analysis/${id}/status`, { cache: "no-store" });
            const data = await res.json();

            setJobStatus(data.status);

            if (data.status === "COMPLETED") {
                // Reset (not just invalidate) so the cached 404 error is cleared.
                // This re-enables the query (which was disabled while has404 was true)
                // and triggers an immediate refetch to show the new dashboard data.
                await queryClient.resetQueries({ queryKey: RESEARCH_QUERY_KEY });
                // Also force a server-component refresh so Next.js picks up fresh data.
                router.refresh();
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
    }, [queryClient, router]);

    // Start analysis
    const startAnalysis = useCallback(async (options: { socialAccountId: string, competitorUsernames?: string[], reelCountTier?: 'LOW' | 'MEDIUM' | 'HIGH', writingStyle?: string, scriptLanguage?: string, captionLanguage?: string }) => {
        setError(null);
        try {
            const res = await fetch("/api/analysis/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(options),
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

    // [NEW] Session Recovery: Check for valid session on mount
    useEffect(() => {
        const checkActiveSession = async () => {
            try {
                const res = await fetch("/api/analysis/active");
                const data = await res.json();

                if (data.isAnalyzing && data.job) {
                    setJobId(data.job.id);
                    setJobStatus(data.job.status);

                    // Start polling immediately
                    pollJobStatus(data.job.id);
                    pollIntervalRef.current = setInterval(() => {
                        pollJobStatus(data.job.id);
                    }, 10000);
                }
            } catch (err) {
                console.error("Failed to recover session:", err);
            }
        };

        checkActiveSession();
    }, [pollJobStatus]);


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
