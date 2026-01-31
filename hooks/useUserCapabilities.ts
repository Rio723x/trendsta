"use client";

import { useQuery } from "@tanstack/react-query";

interface UserCapabilities {
    hasSubscription: boolean;
    planName: string | null;
    competitorAnalysisAccess: boolean;
    aiConsultantAccess: boolean;
}

async function fetchCapabilities(): Promise<UserCapabilities> {
    const res = await fetch("/api/user/capabilities");
    if (!res.ok) {

        throw new Error("Failed to fetch capabilities");
    }
    return res.json();
}

/**
 * Hook to fetch user's plan capabilities.
 * Used for entitlement checks like competitor analysis access.
 */
export function useUserCapabilities() {
    return useQuery({
        queryKey: ["user", "capabilities"],
        queryFn: fetchCapabilities,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
