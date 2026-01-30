"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    RawResearchData
} from "@/app/types/rawApiTypes";

// Re-export for convenience
export type { RawResearchData } from "@/app/types/rawApiTypes";

// Error type with status code
interface ResearchError {
    status: number;
    message: string;
}

// Fetch function with structured error handling
async function fetchResearch(): Promise<RawResearchData> {
    const res = await fetch("/api/research/latest");
    if (!res.ok) {
        const error: ResearchError = { status: res.status, message: "" };
        try {
            const body = await res.json();
            error.message = body.error || "Failed to fetch research";
        } catch {
            error.message = "Failed to fetch research data";
        }
        throw error;
    }
    return res.json();
}

// Query key for research data
export const RESEARCH_QUERY_KEY = ["research", "latest"] as const;

/**
 * Main hook to fetch and cache all research data.
 * Use this as the single source of truth.
 * Returns isNoResearch flag when 404 (no research exists).
 */
export function useResearch() {
    // Check if we already have a 404 error in cache
    const queryClient = useQueryClient();
    const cachedQuery = queryClient.getQueryState(RESEARCH_QUERY_KEY);
    const cachedError = cachedQuery?.error as unknown as ResearchError | undefined;
    const has404 = cachedError?.status === 404;

    const query = useQuery({
        queryKey: RESEARCH_QUERY_KEY,
        queryFn: fetchResearch,
        staleTime: Infinity, // Never refetch unless invalidated
        gcTime: Infinity, // Keep in cache forever (until invalidated)
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnMount: false, // Don't refetch when component mounts
        refetchOnReconnect: false, // Don't refetch when reconnecting
        enabled: !has404, // Disable query if we already have a 404 error
        retry: (failureCount, error) => {
            // Don't retry on 404 (no research exists)
            const researchError = error as unknown as ResearchError;
            if (researchError?.status === 404) return false;
            return failureCount < 3;
        },
    });
    console.log("ERROR:", query.error);
    // Helper: true when 404 (no research exists)
    const researchError = query.error as unknown as ResearchError | undefined;
    const isNoResearch = !!query.error && researchError?.status === 404;
    console.log("isNoResearch:", isNoResearch);
    console.log("query.status:", query.status);
    console.log("query.fetchStatus:", query.fetchStatus);

    // isError is true when query failed (404 or other error)
    // This is useful for pages to break out of loading state
    const isError = query.isError;

    return { ...query, isNoResearch, isError };
}

// ============================================
// Selector hooks for specific data slices
// These reuse the cached data - no extra network calls!
// ============================================

export function useScriptSuggestions() {
    const { data, ...rest } = useResearch();
    return { data: data?.scriptSuggestions, ...rest };
}

export function useOverallStrategy() {
    const { data, ...rest } = useResearch();
    return { data: data?.overallStrategy, ...rest };
}

export function useUserResearch() {
    const { data, ...rest } = useResearch();
    return { data: data?.userResearch, ...rest };
}

export function useCompetitorResearch() {
    const { data, ...rest } = useResearch();
    return { data: data?.competitorResearch, ...rest };
}

export function useNicheResearch() {
    const { data, ...rest } = useResearch();
    return { data: data?.nicheResearch, ...rest };
}

export function useTwitterResearch() {
    const { data, ...rest } = useResearch();
    return { data: data?.twitterResearch, ...rest };
}

// ============================================
// Cache invalidation hook
// Call this when user triggers "Analyze New"
// ============================================

export function useInvalidateResearch() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: RESEARCH_QUERY_KEY });
    };
}
