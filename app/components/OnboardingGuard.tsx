'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';
import { Loader2 } from 'lucide-react';

interface OnboardingGuardProps {
    children: React.ReactNode;
}

/**
 * Wrapper component that redirects users to onboarding if they haven't completed their profile
 * Profile is complete when user has: social account + niche + subNiche
 */
export function OnboardingGuard({ children }: OnboardingGuardProps) {
    const router = useRouter();
    const { isLoading, needsOnboarding } = useProfileCompletion();

    useEffect(() => {
        if (needsOnboarding) {
            router.push('/onboarding');
        }
    }, [needsOnboarding, router]);

    // Show loading while checking profile
    if (isLoading) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <p className="text-theme-secondary">Loading...</p>
                </div>
            </div>
        );
    }

    // If needs onboarding, show nothing (will redirect)
    if (needsOnboarding) {
        return null;
    }

    // Profile complete, render children
    return <>{children}</>;
}
