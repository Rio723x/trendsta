import { useSession } from "@/lib/auth-client";
import { useSocialAccount } from "./useSocialAccount";
import { useQuery } from "@tanstack/react-query";

/**
 * Check if user has completed their profile
 * Profile is complete when user has:
 * 1. A social account (Instagram username)
 * 2. Niche selected
 * 3. SubNiche selected
 */
export function useProfileCompletion() {
    const { data: session, isPending: sessionLoading } = useSession();
    const { data: socialAccount, isLoading: socialAccountLoading } = useSocialAccount();

    // Fetch user profile data (niche/subNiche)
    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const response = await fetch('/api/user/profile');
            if (!response.ok) throw new Error('Failed to fetch profile');
            return response.json();
        },
        enabled: !!session?.user,
    });

    const isLoading = sessionLoading || socialAccountLoading || profileLoading;

    // Check if profile is complete
    const isProfileComplete = !!(
        socialAccount &&
        profile?.niche &&
        profile?.subNiche
    );

    // Check if user needs onboarding
    const needsOnboarding = !!session?.user && !isLoading && !isProfileComplete;

    // Debug logging
    console.log('[useProfileCompletion]', {
        hasSocialAccount: !!socialAccount,
        hasNiche: !!profile?.niche,
        hasSubNiche: !!profile?.subNiche,
        isProfileComplete,
        needsOnboarding,
        isLoading,
    });

    return {
        isLoading,
        isProfileComplete,
        needsOnboarding,
        hasSocialAccount: !!socialAccount,
        hasNiche: !!(profile?.niche && profile?.subNiche),
    };
}
