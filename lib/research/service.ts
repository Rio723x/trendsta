import { prisma } from "@/lib/prisma";
import { RawResearchData } from "@/app/types/rawApiTypes";

/**
 * Result of the research fetching operation
 */
export type ResearchResult = {
    readonly success: true;
    readonly data: RawResearchData;
    readonly isGuest: boolean;
    readonly researchId: string;
} | {
    readonly success: false;
    readonly error: string;
    readonly statusCode: number;
};

/**
 * Fetches the latest research data for a given user (or guest).
 * This logic is shared between the API route and the AI Consultant.
 */
export async function getLatestResearch(
    userId: string,
    userEmail?: string | null
): Promise<ResearchResult> {
    try {
        let isGuest = false;
        let socialAccount = null;

        // 1. Check for Guest Mode
        // Logic: specific userId (usually from session) might be a guest user if they match the guest email
        // BUT typically we check if the session user is missing. 
        // Here we assume the caller has already authenticated the session user.
        // However, if the caller passes a guest flag or if the user matches guest email, we handle it.

        // Actually, the API route logic was: if (!session.user) -> Check Guest.
        // If we are calling this function, we might have a logged in user OR we might want to fetch guest data.

        // Let's rely on finding the social account first.

        // A. Try to find authenticated user's social account
        socialAccount = await prisma.socialAccount.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        // B. If not found, AND if this user might be a guest fallback (or if we explicitly want guest data)
        // The original logic was: IF NO SESSION USER -> Guest.
        // If we strictly follow that: caller should pass a flag or we check env here.

        // To keep it simple and consistent with the route:
        // If no social account found for this user, we return 404.
        // The "Guest" logic relied on `!session.user`. 
        // Callers of this service should handle the "Guest Mock User" lookup themselves?
        // Or we can encapsulate it here: "If userId is missing, try guest".

        // Let's support an optional `useGuestFallback` param or just handle the guest lookup 
        // IF the passed userId is the Guest User ID.
        // But the guest user ID comes from the DB lookup of GUEST_EMAIL.

        // Better approach: The caller handles deciding WHICH userId to query. 
        // If the caller wants guest data, they resolve the Guest User's ID and pass it here.
        // BUT, looking at the API route, there are slight differences (isGuest flag).

        // Refined Logic:
        // 1. Fetch Social Account for User
        if (!socialAccount) {
            return {
                success: false,
                error: "No social account found. Please connect your Instagram account first.",
                statusCode: 404
            };
        }

        // 2. Fetch Research for Social Account
        const research = await prisma.research.findFirst({
            where: { socialAccountId: socialAccount.id },
            orderBy: { createdAt: "desc" },
            include: {
                scriptSuggestions: true,
                overallStrategy: true,
                userResearch: true,
                competitorResearch: true,
                nicheResearch: true,
                twitterResearch: true,
            },
        });

        if (!research) {
            return {
                success: false,
                error: "No research found. Please run an analysis first.",
                statusCode: 404
            };
        }

        // 3. Format Data
        const formattedData: RawResearchData = {
            id: research.id,
            socialAccountId: research.socialAccountId,
            createdAt: research.createdAt.toISOString(),
            scriptSuggestions: (research.scriptSuggestions?.scripts as any) ?? null,
            overallStrategy: (research.overallStrategy?.data as any) ?? null,
            userResearch: (research.userResearch?.data as any) ?? null,
            competitorResearch: (research.competitorResearch?.data as any) ?? null,
            nicheResearch: (research.nicheResearch?.data as any) ?? null,
            twitterResearch: research.twitterResearch
                ? {
                    latest: (research.twitterResearch.latestData as any),
                    top: (research.twitterResearch.topData as any),
                }
                : null,
        };

        return {
            success: true,
            data: formattedData,
            isGuest: false, // Caller can override if they know it's a guest
            researchId: research.id
        };

    } catch (error) {
        console.error("Error in getLatestResearch service:", error);
        return {
            success: false,
            error: "Internal server error fetching research",
            statusCode: 500
        };
    }
}
