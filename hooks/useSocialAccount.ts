"use client";

import { useQuery } from "@tanstack/react-query";

interface SocialAccount {
    id: string;
    username: string;
}

interface SocialAccountError {
    status: number;
    message: string;
}

async function fetchSocialAccount(): Promise<SocialAccount> {
    const res = await fetch("/api/user/social-account");
    if (!res.ok) {
        const error: SocialAccountError = { status: res.status, message: "" };
        try {
            const body = await res.json();
            error.message = body.error || "Failed to fetch social account";
        } catch {
            error.message = "Failed to fetch social account";
        }
        throw error;
    }
    return res.json();
}

/**
 * Hook to fetch user's primary social account.
 * Returns the account ID needed for starting analysis.
 */
export function useSocialAccount() {
    const query = useQuery({
        queryKey: ["user", "social-account"],
        queryFn: fetchSocialAccount,
        staleTime: Infinity, // Social account rarely changes
         refetchOnMount: false, // Don't refetch when component mounts
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnReconnect: false, // Don't refetch on network reconnect
        retry: (failureCount, error) => {
            // Don't retry on 404 (no account connected)
            const socialError = error as unknown as SocialAccountError;
            if (socialError?.status === 404) return false;
            return failureCount < 3;
        },
    });

    const socialError = query.error as unknown as SocialAccountError | undefined;
    const hasNoAccount = !!query.error && socialError?.status === 404;

    return { ...query, hasNoAccount };
}
