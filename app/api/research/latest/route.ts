import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// GET /api/research/latest
// Returns the most recent research for the logged-in user
export async function GET(request: Request) {
    try {
        // 1. Auth check
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            // Check for Guest Mode
            const guestEmail = process.env.GUEST_EMAIL;
            if (guestEmail) {
                const guestUser = await prisma.user.findUnique({
                    where: { email: guestEmail },
                });

                if (guestUser) {
                    // Start Guest Logic - Find social account for guest
                    const socialAccount = await prisma.socialAccount.findFirst({
                        where: { userId: guestUser.id },
                        orderBy: { createdAt: "desc" },
                    });

                    if (!socialAccount) {
                        return NextResponse.json(
                            { error: "Guest configurations incomplete." },
                            { status: 500 }
                        );
                    }

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
                        return NextResponse.json(
                            { error: "Guest research not found." },
                            { status: 404 }
                        );
                    }

                    return NextResponse.json({
                        id: research.id,
                        socialAccountId: research.socialAccountId,
                        createdAt: research.createdAt,
                        isGuest: true, // Flag for UI
                        scriptSuggestions: research.scriptSuggestions?.scripts ?? null,
                        overallStrategy: research.overallStrategy?.data ?? null,
                        userResearch: research.userResearch?.data ?? null,
                        competitorResearch: research.competitorResearch?.data ?? null,
                        nicheResearch: research.nicheResearch?.data ?? null,
                        twitterResearch: research.twitterResearch
                            ? {
                                latest: research.twitterResearch.latestData,
                                top: research.twitterResearch.topData,
                            }
                            : null,
                    });
                }
            }

            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Find user's social account
        const socialAccount = await prisma.socialAccount.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        console.log("API Debug - Social account:", {
            found: !!socialAccount,
            socialAccountId: socialAccount?.id,
            username: socialAccount?.username,
        });

        if (!socialAccount) {
            return NextResponse.json(
                { error: "No social account found. Please connect your Instagram account first." },
                { status: 404 }
            );
        }

        console.log("API Debug - Authenticated user:", {
            userId: session.user.id,
            email: session.user.email,
        });

        // 3. Fetch the latest research for this social account
        const research = await prisma.research.findFirst({
            where: {
                socialAccountId: socialAccount.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                scriptSuggestions: true,
                overallStrategy: true,
                userResearch: true,
                competitorResearch: true,
                nicheResearch: true,
                twitterResearch: true,
            },
        });

        console.log("API Debug - Research:", {
            found: !!research,
            researchId: research?.id,
            createdAt: research?.createdAt,
        });

        if (!research) {
            return NextResponse.json(
                { error: "No research found. Please run an analysis first." },
                { status: 404 }
            );
        }

        // 4. Return formatted research data
        return NextResponse.json({
            id: research.id,
            socialAccountId: research.socialAccountId,
            createdAt: research.createdAt,
            scriptSuggestions: research.scriptSuggestions?.scripts ?? null,
            overallStrategy: research.overallStrategy?.data ?? null,
            userResearch: research.userResearch?.data ?? null,
            competitorResearch: research.competitorResearch?.data ?? null,
            nicheResearch: research.nicheResearch?.data ?? null,
            twitterResearch: research.twitterResearch
                ? {
                    latest: research.twitterResearch.latestData,
                    top: research.twitterResearch.topData,
                }
                : null,
        });

    } catch (error) {
        console.error("Error fetching latest research:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
