"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

// Types for the research data
export interface ResearchData {
    id: string;
    socialAccountId: string;
    createdAt: string;
    scriptSuggestions: unknown | null;
    overallStrategy: unknown | null;
    userResearch: unknown | null;
    competitorResearch: unknown | null;
    nicheResearch: unknown | null;
    twitterResearch: {
        latest: unknown;
        top: unknown;
    } | null;
}

// Fetch function
async function fetchResearch(): Promise<ResearchData> {
    const res = await fetch("/api/research/latest");
    if (!res.ok) {
        throw new Error("Failed to fetch research data");
    }
    return res.json();
}

// Query key for research data
export const RESEARCH_QUERY_KEY = ["research", "latest"] as const;

/**
 * Main hook to fetch and cache all research data.
 * Use this as the single source of truth.
 */
export function useResearch() {
    return useQuery({
        queryKey: RESEARCH_QUERY_KEY,
        queryFn: fetchResearch,
        staleTime: Infinity, // Never refetch unless invalidated
        gcTime: Infinity, // Keep in cache forever (until invalidated)
    });
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
